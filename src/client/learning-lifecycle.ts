import type {
  CompletionEvent,
  DeletedPlan,
  LearningPlan,
  PlanDetail,
  RemovedStep,
  StudyActivity,
} from "../shared/contracts.js";
import { errorKey, RequestError, request } from "./api.js";
import { cancelAiOperations, sourceList } from "./ai-assistance.js";
import { bind, dateLabel, type MessageKey, message } from "./i18n.js";
import { button, el, field, focusFailure, focusHeading, input, notice, text } from "./ui.js";

export interface LifecycleContext {
  current: () => boolean;
  setDirty: (value: boolean) => void;
  changed: (detail: PlanDetail, outcome?: MessageKey) => void;
  deleted: (planId: string) => void;
}

export function lifecycleError(error: unknown): MessageKey {
  if (error instanceof RequestError) {
    const keys: Record<string, MessageKey> = {
      plan_archived: "lifecycleArchived",
      already_archived: "lifecycleStale",
      not_archived: "lifecycleStale",
      stale_revision: "lifecycleStale",
      restore_conflicts: "lifecycleRestoreConflict",
      restore_limit: "lifecycleRestoreLimit",
      source_unavailable: "lifecycleSourceUnavailable",
    };
    return keys[error.code] ?? errorKey(error);
  }
  return errorKey(error);
}

function expired(error: unknown): boolean {
  if (error instanceof RequestError && error.status === 401) {
    window.dispatchEvent(new Event("littlefurther-session-expired"));
    return true;
  }
  return false;
}

function localDate(value: string, timezone?: string): HTMLTimeElement {
  const node = el("time");
  node.dateTime = value;
  bind(node, () => {
    node.textContent = dateLabel(value, timezone);
  });
  return node;
}

function lockControls(host: HTMLElement): () => void {
  const controls = [
    ...host.querySelectorAll<
      HTMLInputElement | HTMLButtonElement | HTMLSelectElement | HTMLTextAreaElement
    >("input,button,select,textarea"),
  ].map((control) => ({ control, disabled: control.disabled }));
  for (const { control } of controls) control.disabled = true;
  host.setAttribute("aria-busy", "true");
  return () => {
    for (const { control, disabled } of controls) control.disabled = disabled;
    host.removeAttribute("aria-busy");
  };
}

const openConfirmations = new WeakMap<HTMLElement, () => void>();
const confirmationVersions = new WeakMap<HTMLElement, number>();
interface ActionOptions {
  host: HTMLElement;
  detail: PlanDetail | LearningPlan;
  context: LifecycleContext;
  label: MessageKey;
  title: MessageKey;
  copy: MessageKey;
  path: string;
  outcome: MessageKey;
  danger?: boolean;
  fresh?: boolean;
  deletion?: boolean;
  preview?: (detail: PlanDetail, form: HTMLFormElement, confirm: HTMLButtonElement) => () => object;
}

