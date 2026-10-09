import {
  type GoalTemplate,
  type LearningPlan,
  LIMITS,
  type PlanDetail,
  type StepInput,
} from "../shared/contracts.js";
import { errorKey, request } from "./api.js";
import { bind, dateLabel, getLocale, type MessageKey, message } from "./i18n.js";
import { button, el, field, input, lockForm, named, notice, text } from "./ui.js";

interface DraftStep extends StepInput {
  completed: boolean;
  uiId: string;
}
interface FieldError {
  key: MessageKey;
  values: Record<string, string | number>;
}
function fieldErrors(control: HTMLTextAreaElement, wrapper: HTMLElement) {
  let current: FieldError | null = null;
  const error = el("div", "notice error");
  error.id = `${control.id}-error`;
  error.setAttribute("role", "alert");
  const hint = control.getAttribute("aria-describedby");
  const update = (): void => {
    error.hidden = current === null;
    error.textContent = current ? message(current.key, current.values) : "";
    if (current) {
      control.setAttribute("aria-invalid", "true");
      control.setAttribute("aria-describedby", [hint, error.id].filter(Boolean).join(" "));
    } else {
      control.removeAttribute("aria-invalid");
      if (hint) control.setAttribute("aria-describedby", hint);
      else control.removeAttribute("aria-describedby");
    }
  };
  const clear = (): void => {
    current = null;
    update();
  };
  bind(error, update);
  wrapper.append(error);
  control.addEventListener("input", clear);
  return {
    clear,
    show(key: MessageKey, values: Record<string, string | number> = {}): void {
      current = { key, values };
      update();
    },
  };
}
const datesFrom = (value: string): string[] => [
  ...new Set(
    value
      .split(/[\s,]+/)
      .map((date) => date.trim())
      .filter(Boolean),
  ),
];
function validDate(value: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    value >= "2000-01-01" &&
    value <= "2100-12-31" &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}
