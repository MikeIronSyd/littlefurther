import {
  CIRCLE_LIMITS,
  type CircleDetail,
  type CircleInvite,
  type CircleInviteCreated,
  type CircleItemKind,
  type CircleSummary,
  ENCOURAGEMENT_PRESETS,
  type EncouragementPreset,
  type MeResponse,
  type PlanDetail,
  type ShareCircleItemInput,
} from "../shared/contracts.js";
import { errorKey, RequestError, request } from "./api.js";
import { bind, getLocale, type MessageKey, message } from "./i18n.js";
import { button, el, field, focusHeading, input, named, notice, text } from "./ui.js";

const presetLabels: Record<EncouragementPreset, MessageKey> = {
  keep_going: "encourageKeepGoing",
  small_steps_count: "encourageSmallSteps",
  glad_you_returned: "encourageReturn",
};

function circleError(error: unknown): MessageKey {
  if (!(error instanceof RequestError)) return "genericError";
  const codes: Record<string, MessageKey> = {
    invite_unavailable: "inviteUnavailable",
    already_member: "circleAlreadyMember",
    circle_limit: "circleLimit",
    member_limit: "circleMemberLimit",
    shared_item_limit: "circleItemLimit",
    invite_limit: "circleInviteLimit",
    owner_must_close: "circleOwnerMustClose",
    idempotency_conflict: "circleRetryConflict",
    invalid_input: "circleInvalid",
  };
  return codes[error.code] ?? (error.status === 409 ? "circleConflict" : errorKey(error));
}

interface WriteOperation {
  path: string;
  body: object;
  after: (value: unknown) => Promise<void>;
  reconcile: () => Promise<void>;
}