// Keep an uncertain write's exact body and request ID. Refresh is an explicit
// alternative; neither navigation nor an old response can repaint a later view.
function actionControl(options: ActionOptions): HTMLElement {
  const { host, context } = options;
  const wrapper = el("div", "lifecycle-action");
  const panel = el("div", "lifecycle-panel");
  const active = (): boolean => context.current() && wrapper.isConnected;
  let opening = false;
  const trigger = button(
    options.label,
    () => void open(),
    `button subtle${options.danger ? " danger" : ""}`,
  );
  wrapper.append(trigger, panel);

  async function open(): Promise<void> {
    if (!active() || opening) return;
    openConfirmations.get(host)?.();
    const openingVersion = (confirmationVersions.get(host) ?? 0) + 1;
    confirmationVersions.set(host, openingVersion);
    cancelAiOperations();
    opening = true;
    trigger.disabled = true;
    panel.replaceChildren(notice("loading"));
    try {
      const targetPlan = "plan" in options.detail ? options.detail.plan : options.detail;
      const detail = options.fresh
        ? await request<PlanDetail>(`/api/plans/${targetPlan.id}`)
        : options.detail;
      if (!active()) return;
      if (confirmationVersions.get(host) !== openingVersion) {
        panel.replaceChildren();
        trigger.disabled = false;
        return;
      }
      if (!("plan" in detail)) throw new Error("Missing plan action detail");
      const form = el("form", "lifecycle-confirmation");
      const heading = text("h3", options.title);
      heading.tabIndex = -1;
      const status = el("div", "lifecycle-status");
      const confirm = text(
        "button",
        options.label,
        `button${options.danger ? " danger" : " primary"}`,
      );
      confirm.type = "submit";
      let busy = false;
      let pending: object | null = null;
      let release: (() => void) | null = null;
      const close = (): void => {
        if (busy || pending) return;
        panel.replaceChildren();
        context.setDirty(false);
        trigger.disabled = false;
        openConfirmations.delete(host);
      };
      const cancel = button(
        "cancel",
        () => {
          close();
          if (active()) trigger.focus();
        },
        "button subtle",
      );
      form.append(heading, el("p", "lifecycle-context", detail.plan.goal), text("p", options.copy));
      if (options.deletion)
        form.append(
          text("p", "deletePlanCounts", "hint", {
            steps: detail.plan.steps.length,
            sessions: detail.activities.length,
            completions: detail.completions.length,
            changes: detail.scopeEvents.length,
          }),
        );
      const extra = options.preview?.(detail, form, confirm) ?? (() => ({}));
      form.append(el("div", "lifecycle-actions", cancel, confirm), status);
      panel.replaceChildren(form);
      openConfirmations.set(host, close);
      context.setDirty(true);
      heading.focus();

      const refresh = async (): Promise<void> => {
        if (!active() || busy) return;
        busy = true;
        status.replaceChildren(notice("loading"));
        try {
          const saved = await request<PlanDetail>(`/api/plans/${detail.plan.id}`);
          if (!active()) return;
          context.setDirty(false);
          release?.();
          context.changed(saved);
        } catch (error) {
          if (!active() || expired(error)) return;
          if (options.deletion && error instanceof RequestError && error.status === 404) {
            context.setDirty(false);
            release?.();
            context.deleted(detail.plan.id);
          } else {
            status.replaceChildren(notice(lifecycleError(error), true));
            status.append(button("lifecycleRefresh", () => void refresh()));
            focusFailure(status, active);
          }
        } finally {
          busy = false;
        }
      };
      const write = async (): Promise<void> => {
        if (!active() || busy || (!pending && !form.reportValidity())) return;
        cancelAiOperations();
        pending ??= { requestId: crypto.randomUUID(), revision: detail.plan.revision, ...extra() };
        release ??= lockControls(host);
        busy = true;
        status.replaceChildren(notice("saving"));
        try {
          const result = await request<PlanDetail | DeletedPlan>(options.path, "POST", pending);
          if (!active()) return;
          context.setDirty(false);
          release();
          release = null;
          pending = null;
          if ("deletedPlanId" in result) context.deleted(result.deletedPlanId);
          else context.changed(result, options.outcome);
        } catch (error) {
          if (!active() || expired(error)) return;
          const uncertain =
            error instanceof RequestError && (error.status === 0 || error.status >= 500);
          if (uncertain) {
            status.replaceChildren(notice("lifecycleUncertain", true));
            status.append(
              button("lifecycleRetry", () => void write()),
              button("lifecycleRefresh", () => void refresh()),
            );
          } else {
            pending = null;
            release?.();
            release = null;
            trigger.disabled = true;
            status.replaceChildren(notice(lifecycleError(error), true));
            status.append(button("lifecycleRefresh", () => void refresh()));
          }
          focusFailure(status, active);
        } finally {
          busy = false;
        }
      };
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        void write();
      });
    } catch (error) {
      if (active() && confirmationVersions.get(host) === openingVersion && !expired(error)) {
        panel.replaceChildren(notice(lifecycleError(error), true));
        focusFailure(panel, active);
      }
      trigger.disabled = false;
    } finally {
      opening = false;
    }
  }
  return wrapper;
}

