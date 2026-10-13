# LittleFurther: complete user guide

Core app documented on **10 October 2026**, Africa/Lagos, against source revision `e2b6fae`; optional contextual AI added **13 October 2026** in section 28. This guide uses the **English button and field names**. Selecting **Français** changes interface labels; the same features remain available. It describes the local prototype, including its limits. Actual verification and delivery are recorded in the [AI increment record](specs/capstone/increments/ai-assistance-verification.md).

## 1. What the app does and where each feature lives

LittleFurther connects planning, studying, reflection, progress, returning after a break and optional peer support in one learning journey. The capability names are useful for explaining the product; most are not separate tabs.

| Capability | Where to use it | Purpose |
| --- | --- | --- |
| Local account and preferences | Sign-in/account creation; Account → Preferences | Keep personal learning records separate and confirm language/timezone |
| TinySteps | Create a learning plan; Edit plan; Edit step | Turn supplied topics or a supported starter into editable small actions |
| Personal StudyCircle | Start study session; Private reflection; Choose the next action | Study, optionally reflect, and choose what follows |
| Flexible consistency | Study-days strip on My learning and Activity | Recognize saved study days without a punitive streak reset |
| FinishLine | Completed/total steps, Your path, Retained history | See current scope and preserve evidence of previous effort |
| Comeback | Review restart dates; Try a 5-minute restart | Review revised dates or take a small study action after interruption |
| Private peer StudyCircle | Study together → Open study circles | Invitation-only commitments, check-ins and preset encouragement |
| Multiple journeys and history | Journeys; Choose a journey; Activity | Keep goals separate and inspect the selected goal's records |
| Presentation/navigation | Language, moon/sun, sidebar, mobile drawer | Use English/French, light/dark and responsive navigation |

The usual sequence is: **create account → confirm timezone → create/review/save plan → study → save minutes/reflection → optionally complete the action → inspect progress → return or adjust → optionally involve peers**. Peer support is never required.

## 2. Open the app

1. Open **http://127.0.0.1:4317/** while the local server is running.
2. If a valid session exists, the app can open your learning directly. Otherwise it shows **Sign in**.
3. While signed out, the header contains LittleFurther, **Language** and the moon/sun button. Navigation and account controls appear after sign-in.

The LF mark/name is an identity, not a clickable home link. Use **My learning** to return to learning. This prototype runs on this PC; another person's device cannot reach this PC by opening its own `127.0.0.1` address.

## 3. Create an account

1. On Sign in, choose **New here? Create an account**.
2. Enter **Display name**: the name peers will see if you later join a circle.
3. Enter **Email address** as your local login identifier.
4. Enter **Password**, between **8 and 128 characters**. Spaces count; the app does not trim your password.
5. Optionally use the eye button, **Show password**, to check your typing. Use **Hide password** to mask it again.
6. Choose **Create an account** once. Wait for the request; form controls temporarily disable while it runs.
7. After successful creation/sign-in, confirm your timezone as described below.

The display name must be nonblank and at most 80 characters; email is required and at most 254 characters. There is no repeat-password field. This account is separate from a Google, Miva or GitHub account: the prototype has no social sign-in. Email ownership is not verified and no email is sent. Password reset/change is not available in this version, so retain the credentials you choose.

Switching between sign-in and account creation creates a fresh blank form and masks the password. Authentication fields do not have the unsaved-work confirmation used by plan forms.

## 4. Sign in, reveal a password and switch accounts

1. Enter the existing local account's **Email address** and **Password**.
2. If needed, select **Show password**; select **Hide password** when finished checking it.
3. Choose **Sign in** and wait.
4. Your saved account language is restored. A profile without a confirmed timezone is sent to first-use preferences.

The reveal button does not submit the form. Theme/language changes preserve the typed password and current reveal state. Reloading or opening a fresh authentication form starts masked.

To switch accounts, save intended work, open **Account → Sign out**, wait for Sign in, and enter the other account's credentials. Ordinary tabs in the same browser profile share a session; for simultaneous two-account demonstrations use separate browser sessions, such as a normal window and a private/incognito window on this PC.

## 5. Confirm or change timezone and language

On first use, **Make the dates work for you** asks for **Timezone**. The device timezone is only a suggestion.

