param(
  [string]$Node = 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe',
  [string]$Pnpm = 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd'
)
$ErrorActionPreference = 'Stop'
$env:PATH = (Split-Path -Parent $Node) + ';' + $env:PATH
$fixtureRoot = $PSScriptRoot
$logRoot = Join-Path $fixtureRoot 'check-logs'
New-Item -ItemType Directory -Path $logRoot -Force | Out-Null
$results = [System.Collections.Generic.List[object]]::new()
function Invoke-RecordedCheck {
  param([string]$Label, [string]$Executable, [string[]]$Arguments)
  $started = [DateTimeOffset]::UtcNow.ToString('o')
  $output = & $Executable @Arguments 2>&1 | Out-String
  $exitCode = $LASTEXITCODE
  $output | Set-Content -LiteralPath (Join-Path $logRoot ($Label + '.log')) -Encoding utf8
  $results.Add([pscustomobject]@{
    label = $Label
    executable = $Executable
    arguments = $Arguments
    workingDirectory = $fixtureRoot
    startedAt = $started
    exitCode = $exitCode
    log = 'check-logs/' + $Label + '.log'
  })
  Write-Output ($Label + ': exit ' + $exitCode)
  if ($exitCode -ne 0) { throw ('Research check failed: ' + $Label) }
}
Push-Location -LiteralPath $fixtureRoot
try {
  Invoke-RecordedCheck 'frozen-install' $Pnpm @('install', '--frozen-lockfile', '--ignore-scripts', '--reporter=append-only')
  Invoke-RecordedCheck 'strict-typescript' $Pnpm @('exec', 'tsc', '-p', 'tsconfig.json')
  Invoke-RecordedCheck 'http-sqlite-fixture' $Node @('compiled/fixture.js')
  Invoke-RecordedCheck 'vite-build' $Pnpm @('exec', 'vite', 'build')
} finally {
  $files = @('package.json', 'pnpm-lock.yaml', 'tsconfig.json', 'fixture.ts', 'vite.config.ts', 'web/index.html', 'web/main.ts', 'run-checks.ps1')
  $hashes = foreach ($file in $files) {
    [pscustomobject]@{ file = $file; sha256 = (Get-FileHash -LiteralPath $file -Algorithm SHA256).Hash.ToLowerInvariant() }
  }
  [pscustomobject]@{
    kind = 'isolated research; not product implementation or final application verification'
    generatedAt = [DateTimeOffset]::UtcNow.ToString('o')
    commands = $results.ToArray()
    hashes = $hashes
  } | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath 'verification.json' -Encoding utf8
  Pop-Location
}