export function planActions(
  host: HTMLElement,
  detail: PlanDetail | LearningPlan,
  context: LifecycleContext,
): HTMLElement {
  const plan = "plan" in detail ? detail.plan : detail;
  const lifecycle = Boolean(plan.archivedAt);
  const archive = actionControl({
    host,
    detail,
    context,
    label: lifecycle ? "restorePlan" : "archivePlan",
    title: lifecycle ? "restorePlan" : "archiveConfirm",
    copy: lifecycle ? "archivedReadOnly" : "archiveCopy",
    path: `/api/plans/${plan.id}/${lifecycle ? "restore" : "archive"}`,
    outcome: lifecycle ? "planRestored" : "planArchived",
    fresh: true,
  });
  const remove = actionControl({
    host,
    detail,
    context,
    label: "deletePlan",
    title: "deletePlanConfirm",
    copy: "deletePlanCopy",
    path: `/api/plans/${plan.id}/delete`,
    outcome: "planDeleted",
    fresh: true,
    deletion: true,
    danger: true,
    preview: (_fresh, form, confirm) => {
      const acknowledge = input("checkbox", "confirmPlanDeletion");
      acknowledge.required = true;
      confirm.disabled = true;
      acknowledge.addEventListener("change", () => {
        confirm.disabled = !acknowledge.checked;
      });
      form.append(
        el("label", "checkbox-field", acknowledge, text("span", "deletePlanAcknowledge")),
      );
      return () => ({});
    },
  });
  return el("div", "lifecycle-actions plan-lifecycle-actions", archive, remove);
}

export function showJourneys(
  host: HTMLElement,
  status: "active" | "archived",
  callbacks: {
    current: () => boolean;
    canLeave: () => boolean;
    setDirty: (value: boolean) => void;
    selectStatus: (value: "active" | "archived") => void;
    open: (plan: LearningPlan) => void;
    create: () => void;
    changed: LifecycleContext["changed"];
    deleted: LifecycleContext["deleted"];
  },
): void {
  const view = el("section", "journeys-view");
  const selector = el("select");
  selector.name = "planStatus";
  for (const value of ["active", "archived"] as const) {
    const option = text("option", value === "active" ? "activePlans" : "archivedPlans");
    option.value = value;
    selector.append(option);
  }
  selector.value = status;
  selector.addEventListener("change", () => {
    if (!callbacks.current()) return;
    if (!callbacks.canLeave()) {
      selector.value = status;
      return;
    }
    callbacks.selectStatus(selector.value === "archived" ? "archived" : "active");
  });
  const body = el("div", "journeys-body", notice("loading"));
  view.append(
    el(
      "div",
      "page-heading",
      text("h1", "journeys"),
      button("createGoal", callbacks.create, "button primary"),
    ),
    field("plansStatus", selector),
    body,
  );
  host.replaceChildren(view);
  const active = (): boolean => callbacks.current() && view.isConnected;
  const load = async (): Promise<void> => {
    body.replaceChildren(notice("loading"));
    try {
      const result = await request<{ plans: LearningPlan[] }>(`/api/plans?status=${status}`);
      if (!active()) return;
      const list = el("ul", "journey-list lifecycle-journey-list");
      for (const plan of result.plans) {
        const row = el("li", "journey-row lifecycle-journey-row");
        const summary = el(
          "div",
          "journey-summary",
          el("h2", "", plan.goal),
          text("p", "planCount", "hint", { count: plan.steps.length }),
        );
        if (plan.archivedAt) {
          const archivedAt = plan.archivedAt;
          const archivedDate = el("p", "hint");
          bind(archivedDate, () => {
            archivedDate.textContent = message("archivedDate", {
              date: dateLabel(archivedAt, plan.timezone),
            });
          });
          summary.append(archivedDate);
        }
        const open = button(plan.archivedAt ? "viewArchivedPlan" : "goJourney", () => {
          if (active() && callbacks.canLeave()) callbacks.open(plan);
        });
        // Preview actions fetch fresh owner-scoped detail before showing counts.
        row.append(
          summary,
          el(
            "div",
            "journey-controls",
            open,
            planActions(view, plan, {
              current: active,
              setDirty: callbacks.setDirty,
              changed: callbacks.changed,
              deleted: callbacks.deleted,
            }),
          ),
        );
        list.append(row);
      }
      body.replaceChildren(
        result.plans.length
          ? list
          : text("p", status === "active" ? "noActivePlans" : "noArchivedPlans", "empty-copy"),
      );
    } catch (error) {
      if (!active() || expired(error)) return;
      body.replaceChildren(
        notice(lifecycleError(error), true),
        button("retry", () => void load()),
      );
    }
  };
  void load();
}

