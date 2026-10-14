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

Preparation and staging were verified before replacement. The user explicitly confirmed deletion and replacement on13October; the final school URL is now the fresh repository. Fresh private school repository ID1417816026 was prepared as MikeIronSyd/littlefurther-school-prepared and now uses the final littlefurther name. Source 1e905567 projects to school3bf30850, with57commits and668distinct historical text blobs checked. Independent batch-object audit reports zero wrong identities, personal references, old source-prefix references or invalid targets across298history URL occurrences. Protected application/dependency/artwork/capture bytes are unchanged.

Owner-authenticated GitHub readback confirms57authors/committers exclusively MikeIronSyd, contributor MikeIronSyd57, collaborator MikeIronSydadmin only, branch-creation Activity actor MikeIronSyd, private true, fork false and only rewritten main. The original account-attributed commit object is absent from staging (API422). Browser header also shows school author and no personal label. GitHub MCP commit read returns404; actual successful evidence is school CLI and browser MCP, not provider-connector success. Documentation validation passes13files/123schoolrelative links/703words/eightcapturehashes/twoSVGs; no full application suite rerun.

Immediately before deletion, the original school repository ID1402126097 still matched0718dcf and the complete55commit local bundle verified again. Personal history is preserved and its separate documentation update published at 1e905567. One personal push attempted with the school process profile failed404 without modifying either destination; explicit per-checkout credential helpers then verified and published under the correct personal identity. No credential was printed. The school validator's first run lacked its ignored output directory; creating that directory and rerunning passed.

Final source hashes change during documentary closeout; each destination must be read back independently. TrackerE029/D018 updates are saved and independently compared below. The documentary closeout uses independent normal publications and exact expected-head readback at delivery.


### Actual final replacement

Human authorization was followed by exact target/private/head checks and bundle verification. Browser MCP completed GitHub's deletion confirmation for only the old school repository; the resulting UI alert confirmed deletion and owner-authenticated API returned404. School-authenticated API then renamed the already-reviewed prepared repository ID1417816026 to MikeIronSyd/littlefurther. Readback confirms the new ID, original3bf30850school artifact, private/nonfork status, exact description/seven topics/empty homepage, school-only contributor and Activity actor. Personal origin independently still resolves 1e905567; its ID/history were not replaced. The original history remains in the verified local bundle.

The root miva readback URL now uses school-scoped credentials, with its push URL still blocked. The personal origin has one push URL and its own fixed credential profile. The isolated school checkout origin uses the final school URL and school profile. Future publishing requires independent expected hashes and equivalent protected source, never identical hashes or a shared commit. No force push, all-ref push, new dependency, live AI call, application/data change, hosting or CI activation occurred.


### Tracker reconciliation and documentary closeout — 14 October 2026

The13October saved E029/D018 results are recorded in the [tracker review](../reviews/2026-10-13-repository-identity-trackers.md). Root independently reran the final five-tab comparison: exactly18intended values, zero mismatches or prior-cell style/formula changes, uniqueE029/D018 and exact22,693-character prior Context suffix. Sheets automatically extends the Decisions filter from A1:F18 to A1:F19; that native range change and OOXML style-ID reallocation are qualified rather than claimed absent. Failed/undone UI attempts and final known-state corrections remain documented. No native Sheets connector is credited.

Root independently checked Kaneo's complete152,692-character prior text and180,413-character prior HTML as exact suffixes, the exact3,759-character new prefix and saved HTML digest. A010 now has156,451text/184,879HTML characters; saved task/board metadata is preserved. Both trackers use browser MCP with saved readbacks. No additional write is needed merely to advance documentary commit hashes.

The final focused local identity-document check covers8files/87relative links with zero missing paths, in addition to the presentation validator and independent Git/source review. Older school repository browser tabs were reloaded and no longer show cached personal attribution. The main-only publication helper checks the school account, exact new repository ID/privacy and ancestor relationship; each owner's actual closeout head is read back independently in delivery receipts. Application checks were not rerun for this documentation/Git operation because protected application/dependency/artwork bytes are unchanged. Timed video, learner outcomes and future product work remain separate.
