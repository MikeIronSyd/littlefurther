# Isolated template-adaptation evidence

## Goal

Preserve the exact two-string change independently rehearsed for P10/AC12. This example is not applied to the product.

## Context Pointers

[Contract](../../increments/reuse.md), [verification](../../increments/reuse-verification.md) and [setup verification](../../increments/reuse-verification.md) distinguish setup correction, isolated source and browser observations. The [patch](template-wording.patch) applies to candidate `d9a9599b21ac17faefdeeeece5e1ab5da3d847cd`.

## Constraints

Only the first English/French step prompt changes. Template ID/version, supported outcome, sources, prerequisites, estimates and remaining steps stay unchanged. Use a disposable checkout and synthetic data when reproducing it; no product template or existing learner record is overwritten by saving this example. The patch is byte-preserved by a specific `.gitattributes` rule. No native-language certification or learning benefit follows from the wording change.

In a separate checkout at that candidate, `git apply --check <path-to-template-wording.patch>` can check applicability before `git apply`. Then use the pinned launcher and the report's actual build/check/browser sequence. Do not apply it to the primary workspace merely to reproduce the evidence.

## Done When

The report shows new EN/FR drafts using the changed wording, language switching retaining authored draft text, and a previously saved plan retaining its original first step. The exact patch and actual checks support technical extension potential, not human adoption or a newly shipped curriculum.