export function studyRecordActions(
  host: HTMLElement,
  detail: PlanDetail,
  activity: StudyActivity,
  context: LifecycleContext,
): HTMLElement {
  const actions = el("div", "lifecycle-actions");
  const preview = (_detail: PlanDetail, form: HTMLFormElement): (() => object) => {
    form.append(
      el("p", "", activity.stepTitle),
      el(
        "p",
        "hint",
        localDate(activity.createdAt, detail.progress.timezone),
        ` · ${activity.minutes} min`,
      ),
    );
    if (activity.reflection) form.append(el("p", "reflection-text", activity.reflection));
    return () => ({});
  };
  actions.append(
    actionControl({
      host,
      detail,
      context,
      label: "deleteSession",
      title: "deleteSessionConfirm",
      copy: "deleteSessionCopy",
      path: `/api/plans/${detail.plan.id}/activities/${activity.id}/delete`,
      outcome: "recordRemoved",
      danger: true,
      preview,
    }),
  );
  if (activity.reflection)
    actions.append(
      actionControl({
        host,
        detail,
        context,
        label: "removeReflection",
        title: "removeReflectionConfirm",
        copy: "removeReflectionCopy",
        path: `/api/plans/${detail.plan.id}/activities/${activity.id}/reflection/remove`,
        outcome: "recordRemoved",
        danger: true,
        preview,
      }),
    );
  return actions;
}

export function completionAction(
  host: HTMLElement,
  detail: PlanDetail,
  completion: CompletionEvent,
  context: LifecycleContext,
): HTMLElement {
  return actionControl({
    host,
    detail,
    context,
    label: detail.plan.steps.some((step) => step.id === completion.stepId)
      ? "markUnfinished"
      : "correctCompletion",
    title: "correctCompletionConfirm",
    copy: "correctCompletionCopy",
    path: `/api/plans/${detail.plan.id}/completions/${completion.id}/correct`,
    outcome: "completionCorrectionSaved",
    preview: (_detail, form) => {
      form.append(
        el("p", "", completion.stepTitle),
        el("p", "hint", localDate(completion.createdAt, detail.progress.timezone)),
      );
      return () => ({});
    },
  });
}