1. Enter a valid timezone such as `Africa/Lagos`.
2. Suggestions also include `Africa/Nairobi`, `Africa/Dakar`, `Africa/Cairo`, `Europe/Paris`, `Europe/London`, `America/New_York`, `Asia/Dubai` and `UTC`. You can type another recognized timezone; this is not a closed list.
3. Select **English** or **Français** in **Language** if desired.
4. Choose **Save preferences and continue**.

First-use preferences have no Cancel button; timezone confirmation is required before plan creation. Later, open **Account → Preferences**, edit Timezone, and save, or use **Cancel** to abandon changes. A timezone is at most 100 characters; use a named timezone rather than a numeric UTC offset.

Changing language updates the interface immediately. With an existing signed-in profile, the app attempts to save the language immediately. A signed-out choice lasts for the current page, rather than being a saved browser language setting. If a language save fails, the current interface can still show the chosen language; do not assume it persisted.

Saved language/timezone changes apply to all your existing plans' presentation preferences. They do not move scheduled dates or translate your saved goal/action/reflection/message text. A timezone change can regroup timestamped study into different calendar days and change displayed event dates.

## 6. Theme, sidebar, mobile navigation and keyboard

**Theme:** choose the moon, **Switch to dark mode**, or the sun, **Switch to light mode**. Hover or keyboard-focus it to see its action tooltip. The action changes after each click. With no valid saved theme and no choice made on this page, theme follows the device. An explicit choice overrides device changes; there is no in-app button to reset that override back to automatic device following.

**Desktop navigation:** use **My learning**, **Journeys** and **Activity**. **Collapse sidebar** creates a compact rail; hover or focus its links for labels. **Expand sidebar** restores the full rail. The directional panel icon is the sidebar control, distinct from the LF logo.

**Narrow/mobile navigation:** choose **Open navigation**. Select a destination, **Close**, or press **Escape**. Focus stays inside the open drawer and returns logically when it closes. The background cannot be operated while the drawer is open; use its explicit close controls rather than relying on a backdrop click. Widening to desktop also closes it safely.

**Account:** the header disclosure shows your name or initial, depending on available space. It contains **Preferences** and **Sign out**. Activate Account again to close it.

**Keyboard:** Tab/Shift+Tab move between controls; Enter/Space activate buttons. The focused **Skip to content** link jumps to the main area. Escape dismisses a theme tooltip or closes the mobile drawer. Controls have visible focus. Use the app's navigation and Back/Cancel buttons; browser Back is not a complete history of visited app sections.

Theme and desktop-sidebar choices are saved for that browser origin, shared by accounts using it. If browser storage is blocked, both remain usable for the current page, but reload persistence is unavailable. They are not cross-device preferences. Theme/language/sidebar changes preserve the active form.

## 7. Create a plan from your own material — TinySteps

1. On the empty learning screen, choose **Create a learning plan**. If plans already exist, use **Journeys → Create a learning plan**.
2. Enter **Learning goal**, for example “Complete my introductory statistics unit.”
3. Under **Start from**, choose **My own topics or course sections**.
4. In **Your topics or sections**, enter one action per line, for example:

   ```text
   Read the introduction to descriptive statistics
   Work through a mean and median example
   Summarize what I learned
   ```

5. In **Dates you are available**, enter actual dates as `YYYY-MM-DD`, separated by commas or new lines. For example: `2026-10-10, 2026-10-12, 2026-10-14`. Use dates appropriate to your own schedule.
6. Optionally enter **Fixed target date (optional)**.
7. Optionally enter **Reference links (optional)**, one complete `http://` or `https://` URL per line.
8. Choose **Review draft steps**.
9. Review and adjust all resulting actions using the controls in section 9.
10. Choose **Confirm and save plan**. Wait for the saved message and My learning.

A goal title alone does not generate a course. Each nonblank supplied topic becomes an action with an initial 10-minute estimate. Dates are assigned in their entered order, one per action; if actions outnumber dates, the remaining actions initially reuse the last entered date. Duplicate availability dates are removed. Enter dates chronologically for a predictable first draft.

No plan is saved merely by reviewing it. After review, edit the action rows; the initial topic box is hidden and Start from is locked. Cancel and begin again if you want a different starting point. Saving another plan creates a separate journey rather than replacing the previous one.

