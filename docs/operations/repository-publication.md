# Publish under each repository's own identity

## Goal

Keep the private project copies separate in Git authorship, documentation and authenticated publishing while delivering equivalent application source.

## Context Pointers

The13October user decision supersedes the earlier dual-push and identical-head policy. See [identity specification](../specs/capstone/increments/repository-identities.md). Dated records describe the historical workflow; they are not permission to reconnect the histories.

## Constraints

1. Inspect the checkout's origin URL and configured author email before committing. Authenticate the publishing process as that repository's owner; check `gh api user` under the intended child-scoped profile. Do not change global credentials or Git identity.
2. Use a separate checkout and owner identity for each repository. The main development checkout's origin has one push destination. Its school readback remote is deliberately blocked for pushing.
3. The ignored `.local/repository-identities/prepare-school.mjs` prepares the school projection on this PC. It maps both authorship fields and evidence revisions, removes other-account references and preserves application files. Its private receipt maps the two histories. It never pushes. Review its output and the school checkout before delivery.
4. For subsequent updates, compare the prepared school main with its remote main. Require remote main to be an ancestor; use a normal explicit main-only push from the school checkout with school authentication. Stop on divergence. Never use mirror/all-ref pushes or import the original history into the school repository.
5. Verify each destination against its own expected commit. Their heads are intentionally different. Compare protected source/tests/dependencies and artwork/capture bytes to establish content equivalence.
6. Preserve unrelated hooks, ignored secrets, learner data and local recovery material. Backups and private revision maps stay on this PC. Global CodexRecovery remains outside project publication.

An independent clone of either repository can develop normally using its own owner identity. The local projection helper is an operator migration tool, not a prerequisite for running LittleFurther.

## Done When

Each published main resolves to its independently expected SHA and owner identity; school historical content and contributors contain no other-account identity; application source remains equivalent. Record actual saved tracker and remote results without claiming identical hashes or new application tests.