export function removedStepsSection(
  host: HTMLElement,
  detail: PlanDetail,
  context: LifecycleContext,
): HTMLElement {
  const section = el(
    "section",
    "activity-records removed-steps",
    text("h2", "removedSteps"),
    text("p", "removedStepsCopy", "hint"),
  );
  const body = el("div", "", notice("loading"));
  section.append(body);
  const active = (): boolean => context.current() && section.isConnected;
  const load = async (): Promise<void> => {
    try {
      const result = await request<{ steps: RemovedStep[] }>(
        `/api/plans/${detail.plan.id}/removed-steps`,
      );
      if (!active()) return;
      const list = el("ul", "history-list");
      for (const candidate of result.steps) {
        const row = el("li", "history-entry", el("h3", "", candidate.step.title));
        row.append(
          el(
            "p",
            "hint",
            localDate(candidate.step.scheduledDate),
            " · ",
            text("span", "estimated", "", { minutes: candidate.step.estimatedMinutes }),
            " · ",
            text("span", candidate.step.completedAt ? "complete" : "unfinished"),
          ),
        );
        if (detail.plan.archivedAt) row.append(text("p", "archivedReadOnly", "hint"));
        else
          row.append(
            actionControl({
              host,
              detail,
              context,
              label: "previewRestoreStep",
              title: "restoreStep",
              copy: "restoreStepCopy",
              path: `/api/plans/${detail.plan.id}/steps/${candidate.step.id}/restore`,
              outcome: "stepRestored",
              preview: (_detail, form, confirm) => {
                bind(confirm, () => {
                  confirm.textContent = message("restoreStep");
                });
                form.append(
                  el("h4", "", candidate.step.title),
                  el(
                    "p",
                    "hint",
                    localDate(candidate.step.scheduledDate),
                    " · ",
                    text("span", "estimated", "", { minutes: candidate.step.estimatedMinutes }),
                    " · ",
                    text("span", candidate.step.completedAt ? "complete" : "unfinished"),
                  ),
                );
                if (candidate.sources.length)
                  form.append(text("h4", "aiAssociatedSources"), sourceList(candidate.sources));
                const selected: HTMLInputElement[] = [];
                if (candidate.references.length) {
                  const links = el(
                    "fieldset",
                    "historical-links",
                    text("legend", "historicalLinks"),
                    text("p", "historicalLinksCopy", "hint"),
                  );
                  for (const url of candidate.references) {
                    const checkbox = input("checkbox", "restoreReference");
                    checkbox.value = url;
                    selected.push(checkbox);
                    const link = el("a", "resource-link", url);
                    link.href = url;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                    const label = el("label", "checkbox-field", checkbox, el("span", "", url));
                    links.append(el("div", "historical-link-choice", label, link));
                  }
                  form.append(links);
                }
                const acknowledge = input("checkbox", "restoreConflicts");
                if (candidate.conflicts.length) {
                  const warnings = el("section", "notice warning", text("h4", "conflicts"));
                  const conflicts = el("ul");
                  for (const conflict of candidate.conflicts) {
                    const item = el("li");
                    bind(item, () => {
                      item.textContent = message(
                        conflict.kind === "after_target"
                          ? "conflictTarget"
                          : "conflictAvailability",
                        { step: candidate.step.title, date: dateLabel(conflict.date) },
                      );
                    });
                    conflicts.append(item);
                  }
                  acknowledge.required = true;
                  confirm.disabled = true;
                  acknowledge.addEventListener("change", () => {
                    confirm.disabled = !acknowledge.checked;
                  });
                  warnings.append(
                    conflicts,
                    el(
                      "label",
                      "checkbox-field",
                      acknowledge,
                      text("span", "restoreConflictAcknowledge"),
                    ),
                  );
                  form.append(warnings);
                }
                return () => ({
                  scopeEventId: candidate.scopeEventId,
                  references: selected.filter((item) => item.checked).map((item) => item.value),
                  acknowledgeConflicts: acknowledge.checked,
                });
              },
            }),
          );
        list.append(row);
      }
      body.replaceChildren(result.steps.length ? list : text("p", "noRemovedSteps", "empty-copy"));
    } catch (error) {
      if (!active() || expired(error)) return;
      body.replaceChildren(
        notice(lifecycleError(error), true),
        button("retry", () => void load()),
      );
    }
  };
  // The caller appends this section synchronously before the read resolves.
  void load();
  return section;
}

