import type { ComebackConfirmInput, ComebackPreview, PlanDetail } from "../shared/contracts.js";
import { errorKey, RequestError, request } from "./api.js";
import { bind, dateLabel, type MessageKey, message } from "./i18n.js";
import { dated } from "./journey.js";
import { button, el, field, icon, input, named, notice, text } from "./ui.js";

export function showComeback(
  host: HTMLElement,
  initial: PlanDetail,
  onSaved: (detail: PlanDetail) => void,
  onCancel: () => void,
  onEdit: (detail: PlanDetail) => void,
  isCurrent: () => boolean,
): void {
  let detail = initial;
  let preview: ComebackPreview | null = null;
  let confirmation: ComebackConfirmInput | null = null;
  let busy = false;
  let needsRefresh = false;
  let uncertain = false;
  let saved = false;
  let applying = false;
  const view = el("section", "comeback-view");
  const form = el("form", "comeback-form");
  named(form, "comebackTitle");
  const status = el("div", "comeback-status");
  const results = el("section", "comeback-results");
  const retained = el("aside", "comeback-retained");
  const conflicts = el("div", "comeback-conflicts");
  const restart = input("date", "restartDate", initial.progress.rangeEnd);
  restart.required = true;
  restart.min = "2000-01-01";
  restart.max = "2100-12-31";
  const timezone = el("p", "hint", detail.plan.timezone);
  const previewButton = text("button", "previewDates", "button");
  previewButton.type = "submit";
  const acknowledgement = input("checkbox", "acknowledgeConflicts");
  const acknowledgementField = el(
    "label",
    "checkbox-field comeback-acknowledgement",
    acknowledgement,
    text("span", "acknowledgeConflicts"),
  );
  const back = button("backLearning", onCancel, "text-button");
  const cancel = button("cancel", onCancel, "button subtle");
  const edit = button("editPlan", () => onEdit(detail), "button subtle");
  const apply = button("applyDates", () => void confirm(), "button primary");
  const refresh = button("reloadPlan", () => void reload(), "button");
  const unchanged = text("p", "previewOnly", "comeback-preview-note");
  const actions = el("div", "comeback-actions", unchanged, cancel, apply);
  const hasUnfinished = (): boolean => detail.plan.steps.some((step) => !step.completedAt);
  const active = (): boolean => view.isConnected && isCurrent();
  const controls = (): void => {
    previewButton.disabled = busy || needsRefresh || saved || !hasUnfinished();
    restart.disabled = busy || saved || !hasUnfinished();
    acknowledgement.disabled = busy;
    apply.disabled =
      busy ||
      !preview ||
      preview.shiftDays === 0 ||
      needsRefresh ||
      saved ||
      (preview.conflicts.length > 0 && !acknowledgement.checked);
    apply.hidden = !preview || saved;
    acknowledgementField.hidden = !preview?.conflicts.length || saved;
    actions.hidden = !preview || saved;
    refresh.hidden = !(needsRefresh || uncertain || saved);
    refresh.disabled = busy;
    cancel.disabled = busy;
    back.disabled = busy;
    edit.disabled = busy;
    bind(apply, () => {
      apply.textContent = message(uncertain ? "retryComeback" : "applyDates");
    });
    bind(refresh, () => {
      refresh.textContent = message(saved ? "returnSavedPlan" : "reloadPlan");
    });
    bind(unchanged, () => {
      unchanged.textContent = message(
        uncertain ? "uncertainDates" : applying ? "applyingDates" : "previewOnly",
      );
    });
    if (busy) form.setAttribute("aria-busy", "true");
    else form.removeAttribute("aria-busy");
  };
  const announce = (key: MessageKey, danger = false): void => {
    const messageNode = notice(key, danger);
    messageNode.tabIndex = -1;
    status.replaceChildren(messageNode);
    messageNode.focus();
  };
  const invalidate = (): void => {
    preview = null;
    confirmation = null;
    acknowledgement.checked = false;
    uncertain = false;
    results.replaceChildren(text("p", "previewHelp", "hint"));
    conflicts.replaceChildren();
    controls();
  };
  const retainedWork = (): void => {
    retained.replaceChildren(text("h2", "retainedWork"), text("p", "retainedHelp", "hint"));
    const completed = detail.plan.steps.filter((step) => step.completedAt);
    const list = el("ul", "comeback-completed");
    for (const step of completed)
      list.append(
        el(
          "li",
          "",
          icon("check"),
          el("div", "", el("p", "", step.title), dated(step.scheduledDate)),
        ),
      );
    retained.append(
      completed.length ? list : text("p", "noCompletedSteps", "hint"),
      el(
        "div",
        "comeback-history-summary",
        text("p", "currentProgress", "", {
          done: detail.progress.completed,
          total: detail.progress.total,
        }),
        text("p", "pastCompletions", "", { count: detail.progress.cumulativeCompletions }),
        text("p", "effort", "", {
          count: detail.progress.activityCount,
          minutes: detail.progress.studiedMinutes,
        }),
        text("p", "reported", "hint"),
      ),
    );
    timezone.textContent = detail.plan.timezone;
  };
  const renderPreview = (value: ComebackPreview): void => {
    preview = value;
    confirmation = {
      requestId: crypto.randomUUID(),
      revision: value.revision,
      restartDate: value.restartDate,
    };
    acknowledgement.checked = false;
    const heading = text("h2", "dateComparison");
    heading.tabIndex = -1;
    const summary = text("p", value.shiftDays < 0 ? "shiftEarlier" : "shiftLater", "hint", {
      count: value.changes.length,
      days: Math.abs(value.shiftDays),
    });
    const rows = el("ol", "comeback-date-list");
    for (const change of value.changes) {
      const datePair = el(
        "dl",
        "comeback-date-pair",
        el("div", "", text("dt", "currentDate"), el("dd", "", dated(change.previousDate))),
        el(
          "div",
          "comeback-proposed",
          text("dt", "proposedDate"),
          el("dd", "", dated(change.proposedDate)),
        ),
      );
      rows.append(el("li", "comeback-date-row", el("h3", "", change.title), datePair));
    }
    results.replaceChildren(
      heading,
      value.shiftDays === 0 ? notice("unchangedDates") : summary,
      rows,
    );
    conflicts.replaceChildren();
    if (value.conflicts.length) {
      const list = el("ul");
      for (const conflict of value.conflicts) {
        const row = el("li");
        bind(row, () => {
          row.textContent = message(
            conflict.kind === "after_target" ? "conflictTarget" : "conflictAvailability",
            {
              step: value.changes.find((change) => change.stepId === conflict.stepId)?.title ?? "",
              date: dateLabel(conflict.date),
            },
          );
        });
        list.append(row);
      }
      const warning = el(
        "section",
        "notice warning",
        text("h2", "conflicts"),
        list,
        text("p", "conflictNote"),
      );
      if (detail.plan.targetDate)
        warning.append(
          el(
            "p",
            "comeback-target",
            text("strong", "target"),
            " · ",
            dated(detail.plan.targetDate),
          ),
        );
      conflicts.append(warning);
    }
    controls();
    heading.focus();
  };
  const failure = (error: unknown, confirming: boolean): void => {
    if (error instanceof RequestError && error.code === "schedule_out_of_range") {
      announce("comebackBounds", true);
    } else if (
      error instanceof RequestError &&
      (error.code === "stale_revision" || error.code === "no_unfinished_steps")
    ) {
      invalidate();
      needsRefresh = true;
      announce(
        error.code === "no_unfinished_steps" ? "comebackUnavailable" : "comebackStale",
        true,
      );
    } else if (error instanceof RequestError && error.code === "idempotency_conflict") {
      invalidate();
      needsRefresh = true;
      announce("comebackRetryConflict", true);
    } else if (
      confirming &&
      (!(error instanceof RequestError) ||
        error.status === 0 ||
        error.status >= 500 ||
        error.code === "UNEXPECTED")
    ) {
      uncertain = true;
      announce("comebackUncertain", true);
    } else announce(errorKey(error), true);
  };
  async function reload(): Promise<void> {
    if (busy) return;
    busy = true;
    controls();
    status.replaceChildren(notice("loading"));
    try {
      const result = await request<PlanDetail>(`/api/plans/${detail.plan.id}`);
      if (!active()) return;
      if (saved) {
        onSaved(result);
        return;
      }
      detail = result;
      needsRefresh = false;
      invalidate();
      retainedWork();
      announce(hasUnfinished() ? "comebackReloaded" : "comebackUnavailable");
    } catch (error) {
      if (active())
        announce(
          saved ? "comebackSavedRefresh" : uncertain ? "comebackUncertain" : errorKey(error),
          true,
        );
    } finally {
      busy = false;
      if (active()) controls();
    }
  }
  async function confirm(): Promise<void> {
    if (busy || apply.disabled || !preview || !confirmation) return;
    busy = true;
    applying = true;
    controls();
    status.replaceChildren(notice("saving"));
    try {
      await request<PlanDetail>(
        `/api/plans/${detail.plan.id}/comeback/confirm`,
        "POST",
        confirmation,
      );
      if (!active()) return;
      saved = true;
      uncertain = false;
      controls();
      try {
        const current = await request<PlanDetail>(`/api/plans/${detail.plan.id}`);
        if (active()) onSaved(current);
      } catch {
        if (active()) announce("comebackSavedRefresh", true);
      }
    } catch (error) {
      if (active()) failure(error, true);
    } finally {
      busy = false;
      applying = false;
      if (active()) controls();
    }
  }
  restart.addEventListener("input", () => {
    invalidate();
    if (!needsRefresh) status.replaceChildren();
  });
  acknowledgement.addEventListener("change", controls);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (busy || previewButton.disabled || !form.reportValidity()) return;
    const body = { revision: detail.plan.revision, restartDate: restart.value };
    invalidate();
    busy = true;
    controls();
    status.replaceChildren(notice("previewingDates"));
    void request<ComebackPreview>(`/api/plans/${detail.plan.id}/comeback/preview`, "POST", body)
      .then((value) => {
        if (!active()) return;
        status.replaceChildren();
        renderPreview(value);
      })
      .catch((error: unknown) => {
        if (active()) failure(error, false);
      })
      .finally(() => {
        busy = false;
        if (active()) controls();
      });
  });
  form.append(
    el(
      "div",
      "comeback-date-controls",
      field("restartDate", restart, "restartDateHint"),
      el("div", "comeback-preview-controls", timezone, previewButton),
    ),
    status,
    refresh,
    el("div", "comeback-columns", results, retained),
    conflicts,
    acknowledgementField,
    actions,
  );
  view.append(
    back,
    el(
      "div",
      "page-heading comeback-heading",
      el("div", "", text("h1", "comebackTitle"), el("p", "subtitle", detail.plan.goal)),
      edit,
    ),
    text("p", "comebackHelp", "comeback-intro"),
    form,
  );
  host.replaceChildren(view);
  retainedWork();
  invalidate();
  if (!hasUnfinished()) announce("comebackUnavailable");
}
