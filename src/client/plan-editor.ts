import {
  type GoalTemplate,
  type LearningPlan,
  LIMITS,
  type PlanDetail,
  type StepInput,
} from "../shared/contracts.js";
import { errorKey, request } from "./api.js";
import { bind, dateLabel, getLocale, message } from "./i18n.js";
import { button, el, field, input, lockForm, named, notice, text } from "./ui.js";

interface DraftStep extends StepInput {
  completed: boolean;
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
): void {
  let draft: DraftStep[] =
    existing?.steps.map((step) => ({
      id: step.id,
      title: step.title,
      scheduledDate: step.scheduledDate,
      estimatedMinutes: step.estimatedMinutes,
      completed: Boolean(step.completedAt),
    })) ?? [];
  let reviewed = Boolean(existing);
  let previousBody = "";
  let requestId = crypto.randomUUID();
  const form = el("form", "editor-form");
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
  const sourcePanel = el("section", "source-panel");
  const availability = el("textarea");
  availability.name = "availability";
  availability.rows = 3;
  availability.required = true;
  availability.value = existing?.availabilityDates.join(", ") ?? "";
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
  const warningList = el("div", "draft-warnings");
  const confirmation = input("checkbox", "confirmRemoval");
  const removalLabel = el("label", "checkbox-field", confirmation, el("span"));
  const removalText = removalLabel.lastElementChild;
  const errors = el("div");
  const save = text("button", existing ? "savePlan" : "confirmPlan", "button primary");
  save.type = "submit";
  const templateInfo = (): void => {
    const selected = templates.find((item) => item.id === templateSelect.value);
    topicField.hidden = Boolean(selected) || Boolean(existing);
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
  const renderSteps = (): void => {
    stepList.replaceChildren();
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
            renderSteps();
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
            renderSteps();
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
          renderSteps();
        },
        "button subtle small",
      );
      const row = el(
        "fieldset",
        "draft-step",
        text("legend", "stepOf", "", { number: index + 1, total: draft.length }),
        field("stepTitle", title),
        el("div", "field-row", field("date", date), field("minutes", minutes)),
        el("div", "row-actions", up, down, remove),
      );
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
  };
  const makeDraft = button(
    "makeDraft",
    () => {
      errors.replaceChildren();
      const available = datesFrom(availability.value);
      const selected = templates.find((item) => item.id === templateSelect.value);
      const actions =
        selected?.text[getLocale()].steps ??
        topics.value
          .split("\n")
          .map((title) => ({ title: title.trim(), estimatedMinutes: 10 }))
          .filter((item) => item.title);
      if (
        !available.length ||
        !available.every(validDate) ||
        !actions.length ||
        actions.length > LIMITS.steps
      ) {
        errors.append(notice("invalidDraft", true));
        return;
      }
      if (!goal.value.trim() && selected) goal.value = selected.text[getLocale()].title;
      draft = actions.map((action, index) => ({
        title: action.title,
        estimatedMinutes: action.estimatedMinutes,
        scheduledDate: available[Math.min(index, available.length - 1)] ?? "",
        completed: false,
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
  review.append(
    reviewHeading,
    text("p", "reviewHint", "hint"),
    stepList,
    button("addStep", () => {
      if (draft.length < LIMITS.steps) {
        draft.push({
          title: "",
          scheduledDate: datesFrom(availability.value)[0] ?? "",
          estimatedMinutes: 10,
          completed: false,
        });
        dirty();
        renderSteps();
      }
    }),
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
    if (!reviewed || !form.reportValidity()) return;
    const body = {
      goal: goal.value.trim(),
      availabilityDates: datesFrom(availability.value),
      targetDate: target.value || null,
      references: references.value
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean),
      steps: draft.map(({ completed: _completed, ...step }) => step),
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
    field("availability", availability, "availabilityHint"),
    field("targetOptional", target),
    field("referenceLinks", references, "referenceHint"),
    makeDraft,
    errors,
    review,
  );
  bind(sourcePanel, templateInfo);
  if (reviewed) renderSteps();
  named(form, existing ? "editTitle" : "planTitle");
}