export function showArchivedPlan(
  host: HTMLElement,
  detail: PlanDetail,
  context: LifecycleContext,
  back: () => void,
): void {
  const view = el("section", "archived-plan-view");
  view.append(
    el("div", "page-heading", text("h1", "archivedTitle"), button("back", back, "text-button")),
    el("h2", "", detail.plan.goal),
    text("p", "archivedReadOnly", "notice"),
    text("p", "currentProgress", "", {
      done: detail.progress.completed,
      total: detail.progress.total,
    }),
    text("p", "effort", "hint", {
      count: detail.progress.activityCount,
      minutes: detail.progress.studiedMinutes,
    }),
    planActions(view, detail, context),
  );
  const path = el("ol", "archived-path");
  for (const step of detail.plan.steps)
    path.append(
      el(
        "li",
        "history-entry",
        el("h3", "", step.title),
        el(
          "p",
          "hint",
          localDate(step.scheduledDate),
          " · ",
          text("span", "estimated", "", { minutes: step.estimatedMinutes }),
          " · ",
          text("span", step.completedAt ? "complete" : "unfinished"),
        ),
      ),
    );
  view.append(el("section", "activity-records", text("h2", "yourPath"), path));
  if (detail.plan.references.length || detail.plan.sources?.length) {
    const resources = el(
      "section",
      "references",
      text("h2", "resources"),
      text("p", "external", "hint"),
    );
    for (const url of detail.plan.references) {
      if (detail.plan.sources?.some((source) => source.url === new URL(url).href)) continue;
      const link = el("a", "resource-link", url);
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      resources.append(link);
    }
    if (detail.plan.sources?.length)
      resources.append(sourceList(detail.plan.sources), text("p", "aiSourceLimits", "hint"));
    view.append(resources);
  }
  const history = el(
    "section",
    "activity-records",
    text("h2", "history"),
    text("p", "pastCompletions", "", { count: detail.progress.cumulativeCompletions }),
  );
  const activities = el("ol", "history-list");
  for (const activity of [...detail.activities].reverse()) {
    const row = el(
      "li",
      "history-entry",
      el("h4", "", activity.stepTitle),
      el(
        "p",
        "hint",
        localDate(activity.createdAt, detail.progress.timezone),
        ` · ${activity.minutes} min`,
      ),
    );
    if (activity.reflection)
      row.append(
        text("p", "privateNote", "reflection-label"),
        el("p", "reflection-text", activity.reflection),
      );
    activities.append(row);
  }
  history.append(
    text("h3", "sessionCount", "", { count: detail.activities.length }),
    detail.activities.length ? activities : text("p", "noActivity", "empty-copy"),
  );
  if (detail.completions.length) {
    const completions = el("ol", "history-list");
    for (const completion of [...detail.completions].reverse())
      completions.append(
        el(
          "li",
          "history-entry",
          el("h4", "", completion.stepTitle),
          text("p", completion.correctedAt ? "completionCorrected" : "complete"),
          localDate(completion.createdAt, detail.progress.timezone),
          ...(completion.correctedAt ? [text("p", "completionCorrectedCopy", "hint")] : []),
        ),
      );
    history.append(text("h3", "activityCompletions"), completions);
  }
  if (detail.scopeEvents.length) {
    const changes = el("ul", "history-list");
    for (const event of detail.scopeEvents)
      changes.append(
        el(
          "li",
          "history-entry",
          text("p", event.kind === "restore" ? "stepRestoredHistory" : "scopeChanged", "hint", {
            before: event.previousCount,
            after: event.currentCount,
          }),
          localDate(event.createdAt, detail.progress.timezone),
        ),
      );
    history.append(text("h3", "activityChanges"), changes);
  }
  view.append(history, removedStepsSection(view, detail, context));
  host.replaceChildren(view);
  focusHeading(host);
}