export function showPlanEditor(
  host: HTMLElement,
  templates: GoalTemplate[],
  existing: LearningPlan | null,
  onSaved: (detail: PlanDetail) => void,
  onCancel: () => void,
  dirty: () => void,
  options: { selectedStepId?: string } = {},
): () => boolean {
  let draft: DraftStep[] =
    existing?.steps.map((step) => ({
      id: step.id,
      title: step.title,
      scheduledDate: step.scheduledDate,
      estimatedMinutes: step.estimatedMinutes,
      completed: Boolean(step.completedAt),
      uiId: step.id,
    })) ?? [];
  let reviewed = Boolean(existing);
  let previousBody = "";
  let requestId = crypto.randomUUID();
  const form = el("form", "editor-form");
  form.noValidate = true;
  const goal = input("text", "goal", existing?.goal ?? "");
  goal.required = true;
  goal.maxLength = LIMITS.goal;
  const templateSelect = el("select");
  templateSelect.name = "template";
  const manual = text("option", "manual");
  manual.value = "";
  templateSelect.append(manual);
  for (const template of templates) {
    const option = el("option");
    option.value = template.id;
    bind(option, () => {
      option.textContent = template.text[getLocale()].title;
    });
    templateSelect.append(option);
  }
  templateSelect.value = existing?.templateId ?? "";
  templateSelect.disabled = Boolean(existing);
  const topics = el("textarea");
  topics.name = "topics";
  topics.rows = 5;
  topics.maxLength = LIMITS.steps * (LIMITS.stepTitle + 1);
  const topicField = field("topics", topics, "topicsHint");
  const topicErrors = fieldErrors(topics, topicField);
  const sourcePanel = el("section", "source-panel");
  const availability = el("textarea");
  availability.name = "availability";
  availability.rows = 3;
  availability.required = true;
  availability.value = existing?.availabilityDates.join(", ") ?? "";
  const availabilityField = field("availability", availability, "availabilityHint");
  const availabilityErrors = fieldErrors(availability, availabilityField);
  const target = input("date", "targetDate", existing?.targetDate ?? "");
  target.min = "2000-01-01";
  target.max = "2100-12-31";
  const references = el("textarea");
  references.name = "references";
  references.rows = 3;
  references.value = existing?.references.join("\n") ?? "";
  references.maxLength = LIMITS.references * (LIMITS.url + 1);
  const review = el("section", "draft-review");
  const stepList = el("div", "draft-steps");
  const stepControls = new Map<
    string,
    {
      title: HTMLInputElement;
      up: HTMLButtonElement;
      down: HTMLButtonElement;
      remove: HTMLButtonElement;
    }
  >();
  const stepStatus = el("div", "hint");
  stepStatus.setAttribute("role", "status");
  stepStatus.setAttribute("aria-live", "polite");
  stepStatus.setAttribute("aria-atomic", "true");
  let stepFeedback: FieldError | null = null;
  const updateStepStatus = (): void => {
    stepStatus.textContent = stepFeedback ? message(stepFeedback.key, stepFeedback.values) : "";
  };
  bind(stepStatus, updateStepStatus);
  const announce = (key: MessageKey, values: Record<string, string | number>): void => {
    stepFeedback = { key, values };
    updateStepStatus();
  };
  const warningList = el("div", "draft-warnings");
  const confirmation = input("checkbox", "confirmRemoval");
  const removalLabel = el("label", "checkbox-field", confirmation, el("span"));
  const removalText = removalLabel.lastElementChild;
  const errors = el("div");
  const save = text("button", existing ? "savePlan" : "confirmPlan", "button primary");
  save.type = "submit";
  const templateInfo = (): void => {
    const selected = templates.find((item) => item.id === templateSelect.value);
    topicField.hidden = Boolean(selected) || reviewed;
    if (topicField.hidden) topicErrors.clear();
    sourcePanel.replaceChildren();
    if (selected) {
      const copy = selected.text[getLocale()];
      sourcePanel.append(
        text("h2", "templateSources"),
        text("h3", "outcome"),
        el("p", "", copy.outcome),
        text("h3", "prerequisites"),
        el("p", "", copy.prerequisites),
      );
      for (const source of selected.sources[getLocale()]) {
        const link = el("a", "", source.label);
        link.href = source.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        sourcePanel.append(
          el("p", "", link, text("span", "checked", "source-date", { date: source.checkedOn })),
        );
      }
    }
  };
  const validateAvailability = (): boolean => {
    const available = datesFrom(availability.value);
    const invalid = available.filter((date) => !validDate(date));
    if (!available.length) availabilityErrors.show("availabilityRequired");
    else if (invalid.length)
      availabilityErrors.show("availabilityInvalid", { dates: invalid.join(", ") });
    else if (available.length > LIMITS.availability)
      availabilityErrors.show("availabilityTooMany", { max: LIMITS.availability });
    else {
      availabilityErrors.clear();
      return true;
    }
    return false;
  };
  const topicLines = () =>
    topics.value
      .split("\n")
      .map((title, index) => ({ title: title.trim(), line: index + 1 }))
      .filter((item) => item.title);
  const validateTopics = (): boolean => {
    const actions = topicLines();
    const overlong = actions.filter((item) => item.title.length > LIMITS.stepTitle);
    if (!actions.length) topicErrors.show("topicsRequired");
    else if (actions.length > LIMITS.steps)
      topicErrors.show("topicsTooMany", { max: LIMITS.steps });
    else if (overlong.length)
      topicErrors.show("topicsTooLong", {
        lines: overlong.map((item) => item.line).join(", "),
        max: LIMITS.stepTitle,
      });
    else {
      topicErrors.clear();
      return true;
    }
    return false;
  };
  const conflicts = (): void => {
    warningList.replaceChildren();
    const available = datesFrom(availability.value);
    const warnings = draft.flatMap((step) => {
      const found: HTMLElement[] = [];
      if (!validDate(step.scheduledDate)) return found;
      if (!available.includes(step.scheduledDate))
        found.push(
          text("li", "conflictAvailability", "", {
            step: step.title,
            date: dateLabel(step.scheduledDate),
          }),
        );
      if (target.value && step.scheduledDate > target.value)
        found.push(
          text("li", "conflictTarget", "", {
            step: step.title,
            date: dateLabel(step.scheduledDate),
          }),
        );
      return found;
    });
    if (warnings.length)
      warningList.append(
        text("h3", "conflicts"),
        el("ul", "", ...warnings),
        text("p", "conflictNote", "hint"),
      );
  };
  const renderSteps = (focus?: {
    uiId: string;
    control: "title" | "up" | "down" | "remove";
  }): void => {
    stepList.replaceChildren();
    stepControls.clear();
    for (const [index, step] of draft.entries()) {
      const title = input("text", `title-${index}`, step.title);
      title.required = true;
      title.maxLength = LIMITS.stepTitle;
      title.readOnly = step.completed;
      const date = input("date", `date-${index}`, step.scheduledDate);
      date.required = true;
      date.min = "2000-01-01";
      date.max = "2100-12-31";
      date.readOnly = step.completed;
      const minutes = input("number", `minutes-${index}`, String(step.estimatedMinutes));
      minutes.min = "1";
      minutes.max = String(LIMITS.minutes);
      minutes.step = "1";
      minutes.required = true;
      minutes.readOnly = step.completed;
      title.addEventListener("input", () => {
        step.title = title.value;
      });
      date.addEventListener("input", () => {
        step.scheduledDate = date.value;
        conflicts();
      });
      minutes.addEventListener("input", () => {
        step.estimatedMinutes = Number(minutes.value);
      });
      const up = button(
        "moveUp",
        () => {
          const previous = draft[index - 1];
          if (previous) {
            draft[index - 1] = step;
            draft[index] = previous;
            dirty();
            renderSteps({ uiId: step.uiId, control: "up" });
            announce("stepMoved", { number: index, total: draft.length });
          }
        },
        "button subtle small",
      );
      up.disabled = index === 0;
      const down = button(
        "moveDown",
        () => {
          const next = draft[index + 1];
          if (next) {
            draft[index + 1] = step;
            draft[index] = next;
            dirty();
            renderSteps({ uiId: step.uiId, control: "down" });
            announce("stepMoved", { number: index + 2, total: draft.length });
          }
        },
        "button subtle small",
      );
      down.disabled = index === draft.length - 1;
      const remove = button(
        "remove",
        () => {
          draft.splice(index, 1);
          confirmation.checked = false;
          dirty();
          const adjacent = draft[index] ?? draft[index - 1];
          renderSteps(adjacent ? { uiId: adjacent.uiId, control: "remove" } : undefined);
          if (!adjacent) addStep.focus();
          announce("stepRemoved", { total: draft.length });
        },
        "button subtle small",
      );
      const selectedContext =
        step.id === options.selectedStepId && step.id !== undefined
          ? text("p", "editingStepContext", "hint", { number: index + 1, total: draft.length })
          : null;
      const row = el(
        "fieldset",
        "draft-step",
        text("legend", "stepOf", "", { number: index + 1, total: draft.length }),
        selectedContext,
        field("stepTitle", title),
        el("div", "field-row", field("date", date), field("minutes", minutes)),
        el("div", "row-actions", up, down, remove),
      );
      row.id = `draft-step-${step.uiId}`;
      row.dataset.stepId = step.uiId;
      if (selectedContext) {
        selectedContext.id = `${row.id}-context`;
        title.setAttribute("aria-describedby", selectedContext.id);
        row.dataset.selectedStep = "true";
      }
      stepControls.set(step.uiId, { title, up, down, remove });
      if (step.completed) row.append(text("p", "completedLocked", "hint"));
      stepList.append(row);
    }
    const removed =
      existing?.steps.filter((step) => !draft.some((item) => item.id === step.id)).length ?? 0;
    removalLabel.hidden = removed === 0;
    confirmation.required = removed > 0;
    if (removalText)
      bind(removalText, () => {
        removalText.textContent = message("removeConfirm", { count: removed });
      });
    if (!draft.length) stepList.append(text("p", "emptyScopeHint", "notice"));
    conflicts();
    if (focus) {
      const controls = stepControls.get(focus.uiId);
      if (controls) {
        const target = controls[focus.control];
        (target.disabled ? controls.title : target).focus();
      }
    }
  };
  const makeDraft = button(
    "makeDraft",
    () => {
      errors.replaceChildren();
      const available = datesFrom(availability.value);
      const selected = templates.find((item) => item.id === templateSelect.value);
      const availabilityValid = validateAvailability();
      const topicsValid = selected ? true : validateTopics();
      if (!availabilityValid || !topicsValid) {
        (topicsValid ? availability : topics).focus();
        return;
      }
      const actions =
        selected?.text[getLocale()].steps ??
        topicLines().map(({ title }) => ({ title, estimatedMinutes: 10 }));
      if (!actions.length || actions.length > LIMITS.steps) {
        errors.append(notice("invalidDraft", true));
        return;
      }
      if (!goal.value.trim() && selected) goal.value = selected.text[getLocale()].title;
      draft = actions.map((action, index) => ({
        title: action.title,
        estimatedMinutes: action.estimatedMinutes,
        scheduledDate: available[Math.min(index, available.length - 1)] ?? "",
        completed: false,
        uiId: crypto.randomUUID(),
      }));
      reviewed = true;
      review.hidden = false;
      makeDraft.hidden = true;
      templateSelect.disabled = true;
      topicField.hidden = true;
      renderSteps();
      review.querySelector<HTMLElement>("h2")?.focus();
    },
    "button primary",
  );
  makeDraft.hidden = reviewed;
  const reviewHeading = text("h2", "reviewTitle");
  reviewHeading.tabIndex = -1;
  const addStep = button("addStep", () => {
    if (draft.length < LIMITS.steps) {
      const step: DraftStep = {
        title: "",
        scheduledDate: datesFrom(availability.value)[0] ?? "",
        estimatedMinutes: 10,
        completed: false,
        uiId: crypto.randomUUID(),
      };
      draft.push(step);
      dirty();
      renderSteps({ uiId: step.uiId, control: "title" });
    }
  });
  review.append(
    reviewHeading,
    text("p", "reviewHint", "hint"),
    stepStatus,
    stepList,
    addStep,
    warningList,
    removalLabel,
    el("div", "form-actions", save, button("cancel", onCancel, "button subtle")),
  );
  review.hidden = !reviewed;
  templateSelect.addEventListener("change", templateInfo);
  availability.addEventListener("input", conflicts);
  target.addEventListener("input", conflicts);
  form.addEventListener("input", dirty);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!reviewed) return;
    if (!validateAvailability()) {
      availability.focus();
      return;
    }
    if (!form.reportValidity()) return;
    const body = {
      goal: goal.value.trim(),
      availabilityDates: datesFrom(availability.value),
      targetDate: target.value || null,
      references: references.value
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean),
      steps: draft.map(({ completed: _completed, uiId: _uiId, ...step }) => step),
      ...(existing
        ? { revision: existing.revision }
        : { templateId: templateSelect.value || null }),
    };
    const signature = JSON.stringify(body);
    if (signature !== previousBody) {
      requestId = crypto.randomUUID();
      previousBody = signature;
    }
    const unlock = lockForm(form);
    errors.replaceChildren(notice("saving"));
    void request<PlanDetail>(
      existing ? `/api/plans/${existing.id}` : "/api/plans",
      existing ? "PUT" : "POST",
      { ...body, requestId },
    )
      .then(onSaved)
      .catch((error: unknown) => {
        errors.replaceChildren(notice(errorKey(error), true));
      })
      .finally(() => {
        unlock();
      });
  });
  host.replaceChildren(
    el(
      "div",
      "page-heading",
      text("h1", existing ? "editTitle" : "planTitle"),
      button("cancel", onCancel, "button subtle"),
    ),
    form,
  );
  form.append(
    field("goal", goal),
    field("template", templateSelect, "templateHint"),
    topicField,
    sourcePanel,
    availabilityField,
    field("targetOptional", target),
    field("referenceLinks", references, "referenceHint"),
    makeDraft,
    errors,
    review,
  );
  bind(sourcePanel, templateInfo);
  if (reviewed) renderSteps();
  named(form, existing ? "editTitle" : "planTitle");
  return () => {
    if (!options.selectedStepId) return false;
    const selected = draft.find((step) => step.id === options.selectedStepId);
    const title = selected ? stepControls.get(selected.uiId)?.title : undefined;
    if (!title?.isConnected) return false;
    title.focus();
    return true;
  };
}
