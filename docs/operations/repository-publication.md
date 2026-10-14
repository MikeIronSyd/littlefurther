# Publish LittleFurther

## Goal

Publish intended non-secret LittleFurther source and documentation to the private MikeIronSyd/littlefurther repository while preserving product data, credentials and existing Git hooks.

## Context Pointers

Use the [development guide](../DEVELOPMENT.md), [current specification](../specs/capstone/spec.md), [verification](../specs/capstone/verification.md) and [status reconciliation](../specs/capstone/increments/status-reconciliation.md). Dated application results identify the checks performed and supporting source; they are not new test runs or repository-publication dates.

## Constraints

1. Inspect origin, branch and author/committer settings before committing. Origin must identify https://github.com/MikeIronSyd/littlefurther.git; authenticate authorized publication as MikeIronSyd without changing global credentials.
2. Review intended changes and preserve unrelated work and hooks. Keep API keys, learner databases, local runtime files, private receipts and generated caches outside Git.
3. Run proportionate checks and independent review. Documentation-only checks do not establish new application behavior or learner outcomes. Resolve blocking findings before publication.
4. Use normal explicit main-branch publication after checking the remote state. Stop on divergence; do not force-push or publish unrelated refs.
5. Read back private visibility, the intended commit and its files through available authenticated tools. A local commit or a successful documentation validator alone is not proof of publication.
6. Record actual outcomes in the Miva Google Sheet and Kaneo, preserving history and checking saved state. Global CodexRecovery is outside project publication; it never receives this project's source, Git history or data. No hosting, CI activation, purchase or paid storage is implied.

## Done When

The private repository's main branch resolves to its intended source commit, authenticated readback confirms the expected files, and authorized tracker results are recorded with their limits. The timed demo, submission, learner validation and production gaps remain separate work.

## Local-only recording material

On 14 October the user requested that video scripts, storyboards and video-rehearsal documents/assets stay on this PC and outside the repository. Existing local copies are ignored; keep future recording preparation in ignored local storage. Publish application source, regression tests and ordinary product/developer documentation through the established procedure. Do not re-add or rename the excluded packet into another published folder.

The cleanup removes the packet from current repository files with normal commits. Published ancestry is preserved; earlier commits retain historical copies. Current-tree removal is not a history purge. Source behavior and learner data remain unchanged. Scoped documentation/link checks, local-copy hashes, unchanged source bytes, independent review, authenticated remote readback and saved tracker comparisons are applicable; no new full application-suite result follows from this documentation change.