export function showCircles(
  host: HTMLElement,
  me: MeResponse,
  privatePlan: PlanDetail | null,
  onBack: () => void,
  canLeave: () => boolean,
  setDirty: (value: boolean) => void,
  isCurrent: () => boolean,
): void {
  const view = el("section", "circle-view");
  const status = el("div", "circle-status");
  const body = el("div", "circle-body");
  const back = button("backLearning", () => navigate(onBack), "text-button");
  let busy = false;
  let generation = 0;
  let pending: WriteOperation | null = null;
  let lockedControls:
    | {
        control: HTMLInputElement | HTMLButtonElement | HTMLSelectElement | HTMLTextAreaElement;
        disabled: boolean;
      }[]
    | null = null;
  let tokenNode: HTMLInputElement | null = null;
  let joinTokenNode: HTMLInputElement | null = null;
  const active = (): boolean => view.isConnected && isCurrent();
  const unlock = (): void => {
    for (const { control, disabled } of lockedControls ?? []) control.disabled = disabled;
    lockedControls = null;
  };
  const time = (value: string): HTMLElement => {
    const node = el("time");
    node.dateTime = value;
    bind(node, () => {
      node.textContent = new Intl.DateTimeFormat(getLocale(), {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: me.profile?.timezone ?? "Africa/Lagos",
      }).format(new Date(value));
    });
    return node;
  };
  const forgetToken = (): void => {
    if (tokenNode) tokenNode.value = "";
    if (joinTokenNode) joinTokenNode.value = "";
    tokenNode = null;
    joinTokenNode = null;
  };
  function navigate(action: () => void): void {
    if (busy || !canLeave()) return;
    forgetToken();
    pending = null;
    generation += 1;
    action();
  }
  function announce(key: MessageKey, danger = false): void {
    const node = notice(key, danger);
    node.tabIndex = -1;
    status.replaceChildren(node);
    node.focus();
  }
  function deny(error: unknown): boolean {
    if (
      error instanceof RequestError &&
      (error.status === 401 || error.status === 403 || error.status === 404)
    ) {
      forgetToken();
      pending = null;
      setDirty(false);
      body.replaceChildren(
        text("h1", "circleTitle"),
        notice(error.status === 401 ? "signedOut" : "circleAccessLost", true),
        button("circleList", () => void read(loadList)),
      );
      status.replaceChildren();
      focusHeading(view);
      return true;
    }
    return false;
  }
  async function read(
    action: () => Promise<void>,
    outcome?: "saved" | "reconciled",
  ): Promise<void> {
    if (busy) return;
    busy = true;
    back.disabled = true;
    status.replaceChildren(notice("loadingCircles"));
    try {
      await action();
      if (active()) {
        unlock();
        pending = null;
        setDirty(false);
        status.replaceChildren(
          outcome
            ? notice(outcome === "saved" ? "circleActionSaved" : "circleActionReconciled")
            : document.createTextNode(""),
        );
      }
    } catch (error) {
      if (active() && !deny(error)) {
        announce(
          outcome === "saved"
            ? "circleSavedRefresh"
            : outcome === "reconciled"
              ? "circleReconcileFailed"
              : circleError(error),
          true,
        );
        status.append(button("circleRefresh", () => void read(action, outcome)));
      }
    } finally {
      busy = false;
      if (active()) back.disabled = false;
    }
  }
  async function write(operation: WriteOperation): Promise<void> {
    if (busy) return;
    busy = true;
    pending = operation;
    back.disabled = true;
    lockedControls ??= [
      ...body.querySelectorAll<
        HTMLInputElement | HTMLButtonElement | HTMLSelectElement | HTMLTextAreaElement
      >("input,button,select,textarea"),
    ].map((control) => ({ control, disabled: control.disabled }));
    for (const { control } of lockedControls) control.disabled = true;
    body.setAttribute("aria-busy", "true");
    status.replaceChildren(notice("saving"));
    let saved = false;
    let uncertain = false;
    let completed = false;
    try {
      const result = await request<unknown>(operation.path, "POST", operation.body);
      if (!active()) return;
      saved = true;
      pending = null;
      setDirty(false);
      await operation.after(result);
      completed = true;
      if (active()) announce("circleActionSaved");
    } catch (error) {
      if (!active()) return;
      if (saved) {
        if (!deny(error)) {
          announce("circleSavedRefresh", true);
          status.append(button("circleRefresh", () => void read(operation.reconcile, "saved")));
        }
      } else if (error instanceof RequestError && (error.status === 403 || error.status === 404)) {
        // A missing mutation target or action denial does not establish lost membership.
        pending = null;
        try {
          await operation.reconcile();
          if (active()) {
            setDirty(false);
            announce("circleActionReconciled");
          }
        } catch (refreshError) {
          if (active() && !deny(refreshError)) {
            uncertain = true;
            announce("circleReconcileFailed", true);
            status.append(
              button("circleRefresh", () => void read(operation.reconcile, "reconciled")),
            );
          }
        }
      } else if (
        !(error instanceof RequestError) ||
        error.status === 0 ||
        error.status >= 500 ||
        error.code === "UNEXPECTED"
      ) {
        uncertain = true;
        announce("circleUncertain", true);
        status.append(
          button("circleRetry", () => {
            if (pending) void write(pending);
          }),
          button("circleCheckSaved", () => void read(operation.reconcile)),
        );
      } else {
        pending = null;
        if (!deny(error)) announce(circleError(error), true);
      }
    } finally {
      busy = false;
      if (active()) {
        body.removeAttribute("aria-busy");
        back.disabled = false;
        if (!uncertain && (!saved || completed)) unlock();
      }
    }
  }
  function mutate(path: string, after: () => Promise<void>): void {
    void write({ path, body: { requestId: crypto.randomUUID() }, after, reconcile: after });
  }
  function confirmation(
    action: MessageKey,
    explanation: MessageKey,
    confirm: MessageKey,
    run: () => void,
    values: Record<string, string | number> = {},
  ): HTMLElement {
    const area = el("div", "circle-confirmation");
    const trigger = button(
      action,
      () => {
        const cancel = button(
          "cancel",
          () => {
            area.replaceChildren(trigger);
            trigger.focus();
          },
          "button subtle",
        );
        const warning = text("p", explanation, "", values);
        warning.tabIndex = -1;
        area.replaceChildren(warning, el("div", "form-actions", cancel, button(confirm, run)));
        warning.focus();
      },
      "text-button",
    );
    area.append(trigger);
    return area;
  }
  function audience(detail: CircleDetail): HTMLElement {
    const members = el("ul", "circle-audience-list");
    for (const member of detail.members)
      members.append(
        el(
          "li",
          "",
          el("span", "", member.displayName),
          member.isSelf ? text("span", "circleYou", "hint") : null,
        ),
      );
    return el(
      "section",
      "circle-audience",
      text("h2", "circleAudience"),
      el("h3", "", detail.circle.name),
      text("p", "circleMemberCount", "hint", { count: detail.members.length }),
      members,
      text("p", "circleFutureMembers", "hint"),
    );
  }
  function privacy(): HTMLElement {
    return el(
      "section",
      "circle-privacy",
      text("h2", "circleSharedFields"),
      el(
        "ul",
        "",
        text("li", "circleSharedOnly"),
        text("li", "circlePrivateFields"),
        text("li", "circleCopyUnchanged"),
      ),
      text("p", "circleRecall", "hint"),
    );
  }
  async function loadList(): Promise<void> {
    const version = ++generation;
    const result = await request<{ circles: CircleSummary[] }>("/api/circles");
    if (!active() || version !== generation) return;
    forgetToken();
    const list = el("ul", "circle-list");
    for (const circle of result.circles)
      list.append(
        el(
          "li",
          "circle-list-row",
          el(
            "div",
            "",
            el("h2", "", circle.name),
            text(
              "p",
              circle.role === "owner" ? "circleOwnerSummary" : "circleMemberSummary",
              "hint",
              { count: circle.memberCount },
            ),
          ),
          button("openCircle", () => navigate(() => void read(() => loadCircle(circle.id)))),
        ),
      );
    const name = input("text", "circleName");
    name.required = true;
    name.maxLength = CIRCLE_LIMITS.name;
    const create = el("form", "circle-form");
    named(create, "createCircle");
    const createButton = text("button", "createCircle", "button");
    createButton.type = "submit";
    create.append(text("h2", "createCircle"), field("circleName", name), createButton);
    create.addEventListener("input", () => setDirty(true));
    create.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!create.reportValidity()) return;
      if (!name.value.trim()) {
        announce("circleInvalid", true);
        return;
      }
      const operation: WriteOperation = {
        path: "/api/circles",
        body: { requestId: crypto.randomUUID(), name: name.value.trim() },
        after: (value) => loadCircle((value as { circleId: string }).circleId),
        reconcile: loadList,
      };
      void write(operation);
    });
    const token = input("text", "inviteCode");
    joinTokenNode = token;
    token.required = true;
    token.maxLength = 100;
    token.autocomplete = "off";
    token.spellcheck = false;
    const join = el("form", "circle-form");
    named(join, "joinCircle");
    const joinButton = text("button", "joinCircle", "button");
    joinButton.type = "submit";
    join.append(
      text("h2", "joinCircle"),
      field("inviteCode", token, "circleJoinDisclosure"),
      joinButton,
    );
    join.addEventListener("input", () => setDirty(true));
    join.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!join.reportValidity()) return;
      void write({
        path: "/api/circle-invites/redeem",
        body: { requestId: crypto.randomUUID(), token: token.value.trim() },
        after: (value) => {
          token.value = "";
          return loadCircle((value as { circleId: string }).circleId);
        },
        reconcile: loadList,
      });
    });
    body.replaceChildren(
      text("h1", "circleTitle"),
      text("p", "circleCopy", "subtitle"),
      result.circles.length ? list : text("p", "circleEmpty", "empty-copy"),
      el("div", "circle-entry-forms", create, join),
    );
    focusHeading(view);
  }
  async function loadCircle(id: string): Promise<void> {
    const version = ++generation;
    const detail = await request<CircleDetail>(`/api/circles/${id}`);
    if (!active() || version !== generation) return;
    forgetToken();
    renderCircle(detail);
  }
  function renderCircle(detail: CircleDetail): void {
    const id = detail.circle.id;
    const reload = (): Promise<void> => loadCircle(id);
    const heading = el("h1", "", detail.circle.name);
    const feed = el("section", "circle-updates", text("h2", "circleUpdates"));
    const self = detail.members.find((member) => member.isSelf);
    if (!detail.items.length) feed.append(text("p", "circleNoUpdates", "hint"));
    for (const item of detail.items) {
      const row = el("article", "circle-item");
      row.dataset.itemId = item.id;
      row.append(
        text("h3", item.kind === "commitment" ? "circleCommitment" : "circleCheckIn"),
        el("p", "circle-byline", el("strong", "", item.authorName), " · ", time(item.createdAt)),
        el("p", "circle-message", item.text),
      );
      if (item.encouragements.length) {
        const encouragements = el("ul", "circle-encouragements");
        for (const encouragement of item.encouragements)
          encouragements.append(
            el(
              "li",
              "",
              el("strong", "", encouragement.senderName),
              " · ",
              text("span", presetLabels[encouragement.preset]),
              " · ",
              time(encouragement.createdAt),
            ),
          );
        row.append(encouragements);
      }
      if (item.authorMemberId === self?.id)
        row.append(
          confirmation("deleteSharedCopy", "deleteSharedCopyHelp", "confirmDeleteCopy", () =>
            mutate(`/api/circles/${id}/items/${item.id}/delete`, reload),
          ),
        );
      else {
        const form = el("form", "circle-encourage-form");
        const select = el("select");
        select.name = "encouragement";
        for (const preset of ENCOURAGEMENT_PRESETS) {
          const option = text("option", presetLabels[preset]);
          option.value = preset;
          select.append(option);
        }
        const previous = item.encouragements.find((value) => value.senderMemberId === self?.id);
        if (previous) select.value = previous.preset;
        const send = text(
          "button",
          previous ? "updateEncouragement" : "sendEncouragement",
          "button",
        );
        send.type = "submit";
        form.append(field("encouragement", select), send);
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          void write({
            path: `/api/circles/${id}/items/${item.id}/encouragement`,
            body: { requestId: crypto.randomUUID(), preset: select.value },
            after: reload,
            reconcile: reload,
          });
        });
        row.append(form);
      }
      feed.append(row);
    }
    const sidebar = el("aside", "circle-sidebar", audience(detail));
    const membership = el("details", "circle-management", text("summary", "circleMembership"));
    const memberList = el("ul", "circle-member-list");
    for (const member of detail.members) {
      const row = el(
        "li",
        "",
        el(
          "div",
          "",
          el("strong", "", member.displayName),
          " · ",
          text("span", member.role === "owner" ? "circleOwner" : "circleMember", "hint"),
        ),
      );
      if (detail.circle.role === "owner" && !member.isSelf)
        row.append(
          confirmation(
            "removeMember",
            "removeMemberHelp",
            "confirmRemoveMember",
            () => mutate(`/api/circles/${id}/members/${member.id}/remove`, reload),
            { name: member.displayName },
          ),
        );
      memberList.append(row);
    }
    membership.append(
      memberList,
      detail.circle.role === "owner"
        ? confirmation("closeCircle", "closeCircleHelp", "confirmCloseCircle", () =>
            mutate(`/api/circles/${id}/close`, loadList),
          )
        : confirmation("leaveCircle", "leaveCircleHelp", "confirmLeaveCircle", () =>
            mutate(`/api/circles/${id}/leave`, loadList),
          ),
    );
    sidebar.append(membership);
    if (detail.circle.role === "owner") sidebar.append(invitationPanel(detail));
    body.replaceChildren(
      button("circleList", () => navigate(() => void read(loadList)), "text-button"),
      el(
        "div",
        "page-heading circle-heading",
        heading,
        button("writeSharedCopy", () => navigate(() => compose(detail)), "button primary"),
      ),
      text("p", "circleFutureMembers", "hint"),
      button("circleRefresh", () => navigate(() => void read(reload)), "text-button"),
      el("div", "circle-columns", feed, sidebar),
    );
    focusHeading(view);
  }
  function invitationPanel(detail: CircleDetail): HTMLElement {
    const id = detail.circle.id;
    const panel = el("details", "circle-management", text("summary", "circleInvitations"));
    const list = el("div", "circle-invites");
    const output = el("div", "circle-token");
    const reload = async (): Promise<void> => {
      const version = generation;
      const result = await request<{ invites: CircleInvite[] }>(`/api/circles/${id}/invites`);
      if (!active() || !panel.isConnected || version !== generation) return;
      list.replaceChildren();
      for (const invite of result.invites) {
        const row = el(
          "div",
          "circle-invite",
          el("p", "hint", text("span", "inviteExpires"), " ", time(invite.expiresAt)),
          confirmation("revokeInvite", "revokeInviteHelp", "confirmRevokeInvite", () =>
            mutate(`/api/circles/${id}/invites/${invite.id}/revoke`, async () => {
              forgetToken();
              output.replaceChildren();
              await reload();
            }),
          ),
        );
        list.append(row);
      }
      if (!result.invites.length) list.append(text("p", "circleNoInvites", "hint"));
    };
    let loaded = false;
    panel.addEventListener("toggle", () => {
      if (panel.open && !loaded) {
        loaded = true;
        void read(reload);
      }
    });
    const create = button("createInvite", () => {
      forgetToken();
      output.replaceChildren();
      let creationKnown = false;
      void write({
        path: `/api/circles/${id}/invites`,
        body: { requestId: crypto.randomUUID() },
        after: async (value) => {
          creationKnown = true;
          const result = value as CircleInviteCreated;
          if (result.token) {
            tokenNode = input("text", "createdInviteCode", result.token);
            tokenNode.readOnly = true;
            tokenNode.autocomplete = "off";
            tokenNode.spellcheck = false;
            output.replaceChildren(
              field("createdInviteCode", tokenNode, "inviteShownOnce"),
              el("p", "hint", text("span", "inviteExpires"), " ", time(result.invite.expiresAt)),
            );
          } else output.replaceChildren(notice("inviteCodeLost", true));
          await reload();
        },
        reconcile: async () => {
          if (!creationKnown) output.replaceChildren(notice("inviteCodeUncertain", true));
          await reload();
        },
      });
    });
    panel.append(text("p", "invitePossession", "hint"), create, output, list);
    return panel;
  }
  function compose(detail: CircleDetail): void {
    generation += 1;
    const form = el("form", "circle-compose-form");
    named(form, "circleComposeTitle");
    const kind = el("select");
    kind.name = "sharedKind";
    for (const [value, label] of [
      ["commitment", "circleCommitment"],
      ["check_in", "circleCheckIn"],
    ] as const) {
      const option = text("option", label);
      option.value = value;
      kind.append(option);
    }
    const draft = el("textarea");
    draft.name = "sharedText";
    draft.required = true;
    draft.maxLength = CIRCLE_LIMITS.text;
    draft.rows = 5;
    const preview = el("section", "circle-preview");
    let approved: ShareCircleItemInput | null = null;
    const share = button(
      "shareCommitment",
      () => {
        if (!approved) return;
        const copy = approved;
        void write({
          path: `/api/circles/${detail.circle.id}/items`,
          body: copy,
          after: () => loadCircle(detail.circle.id),
          reconcile: () => loadCircle(detail.circle.id),
        });
      },
      "button primary",
    );
    const invalidate = (): void => {
      approved = null;
      share.hidden = true;
      preview.replaceChildren(text("p", "circlePreviewHelp", "hint"));
    };
    const previewButton = text("button", "previewSharedCopy", "button");
    previewButton.type = "submit";
    form.addEventListener("input", () => {
      invalidate();
      setDirty(true);
    });
    form.addEventListener("change", () => {
      invalidate();
      setDirty(true);
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const normalized = draft.value.trim();
      if (!normalized) {
        announce("circleInvalid", true);
        draft.focus();
        return;
      }
      approved = {
        requestId: crypto.randomUUID(),
        kind: kind.value as CircleItemKind,
        text: normalized,
      };
      const title = text("h2", "circlePreviewTitle");
      title.tabIndex = -1;
      preview.replaceChildren(
        title,
        text("p", approved.kind === "commitment" ? "circleCommitment" : "circleCheckIn", "hint"),
        el(
          "article",
          "circle-preview-copy",
          el("strong", "", me.user.name),
          text("p", "circlePostingTime", "hint"),
          el("p", "circle-message", normalized),
        ),
        text("p", "circleNotShared", "hint"),
      );
      bind(share, () => {
        share.textContent = message(
          kind.value === "commitment" ? "shareCommitment" : "shareCheckIn",
        );
      });
      share.hidden = false;
      title.focus();
    });
    form.append(
      field("sharedKind", kind),
      field("sharedMessage", draft, "sharedMessageHint"),
      previewButton,
      preview,
    );
    const sidebar = el("aside", "circle-sidebar");
    if (privatePlan)
      sidebar.append(
        el(
          "section",
          "circle-private-context",
          text("h2", "circlePrivateContext"),
          el("h3", "", privatePlan.plan.goal),
          text("p", "currentProgress", "", {
            done: privatePlan.progress.completed,
            total: privatePlan.progress.total,
          }),
        ),
      );
    sidebar.append(audience(detail), privacy());
    body.replaceChildren(
      button(
        "backCircle",
        () => navigate(() => void read(() => loadCircle(detail.circle.id))),
        "text-button",
      ),
      text("h1", "circleComposeTitle"),
      text("p", "circleComposeHelp", "subtitle"),
      el("div", "circle-columns circle-compose", form, sidebar),
      el(
        "div",
        "circle-share-actions",
        button(
          "cancel",
          () => navigate(() => void read(() => loadCircle(detail.circle.id))),
          "button subtle",
        ),
        share,
      ),
    );
    status.replaceChildren();
    invalidate();
    focusHeading(view);
  }
  view.append(back, status, body);
  host.replaceChildren(view);
  body.append(text("h1", "circleTitle"), text("p", "loadingCircles", "loading-state"));
  // Shell navigation destroys this view. Clear any visible bearer value promptly.
  const observer = new MutationObserver(() => {
    if (!active()) {
      forgetToken();
      pending = null;
      observer.disconnect();
    }
  });
  observer.observe(host, { childList: true });
  void read(loadList);
}