## 8. Create a plan from the available starter

1. Choose **Create a learning plan**.
2. Under **Start from**, select **Build a simple web page**. This is the one curated starter currently included.
3. Read **Supported outcome**, **Before you start** and **Template sources**.
4. Enter availability, an optional fixed target and optional personal references.
5. Enter your own Learning goal, or leave it blank to use the starter title.
6. Choose **Review draft steps**, adjust the suggestions, then **Confirm and save plan**.

| Suggested action | Initial minutes |
| --- | ---: |
| Choose your page purpose | 5 |
| Set up your file | 10 |
| Build the page structure | 15 |
| Add a heading and paragraph | 10 |
| Add a link and image | 15 |
| Style your page | 20 |
| Check a small screen | 10 |
| Finish and reflect | 5 |

The starter links to MDN HTML/CSS lessons, with a recorded checked date of 7 October 2026. Basic familiarity with files, a text editor and a browser is expected. The app saves editable suggested actions and links, not the external lessons themselves. Estimates are suggestions, not deadlines or assessed ability. The draft uses the interface language selected when you review it; later language switching does not translate saved action text.

## 9. Review, add, reorder and remove actions

In **Review every step**, each **Step N of M** contains:

- **Action**: edit its title.
- **Study date**: edit its planned date.
- **Estimated minutes**: enter a whole number.
- **Move step up / Move step down**: move it one position. The first/last row disables the corresponding direction.
- **Remove**: remove that row from the unsaved active draft.

Choose **Add a step** to append an empty action. It initially uses the first available date and 10 minutes; fill in its title and adjust the defaults. The visible count shows the maximum of 50 active rows. At the maximum, Add a step is disabled; remove a row before adding another.

Review **Review your schedule** warnings for dates outside availability or beyond your fixed target. These are warnings, not automatic corrections; ordinary saving is allowed. Invalid dates, empty required fields or invalid minutes are validation errors instead.

Choose **Confirm and save plan** for a new plan, or **Save revised plan** for an existing one. **Cancel** abandons the draft, subject to unsaved-input confirmation.

## 10. Read My learning and choose an action

The selected journey shows **Your next step**, your goal, completed/total progress, the highlighted action and its estimate, **Your path**, personal study/review guidance, study-day tracking, return support and optional circle entry.

The next action is the **first unfinished action in your chosen order**, not the earliest scheduled date. **Your path** labels rows **Complete**, **Next action** or **Upcoming**.

1. Choose **Start study session** for the highlighted action.
2. Alternatively, click any unfinished action in Your path, including an upcoming one, to study it.
3. Completed rows are informational; they do not reopen a study form from the path.

You can work out of order. The highlighted next action continues to follow your saved order and completion state.

## 11. Study, use references and save a private reflection

