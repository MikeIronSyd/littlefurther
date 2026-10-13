# Independent repository identities — 13 October 2026

## Goal

Separate the personal and school repositories' Git authorship, account references and authenticated publication. The user explicitly rejected personal attribution on the school repository and selected a fresh private school repository after learning that rewriting Git commits cannot erase an existing repository's Activity actors.

## Context Pointers

Original source `e716dbaf07c76875018c4c4a905d399e0f2ac83e`; original school repository ID1402126097. The existing personal repository remains the canonical local development checkout. The original school repository is preserved until a fully reviewed replacement exists and the final replacement action is authorized. [Publication procedure](../../../operations/repository-publication.md).

### R36 research and decisions

| Need | Actual finding | Status |
| --- | --- | --- |
| Cause and extent |55linear unsigned commits use the personal author/committer email. School API lists that account as its contributor and write collaborator. One main branch; no tags, PRs, issues, releases, forks or Actions runs. | Verified |
| Platform identity |GitHub associates commit emails with accounts; push actors are separate Activity records. Rewriting an existing repository cannot erase its old Activity actors and cached old-SHA views. Contributor data can take24hours to refresh. | Verified primary guidance |
| User decision |Fresh private school repository, preserving source and a verified local backup; separate school CLI authorization explicitly approved. | Settled13October |
| School identity/access |Authenticated school CLI `api user` returns MikeIronSyd ID332818283; school owner ADMIN readback. Its credential configuration is ignored and separate from the personal profile. | Verified |
| Recoverability |Complete local bundle of original main verifies at55commits. Original repositories and unrelated local refs/hooks remain intact. | Verified |
| Isolated projection |First research run rewrites55commits, checks656distinct historical text blobs and preserves source/tests/package/lockfile, names, dates, subjects and parent topology. Independent review identifies current-summary and attached-revision corrections before publication. | Feasible; corrections required |
| Replacement collision |Owner-authenticated read of temporary name `littlefurther-school-prepared` returns404. Exact private metadata and branch readback are required after creation. | Verified; recheck at creation |

Research is complete for local correction and preparation. Publication and final replacement have their own observable gates below. This is repository-operation work; no frontend, API, learner data, credential disclosure, provider request or new dependency is involved.

Primary sources: [commit email](https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address), [Activity](https://docs.github.com/en/repositories/viewing-activity-and-data-for-your-repository/using-the-activity-view-to-see-changes-to-a-repository), [contributors](https://docs.github.com/en/repositories/viewing-activity-and-data-for-your-repository/viewing-a-projects-contributors), [cached history](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository), [Git push](https://git-scm.com/docs/git-push). Native Git plumbing is used in an isolated repository; no filter-branch or global Git changes.

## Constraints

Preserve the personal history; its normal documentation commits may advance it without rewriting it. Remove the school push URL from personal origin and block direct school pushes from that checkout. Prepare the school variant in a separate ignored repository with its verified school author and committer identity. Never push original/source/backup/Codex refs, maps, bundles, credentials or runtime data. School publishing must authenticate as the school owner, including the first push actor.

School documentation must contain school destinations only, with no standalone personal login/ID. Historical evidence references are mapped to corresponding school commits and clearly labelled as adapted identity copies, not new checks or retrospective approvals. Preserve protected application blobs and original artwork/capture bytes. Different Git heads are expected; content equivalence replaces identical-head verification.

Create and review a temporary private school repository first. Preserve the existing school repository until its replacement is concrete and reviewed. Do not delete it merely to clear the name while preparation is incomplete. No hosted CI, billing, licensing or application behavior changes.

### Acceptance criteria and ordered plan

| ID | Acceptance and check |
| --- | --- |
| RI01 |Verified complete original bundle; original personal history remains intact; no global configuration or unrelated hooks changed. |
| RI02 |Every reachable school commit has verified school author/committer identity, preserved dates/names/subjects/topology; all historical UTF8text is free of standalone personal login/ID. |
| RI03 |Current school README, context and operating instructions identify only school publication. Revision links resolve to mapped school history; original source/test/dependency/artwork bytes are unchanged. |
| RI04 |Fresh private repository has independent ID, only main, school-only contributor/author/committer/push actor and no inherited personal collaborator or old Activity. |
| RI05 |Separate checkout, authentication, push destination and normal subsequent publication; reject ancestor mismatch and never require equal heads across accounts. |
| RI06 |Independent review, scoped documentation validation, exact remote readbacks, preserved tracker histories and final replacement result recorded truthfully. |

Sequence: backup/inspect → correct local projection and current operating records → independent review and focused checks → create/push school staging under school authentication → read back current interface/history/metadata → authorize final replacement → replace only school destination → update/read back trackers and publish documentary closeout independently.

## Done When

RI01–RI06 have actual results, the user can open the final school repository without personal attribution in its history/content/Activity, both private destinations have independently verified heads, and future publication cannot accidentally rejoin the histories. Existing external tracker history remains historical; no claims about erasing third-party caches or globally deleting the personal account are made.

## Verification

Preparation is in progress. Original bundle verified; school authentication verified; original school repository and personal head preserved. Isolated first-run results and review findings above are not a remote delivery claim. Final results follow actual checks.