1. Open a study action. The screen is **A little study is still study**.
2. Use your learning material. **Your references** can contain your own URLs and version-matched **Template sources**, with checked dates.
3. Set **Minutes you studied** to the actual whole minutes you want to report. It initially contains the action estimate (or five minutes when using the restart action). The estimate remains separately visible; the app does not time your study automatically.
4. Optionally enter **Private reflection (optional)**, for example what you understood or what to revisit.
5. Choose **Save study session**.
6. Wait for **Your study session is saved.**
7. Optionally complete the whole action separately, or choose **Choose the next action**/**Back**.

There is no study timer. Minutes are learner-reported. Saving records the current server time; no backdating field exists. Blank reflection is allowed and is not shared automatically.

After a successful save, the current minutes/reflection become read-only and Save disappears. To log another session on an unfinished action, return and open that action again. Saved study logs/reflections have no edit/delete control.

Reference links open separately and may require internet. The app does not fetch, download, summarize or verify their educational content. If the saved starter version is unavailable, the study screen explains that its source metadata is unavailable; your own references remain. A manual plan without references does not show an empty reference section.

## 12. Use the five-minute restart

1. On the highlighted next action, choose **Try a 5-minute restart**.
2. The ordinary study form opens with Minutes you studied set to 5.
3. Study, correct the minutes if needed, optionally reflect, and **Save study session**.

This prefills a small study log. It does not start a countdown, revise dates or automatically complete the action.

## 13. Mark an action complete — separately from logging study

1. Open an unfinished action's study screen.
2. When the whole action is done, choose **Mark this step complete**.
3. Wait for **Step completed. Your earlier effort is still recorded.**
4. Choose **Choose the next action** to return.

Saving study never completes an action automatically. Completing an action never saves minutes/reflection automatically or adds a study day. You can complete without logging a session. If you have typed unsaved minutes/reflection, save them separately before leaving; completion does not clear those unsaved edits. The still-open form can save a session after completion, but completed path rows cannot later open a new form.

The completion button disappears after success. There is no Undo completion control. Completion is a self-report, not a grade or proof of mastery.

## 14. FinishLine, an all-complete plan and an empty active plan

**N of M steps complete** describes the selected plan's current active rows, including completed rows. Up to 12 rows use numbered markers; larger plans use a progress bar plus the readable count.

When all active rows are complete, the banner says **You have completed this plan's active steps.** You can inspect Activity, **Edit plan**, or **Create a learning plan**. There are no unfinished dates for Comeback.

An existing plan whose rows were all removed instead says **Your plan has no active steps.** Use **Add a step** to open its editor. An empty scope is not presented as an earned completion. Earlier history remains.

Changing active scope can change the completed/total fraction. Historical completions remain recorded, so current counts and lifetime history counts can differ. No certificate or mastery assessment is produced.

## 15. Flexible consistency and Activity

1. Open the desired journey, then select **Activity**.
2. Read the date range and timezone beneath the study-days count.
3. Read **Retained history**, the historical completion count, study-session entries, saved private reflections, completion entries and scope-change entries.
4. If you have multiple plans, use **Choose a journey** to inspect another.

**Study days** counts distinct calendar dates with saved study activity over today and the previous six dates, in your confirmed timezone. Several sessions today count as one study day. Completion alone does not count. Unrecorded days are neutral; there is no failing-day status or loss of earlier records.

**N sessions · M minutes studied** is cumulative across all time for that selected journey, rather than restricted to the displayed seven-day range. All these counters are per journey; Activity is not an all-goals dashboard.

History retains the action title at the time of the study/completion event. Removing a step does not erase its earlier work. Scope entries show **Active scope changed from N to M steps**; a saved revision may record the same before/after count. Session/completion lists currently display earliest entries first; scope-change records are most recent first. There is no search/filter/edit/delete/export control in Activity.

With no study logs, the app explains **No study activity yet. Your first session can be a small one.** Completion history can still exist independently.

## 16. Open multiple journeys and edit a saved plan

**Journeys** lists goals and active-step counts, with newest-created plans first. Choose **Open journey** beside a goal. More than one plan also enables **Choose a journey** on My learning and Activity. A fresh load selects the first available plan unless a current choice already exists in that page session. There is no per-journey deep link or journey deletion/restore screen.

To revise a plan:

1. Open it and choose **Edit plan** beside its goal.
2. Edit goal, availability, optional target, references and unfinished actions. Add, reorder or remove rows as needed.
3. If removing previously saved rows, check **I understand that removing … steps changes the active scope. Earlier work remains in history.** Further removal clears this acknowledgement again.
4. Choose **Save revised plan**.

**Edit step** beside the highlighted action opens this same full editor and focuses that action's Action field, labelled **Editing step N of M**. It is not a separate one-step editor.

Completed action titles/dates/estimates stay read-only. You may reorder or remove those rows; removal archives their history rather than erasing it. There is no archive browser. Existing-plan editing locks Start from. Changing availability/target does not automatically reschedule the existing rows. An existing plan may be saved with zero active rows; a new plan requires at least one.

## 17. Comeback: revise a schedule after interruption

1. On My learning, choose **Review restart dates** under **Your completed work is still here.** It is available when an unfinished action exists.
2. On **Review your revised schedule**, set **Restart date**. The initial suggestion is today in your timezone; it is editable.
3. Choose **Preview revised dates**. Nothing is saved yet.
4. Read **Current and proposed dates**, the number of days moved, and **Your completed work stays**.
5. Review warnings for unavailable dates or dates beyond the fixed target. If you intend to proceed with conflicts, check **I understand these conflicts. My target and availability will stay unchanged.**
6. Choose **Apply revised plan** to save the nonzero change, or **Cancel / Back to my learning** to leave saved dates unchanged.

The first unfinished action in your saved order anchors the shift. Every unfinished action moves by the same number of calendar days, earlier or later; order and spacing remain. It does not automatically fit your availability or extend the target. Completed dates, previous sessions/reflections and scope history remain.

Editing Restart date invalidates the old preview/acknowledgement; preview again. A zero-day preview disables application. A move outside 2000–2100 is rejected without changing dates. **Edit plan** opens the ordinary editor when you want to adjust availability, target or individual rows instead. Comeback does not log study or complete actions.

If the plan changed after preview, choose **Reload saved plan** and preview again. If a response is uncertain, use **Retry the same change** or reload; the same change can safely be retried without shifting twice. If dates saved but loading failed, use **Open saved plan**. Reloading never applies a new shift automatically.

## 18. Open, create or join private StudyCircles

Choose **Open study circles** under **Study together**. This is also available before creating a learning plan. The list shows circle name, your **Owner/Member** role, member count and **Open circle**.

**Create:** enter **Circle name**, then **Create a circle**. A trimmed name must have 1–80 characters. You become the owner.

**Join:** paste **Invitation code**, read the joining disclosure, then **Join a circle**. Your display name becomes visible to members, and you gain access to their names and retained shared copies. Joining does not share your plan or study history.

An account can belong to five active circles; each circle holds ten members including its owner. For a two-account local demonstration, use separate browser sessions against this same running server. The product does not email invitations or connect remote devices.

## 19. Owner invitations

1. Open your circle and expand **Invitations**.
2. Choose **Create invitation**.
3. Manually select/copy **New invitation code** while it is visible. There is no automatic copy button or email send.
4. Give that code to the intended participant in the local demonstration. They paste it into Join a circle using their own account.

A code allows one successful join before its 24-hour expiry. Anyone holding it can use it. It is shown only in that view and cannot later be retrieved. There may be at most ten active unused invitations.

Unused invitations display **Expires** and **Revoke invitation**. To invalidate one, choose Revoke invitation, read the explanation, then **Confirm revocation**. Existing members and private study stay unchanged.

If a code is lost, revoke its unused invitation and create a replacement. After uncertain creation, inspect active invitations first. Already-member/full-circle failures leave a valid invitation unused. For expired, revoked or used codes, ask the owner for a new code to an active circle. A closed circle cannot be reopened; use another active or newly created circle.

## 20. Preview and share a commitment or check-in

1. Choose **Open circle**, then **Write a shared copy**.
2. Under **Copy type**, select **Commitment** for intended work or **Check-in** for an update.
3. Type **Message**, 1–280 trimmed characters. Write only what you want peers to receive.
4. Choose **Preview copy**.
5. Inspect **What your circle will see**, the exact trimmed text/type/name, audience and sharing disclosures. Posting time is added when you share. This preview is not a post.
6. Choose **Share commitment** or **Share check-in**.

Only the type, chosen message, display name, posting time and preset encouragement are shared. **Your private learning context**, when present, is a separate view of your selected goal/progress; it is not automatically added to the message. Your private plan, references, reflections and other activity remain private.

Changing message/type invalidates the preview; preview again before sharing. **Cancel / Back to circle** leaves through the unsaved-input guard when needed. Theme/language/sidebar changes retain input.

Current **and future** members can read retained copies. Posts are immutable: no edit control. Later private-plan changes do not update a shared copy. To replace one, delete your old copy and deliberately share another. A circle retains at most 100 copies.

## 21. Give preset encouragement and refresh information

On another member's copy:

1. Choose **Preset encouragement**: **Keep going**, **Small steps count**, or **Glad you returned**.
2. Choose **Send encouragement**.
3. To replace your existing response on that copy, choose another preset and **Update encouragement**.

There is one preset per sender/copy, not multiple reactions. You cannot send encouragement on your own copy. There is no free-text reply or chat.

Circle details show **Shared commitments and check-ins**, author names/times, encouragement, **Your circle audience**, the roster and **Members and circle settings**. Use **Refresh circle information** to obtain current state, or **All my circles** to return to the list. There is no background polling or live push.

## 22. Delete, leave, remove a member or close a circle

These controls show an explanation first and require a second explicit confirmation. Cancel the confirmation if you want to keep the current state.

| Who / action | Steps | What changes |
| --- | --- | --- |
| Author deletes a copy | **Delete my shared copy → Confirm copy deletion** | That copy and attached encouragement are deleted; private learning remains |
| Member leaves | Expand **Members and circle settings → Leave circle → Confirm leaving** | Their shared copies/attached encouragement and encouragement they sent are deleted; they lose access; private learning remains |
| Owner removes another member | **Members and circle settings → Remove member → Confirm member removal** | Same cleanup for that member; their private learning remains |
| Owner closes circle | **Members and circle settings → Close circle → Confirm circle closure** | Shared copies/encouragement deleted, unused invitations invalidated, access ends for everyone; private learning remains |

Owners close instead of leaving/removing themselves. No circle rename, ownership transfer or reopening control exists. Another member's copy cannot be deleted through the author's control; the owner has member-removal/closure controls.

Access changes are enforced on the next request. Already-seen information cannot be recalled. Refresh discovers confirmed loss of access and clears displayed circle content. Private account study history survives these circle operations.

## 23. Save, cancel and recover safely

**Tracked unsaved work:** plan edits, study input, preferences, circle name/invitation entry and shared-copy composing can trigger **Leave this form and discard your unsaved input?** Cancel the browser confirmation to keep editing; confirm only to discard. Browser reload/close also requests an unsaved-work warning where tracked. It is not autosave; exact browser wording varies. Authentication form switching is the exception described earlier.

**Saving:** wait for the saved confirmation. Buttons can temporarily disable while requests run. Theme/language changes are not substitutes for saving the active plan or study log.

| Situation | What to do |
| --- | --- |
| Server unreachable | Keep the current page open, restart/check the local server, then retry. Avoid reloading away unsaved input |
| Failed initial/route loading | Choose **Try again** after resolving the server issue |
| Incorrect sign-in / repeated attempts | Check credentials, then wait before retrying if you made rapid attempts. There is rate limiting without a countdown; the generic credentials message does not prove only the password is wrong |
| Creation failed | Check details or try Sign in before repeatedly creating; creation may have succeeded while subsequent sign-in failed |
| Invalid input | Correct the identified field while retaining your draft. Timezone, reference and known single-field errors retain their hints and recover focus after the form unlocks. Repeated-row or unknown errors use the form message rather than guessing a row |
| Ordinary editor/study says plan changed in another window | Preserve wanted unsaved text separately, then deliberately reopen/reload the saved journey and reconcile edits. Those screens do not have a Reload saved plan button; reloading discards unsaved input |
| Comeback stale/uncertain response | Use its explicit **Reload saved plan / Retry the same change / Open saved plan** controls as offered |
| Circle uncertain action | Use **Retry the same action** or **Check saved information**; avoid sending a new equivalent action blindly |
| Circle saved, latest information failed | Use **Refresh circle information**; refreshing reads state rather than reposting |
| Circle changed / unavailable | Refresh. If access ended, return to your circles; your private learning remains |
| Session ended | Sign in again. Signed-out state removes private navigation/content and safely closes the drawer |
| Sign-out failed | Existing view/input is retained; read the error and retry. Do not assume sign-out succeeded |

An unchanged save retry is protected against duplicate writes. A network error does not prove that the server saved nothing. Inspect saved plan/history/circle state before initiating a different equivalent operation.

## 24. Input and capacity limits

| Item | Current limit |
| --- | --- |
| Display name | 1–80 characters |
| Email | Required valid format, at most 254 characters |
| Password | 8–128 characters |
| Timezone | Recognized name, at most 100 characters |
| Learning goal | 1–160 trimmed characters |
| Topics / actions | New plan 1–50; existing-plan revision 0–50; one supplied topic per nonblank line |
| Action title | 1–240 trimmed characters |
| Estimated / studied minutes | Whole number 1–480 |
| Availability | 1–366 distinct valid dates |
| Study / target / restart dates | Real dates in 2000–2100; target may be empty |
| Personal references | 0–10; at most 2,048 characters each; absolute HTTP(S), no embedded username/password |
| Private reflection | Optional, at most 2,000 characters |
| Circle name / shared message | 1–80 / 1–280 trimmed characters |
| Active circles per account | 5 including owned circles |
| Members per circle | 10 including owner |
| Retained shared copies per circle | 100; authors can delete old copies to free capacity |
| Active unused invitations per circle | 10; single successful use, 24-hour expiry |
| Product save payload | 64 KiB; very large combined input may exceed this even when individual fields fit |

Availability/topic errors can identify invalid dates, excess entries and overlong topic line numbers. A valid date must be a real calendar date, not merely match the written format.

## 25. Saved data, privacy and current omissions

Saved accounts, plans, sessions, reflections and circles live in the local server's database. Refresh, sign-out and ordinary server restart retain saved records when the same data directory is used. Browser storage holds theme/sidebar preferences, not the learning database. Local storage is not a promise of encrypted storage, remote backup or cross-device synchronization.

The installed/built core can work without internet while its local server runs. External resources may still need internet. There is no server-stopped offline app.

The current interface has no guest mode, email verification/delivery/password reset/change, account name/email editing or deletion, learner-data import/export, session/device manager, completion undo, study-log/reflection editing/deletion, whole-journey deletion, browsable archive/restore, PDF import, arbitrary app-side resource fetching, quiz/grading/mastery assessment, certificate, study timer, reminders/push notifications, free-text chat, circle rename/ownership transfer/reopen, or remote-peer/public-hosting flow. Optional AI drafts and deliberate web-search discovery are described in section 28. It has English/French UI, without automatic translation of saved learner content. These are limits of this version, not extra controls to find.

## 26. Optional PC-owner appendix: start, stop and restart

Ordinary learners use the running URL. For the PC owner, from the project directory after dependencies are installed:

```powershell
pnpm --pm-on-fail=download run dev
```

This builds and starts the server; keep its terminal/process running. It is not a hot-reload watcher. Stop with **Ctrl+C** and, if Windows asks, confirm terminating the batch job. Restart the command after source changes. Do not start another instance on the same port/data directory while the first is running.

For the complete prerequisites/install/build procedure, use [local operations](operations/local-demo.md). Tested project pins are Node 24.19.0 and pnpm 11.19.0; initial installation/version provisioning requires internet or a compatible cache.

`CAPSTONE_PORT` selects an available loopback port 1024–65535; use the printed URL. `CAPSTONE_DATA_DIR` selects a directory; default `.local/data`. Preserve the whole directory, including `capstone.sqlite`, its journal files and `auth-secret`. Changing data directories selects a different dataset; losing the auth secret invalidates sessions. Do not delete existing data to restart, run independent servers against one dataset, or commit databases/secrets to Git. Backups, schema recovery and source rollback are maintenance procedures covered separately; there is no in-app destructive reset.

## 27. A complete practice route through the app

1. Create your account, reveal/re-mask the password and confirm `Africa/Lagos` or your own timezone.
2. Create a small manual plan with three actions; review, reorder and save it.
3. Try light/dark and English/French; collapse/expand desktop navigation or open/close mobile navigation.
4. Start study, open a reference if supplied, record actual minutes and optional reflection; save.
5. Mark the action complete separately and return to My learning.
6. Inspect current progress, seven-day markers and Activity's retained records.
7. Open Edit step/Edit plan, add or remove a draft row, review scope acknowledgement, then save or cancel deliberately.
8. Open Comeback, preview a new restart date and inspect conflicts; cancel if only exploring, or apply deliberately.
9. Try a five-minute restart and save the actual minutes you studied.
10. Create a second journey, switch between goals and verify Activity follows the selected goal.
11. If desired, create a circle, invite a separate local account, preview/share a commitment or check-in, and send a preset from the other account.
12. Explore circle settings by reading explanations; confirm deletion/leave/removal/closure only if you intend those effects.
13. Save your work, sign out, sign back in and return to the saved journey.

This route exercises the connected product without requiring peer participation. It demonstrates recorded actions, not verified learning mastery or long-term motivation.

## 28. Optional AI help throughout your journey

AI uses the app's server-managed OpenAI credential. There is no personal-key field or user quota setting. Internet and usable provider allocation are required for AI; the ordinary local app remains available when AI is unavailable. Each panel explains what will leave the local server. Select an AI action deliberately and review its result. Nothing is saved, completed, rescheduled or shared automatically.

### Draft a learning plan

1. Open **Create a learning plan**, enter your goal and at least one available study date. The existing manual/template controls still work.
2. In **Get help drafting your plan**, optionally describe **What you already know** or **Paste learning material**. Paste only material you are comfortable sending to OpenAI. Supplied reference links are included as links; their pages are not automatically read.
3. Review **Search the web for credible learning resources**, which starts selected; clear it if you do not want discovery. Search runs only when you request the draft and may consult pages. Discovery currently favors a bounded set of primary learning sites and cannot guarantee resources for every subject or language.
4. Select **Draft my plan with AI**. Use **Cancel AI request** to stop waiting, or continue manually. Cancellation cannot undo a request already processed by OpenAI.
5. Review the proposed outcome, prerequisites, small steps and clickable sources. Source records show publisher, observation date, URL language hint and whether the link was supplied, listed, cited or opened in search. A listing/citation does not establish that the full page was read. Accuracy, current availability, free access and language suitability still need your review.
6. Choose **Use this draft for review** or **Discard suggestion**. Using it populates editable draft steps; it does not save a journey. Review titles, minutes, dates, references and source associations, then use the existing **Save** action when ready.
7. Keep each retained source's reference link, or select **Remove source** to remove its association. Invalid partially typed links remain editable. Sources linked to completed work cannot be removed through the draft editor. Source staging expires after 24 hours; if an unsaved draft expires, request a new draft rather than treating old source IDs as saved evidence.

The AI drafts an initial segment of up to ten steps, not a guaranteed complete curriculum. If evidence is insufficient, provide relevant material, deliberately search, or use manual planning. AI does not certify job readiness, mastery or completion.

### Make a step smaller

1. On the selected journey, open **Start study session** and find **Make room for a smaller step**.
2. Set **Minutes available for a small session** and select **Make this step smaller**.
3. Read the suggested next action and small activities. Your original learning step, plan scope and completion count remain intact. Use the normal study controls to record work and complete the parent step separately when appropriate.

### Study and reflect

1. Open **Start study session**, then **Help with studying and reflection**.
2. Select **Include this reflection draft in study help** only if you want the current typed draft sent. It starts unselected. Saved reflections and other people's records are not included.
3. Select **Help me study and reflect**. The disclosed goal, selected step, source metadata and plan reference links support the advice; search is not used here.
4. Review the advice. If useful, choose **Use this suggestion in my reflection**. Earlier typed reflection is retained visibly for comparison. Edit your reflection and actual study minutes, then **Save** deliberately. Completing the learning step remains a separate action.

### Return after a break

1. Open the existing Comeback/restart screen.
2. Enter available minutes and select **Help me restart** for advisory help based on unfinished work and schedule facts.
3. Review the suggestion, then take a small study action or use the separate date preview and confirmation controls. AI advice cannot apply dates or rewrite earlier effort.

### Review consistency and FinishLine progress

1. Open the selected journey's progress/Activity area and find **Reflect on your recorded effort**.
2. Select **Summarize my progress**.
3. Read the recap alongside the app's recorded counts and retained history. The recorded numbers remain authoritative. Private saved reflections are not sent. A recap recognizes recorded actions; it does not assess mastery or prove improved motivation.

### Phrase a private-circle draft

1. Open a circle you belong to, select a commitment or check-in, and type your own draft.
2. Select **Help me phrase this**. Only that draft, its message kind and interface language are sent; your plan, reflections, circle identity and other members' posts are excluded.
3. Review the result and choose **Use this wording** if wanted. This replaces the editable wording and invalidates any earlier sharing preview.
4. Edit if needed, then **Preview** and **Share** separately. AI never posts on your behalf. Peer participation remains optional, and these circles are not a free-text chat.

### Cancelling, changing input and recovering from errors

Changing relevant input, language, journey or view invalidates pending advice; signing out or losing access also prevents late results from applying. Ordinary Save/Share operations cancel competing AI work. A refused, malformed, stale, timed-out or unavailable response leaves manual work available. Provider credit/network errors retain inputs; no automatic retry or alternative model/provider is used. You may explicitly try again when ready, but sufficient funding is not guaranteed.

OpenAI requests use `store:false`; this does not mean zero provider retention. Do not send sensitive material that you do not intend to disclose. Server credentials are excluded from source, browser storage and learner controls. This prototype offers contextual help rather than a general chatbot.
