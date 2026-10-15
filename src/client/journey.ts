import {
  type GoalTemplate,
  type LearningStep,
  LIMITS,
  type PlanDetail,
} from "../shared/contracts.js";
import { errorKey, RequestError, request } from "./api.js";
import { aiPanel, cancelAiOperations, sourceList } from "./ai-assistance.js";
import { bind, dateLabel, getLocale, message } from "./i18n.js";
import {
  completionAction,
  type LifecycleContext,
  removedStepsSection,
  studyRecordActions,
} from "./learning-lifecycle.js";
import {
  button,
  el,
  field,
  fieldErrors,
  focusFailure,
  focusStatus,
  icon,
  input,
  lockForm,
  notice,
  text,
} from "./ui.js";

let disposeLearningLayout = (): void => {};

export function dated(value: string, timezone?: string): HTMLElement {
  const node = el("time");
  node.dateTime = value;
  bind(node, () => {
    node.textContent = dateLabel(value, timezone);
  });
  return node;
}
function progressStrip(detail: PlanDetail): HTMLElement {
  if (detail.plan.steps.length > 12) {
    const progress = el("progress", "scope-progress");
    progress.max = detail.progress.total;
    progress.value = detail.progress.completed;
    progress.setAttribute("aria-hidden", "true");
    return el(
      "div",
      "goal-progress",
      text("p", "currentProgress", "", {
        done: detail.progress.completed,
        total: detail.progress.total,
      }),
      progress,
    );
  }
  const list = el("ol", "progress-strip");
  list.setAttribute("aria-hidden", "true");
  for (const [index, step] of detail.plan.steps.entries())
    list.append(
      el(
        "li",
        step.completedAt ? "done" : "",
        el("span", "progress-dot"),
        el("span", "progress-number", String(index + 1)),
      ),
    );
  return el(
    "div",
    "goal-progress",
    text("p", "currentProgress", "", {
      done: detail.progress.completed,
      total: detail.progress.total,
    }),
    list,
  );
}
function rhythm(detail: PlanDetail): HTMLElement {
  const progress = detail.progress;
  const range = el(
    "p",
    "hint",
    dated(progress.rangeStart),
    " – ",
    dated(progress.rangeEnd),
    ` · ${progress.timezone}`,
  );
  const markers = el("ol", "rhythm-strip");
  const end = new Date(`${progress.rangeEnd}T12:00:00Z`);
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(end);
    date.setUTCDate(date.getUTCDate() - offset);
    const iso = date.toISOString().slice(0, 10);
    const studied = progress.studyDates.includes(iso);
    const label = el("span", "rhythm-number");
    bind(label, () => {
      label.textContent = new Intl.DateTimeFormat(getLocale(), {
        day: "numeric",
        timeZone: "UTC",
      }).format(date);
    });
    const marker = el(
      "li",
      studied ? "studied" : "",
      el("span", "rhythm-dot", studied ? icon("check") : null),
      label,
    );
    bind(marker, () => {
      marker.setAttribute(
        "aria-label",
        `${dateLabel(iso)}: ${message(studied ? "studyRecorded" : "noStudyRecorded")}`,
      );
    });
    markers.append(marker);
  }
  return el(
    "section",
    "support rhythm",
    icon("calendar"),
    el(
      "div",
      "support-body",
      el(
        "div",
        "support-heading",
        text("h2", "studyDays", "", { count: progress.studyDayCount }),
        text("p", "everyDay", "hint"),
      ),
      range,
      markers,
      text("p", "effort", "hint", {
        count: progress.activityCount,
        minutes: progress.studiedMinutes,
      }),
      text("p", "reported", "hint"),
    ),
  );
}
export function showLearning(
  host: HTMLElement,
  detail: PlanDetail,
  edit: (selectedStepId?: string) => void,
  study: (step: LearningStep, minutes?: number) => void,
  create: () => void,
  recover: () => void,
  circle: () => void,
  isCurrent: () => boolean = () => host.isConnected,
  lifecycle?: LifecycleContext,
): void {
  disposeLearningLayout();
  const next = detail.plan.steps.find((step) => step.id === detail.nextStepId);
  const introduction = el(
    "div",
    "learning-introduction",
    text("h1", "nextTitle"),
    text("p", "keepGoing", "subtitle"),
  );
  const goalHeading = el(
    "div",
    "goal-heading",
    el("h2", "", detail.plan.goal),
    button("editPlan", () => edit(), "button subtle"),
  );
  const progress = progressStrip(detail);
  const heading = el("div", "workspace-heading");
  const band = el("section", "next-band");
  if (next) {
    const start = button("studyStart", () => study(next), "button primary study-primary");
    start.append(icon("arrow"));
    band.append(
      el(
        "div",
        "next-copy",
        text("p", "stepOf", "step-count", {
          number: detail.plan.steps.indexOf(next) + 1,
          total: detail.plan.steps.length,
        }),
        el("h2", "", next.title),
        el(
          "div",
          "next-meta",
          el(
            "span",
            "inline-icon",
            icon("clock"),
            text("span", "estimated", "", { minutes: next.estimatedMinutes }),
          ),
          button("editStep", () => edit(next.id), "button subtle"),
        ),
      ),
      el(
        "div",
        "next-actions",
        start,
        button("shortStart", () => study(next, 5), "button subtle"),
      ),
    );
  } else
    band.append(
      el(
        "div",
        "",
        text("h2", detail.plan.steps.length ? "finished" : "noSteps"),
        text("p", detail.plan.steps.length ? "finishedCopy" : "noStepsCopy"),
      ),
      button(
        detail.plan.steps.length ? "createGoal" : "addStep",
        detail.plan.steps.length ? create : () => edit(),
        "button primary",
      ),
    );
  const path = el("ol", "learning-path");
  for (const [index, step] of detail.plan.steps.entries()) {
    const current = step.id === next?.id;
    const marker = el("span", "path-marker", step.completedAt ? icon("check") : String(index + 1));
    marker.setAttribute("aria-hidden", "true");
    const title = el("span", "path-title", step.title);
    const description = el(
      "span",
      "path-description",
      text("span", step.completedAt ? "complete" : current ? "nextAction" : "upcoming"),
      " · ",
      dated(step.scheduledDate),
    );
    const row = el(
      "li",
      `path-step${step.completedAt ? " completed" : ""}${current ? " current" : ""}`,
      marker,
      el("div", "path-copy", title, description),
    );
    if (!step.completedAt) {
      const control = el("button", "path-action", title, description);
      control.type = "button";
      control.addEventListener("click", () => study(step));
      row.lastElementChild?.replaceWith(control);
    }
    const associated =
      detail.plan.sources?.filter((source) => step.sourceIds?.includes(source.id)) ?? [];
    if (associated.length) {
      const action = row.lastElementChild;
      const copy = el("div", "path-source-body");
      const links = el("ul", "path-source-links");
      for (const source of associated) {
        const link = el("a", "resource-link", source.title ?? source.publisher);
        link.href = source.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        links.append(el("li", "", link));
      }
      action?.replaceWith(copy);
      copy.append(...(action ? [action] : []), text("p", "aiAssociatedSources", "hint"), links);
    }
    if (step.completedAt && lifecycle) {
      const completion = detail.completions.find(
        (event) =>
          event.stepId === step.id && !event.correctedAt && event.createdAt === step.completedAt,
      );
      if (completion) {
        const content = row.lastElementChild;
        content?.append(completionAction(host, detail, completion, lifecycle));
      }
    }
    path.append(row);
  }
  const pathSection = el(
    "section",
    "path-section",
    text("h2", "yourPath", "section-heading"),
    path,
    text("p", "selfReport", "hint"),
  );
  const returnSupport = el(
    "section",
    "support return-support",
    icon("clock"),
    el(
      "div",
      "support-body",
      text("h2", "returnTitle"),
      text("p", "returnCopy"),
      next
        ? button("reviewRestartDates", recover, "button subtle")
        : text("p", "comebackUnavailable", "hint"),
    ),
  );
  const support = el(
    "div",
    "support-column",
    el(
      "section",
      "support",
      icon("review"),
      el("div", "support-body", text("h2", "afterStudy"), text("p", "reflectionCopy")),
    ),
    rhythm(detail),
    el(
      "section",
      "support",
      icon("people"),
      el(
        "div",
        "support-body",
        text("h2", "circleTitle"),
        text("p", "circleCopy", "hint"),
        button("openCircles", circle, "button subtle"),
      ),
    ),
  );
  support.append(
    aiPanel({
      title: "aiProgressTitle",
      action: "aiProgressAction",
      disclosure: "aiProgressDisclosure",
      current: isCurrent,
      signature: () => String(detail.plan.revision),
      build: () => ({
        action: "progress_recap",
        locale: getLocale(),
        planId: detail.plan.id,
        revision: detail.plan.revision,
      }),
    }),
  );
  const columns = el("div", "journey-columns", pathSection, support);
  const layout = el("div", "journey-layout");
  const mobile = window.matchMedia("(max-width: 799px)");
  const arrange = (): void => {
    const active = document.activeElement;
    const retainFocus = active instanceof HTMLElement && layout.contains(active);
    if (mobile.matches) {
      heading.replaceChildren(goalHeading, introduction);
      layout.replaceChildren(heading, band, returnSupport, progress, columns);
    } else {
      heading.replaceChildren(introduction, goalHeading, progress);
      support.prepend(returnSupport);
      layout.replaceChildren(heading, band, columns);
    }
    if (retainFocus) active.focus({ preventScroll: true });
  };
  const onBreakpoint = (): void => {
    if (layout.isConnected) arrange();
    else mobile.removeEventListener("change", onBreakpoint);
  };
  mobile.addEventListener("change", onBreakpoint);
  disposeLearningLayout = () => mobile.removeEventListener("change", onBreakpoint);
  arrange();
  host.replaceChildren(layout);
  if (detail.conflicts.length) {
    const warnings = el("section", "notice warning", text("h2", "conflicts"));
    const list = el("ul");
    for (const conflict of detail.conflicts)
      list.append(
        text(
          "li",
          conflict.kind === "after_target" ? "conflictTarget" : "conflictAvailability",
          "",
          {
            step: detail.plan.steps.find((step) => step.id === conflict.stepId)?.title ?? "",
            date: dateLabel(conflict.date),
          },
        ),
      );
    warnings.append(list, text("p", "conflictNote"));
    host.append(warnings);
  }
  if (detail.plan.references.length) {
    const section = el(
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
      section.append(link);
    }
    if (detail.plan.sources?.length)
      section.append(sourceList(detail.plan.sources), text("p", "aiSourceLimits", "hint"));
    host.append(section);
  }
}

export function showStudy(
  host: HTMLElement,
  initial: PlanDetail,
  step: LearningStep,
  initialMinutes: number | undefined,
  update: (detail: PlanDetail, studySaved: boolean) => void,
  done: () => void,
  dirty: () => void,
  templates: GoalTemplate[] = [],
  isCurrent: () => boolean = () => host.isConnected,
): void {
  let detail = initial;
  let savedSignature = "";
  const resources = el("section", "references study-resources");
  bind(resources, () => {
    resources.replaceChildren();
    resources.setAttribute("aria-label", message("resources"));
    const template = templates.find(
      (item) =>
        item.id === initial.plan.templateId && item.version === initial.plan.templateVersion,
    );
    if (template || initial.plan.templateId || initial.plan.references.length) {
      resources.hidden = false;
      resources.append(text("h2", "resources"), text("p", "external", "hint"));
      if (template) {
        resources.append(text("h3", "templateSources"));
        const seen = new Set<string>();
        for (const source of template.sources[getLocale()]) {
          if (seen.has(source.url)) continue;
          seen.add(source.url);
          const link = el("a", "resource-link", source.label);
          link.href = source.url;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          resources.append(link, text("p", "checked", "source-date", { date: source.checkedOn }));
        }
      } else if (initial.plan.templateId)
        resources.append(text("p", "templateSourcesUnavailable", "hint"));
      for (const url of new Set(initial.plan.references)) {
        if (initial.plan.sources?.some((source) => source.url === new URL(url).href)) continue;
        const link = el("a", "resource-link", url);
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        resources.append(link);
      }
      const associated =
        initial.plan.sources?.filter((source) => step.sourceIds?.includes(source.id)) ?? [];
      if (associated.length)
        resources.append(text("h3", "aiAssociatedSources"), sourceList(associated));
      const others =
        initial.plan.sources?.filter(
          (source) => !associated.some((item) => item.id === source.id),
        ) ?? [];
      if (others.length) resources.append(text("h3", "aiOtherSources"), sourceList(others));
      if (initial.plan.sources?.length) resources.append(text("p", "aiSourceLimits", "hint"));
    } else resources.hidden = true;
  });
  let activityRequest = crypto.randomUUID();
  const completionRequest = crypto.randomUUID();
  const form = el("form", "study-form");
  const active = (): boolean => isCurrent() && form.isConnected;
  const minutes = input(
    "number",
    "studiedMinutes",
    String(initialMinutes ?? step.estimatedMinutes),
  );
  minutes.required = true;
  minutes.min = "1";
  minutes.max = String(LIMITS.minutes);
  minutes.step = "1";
  const reflection = el("textarea");
  reflection.name = "reflection";
  reflection.rows = 5;
  reflection.maxLength = LIMITS.reflection;
  const save = text("button", "saveSession", "button primary");
  save.type = "submit";
  const status = el("div");
  const completionStatus = el("div");
  const minutesField = field("studiedMinutes", minutes, "studyMinutesHint");
  const minutesErrors = fieldErrors(minutes, minutesField);
  const reflectionField = field("reflection", reflection, "reflectionHint");
  const reflectionErrors = fieldErrors(reflection, reflectionField);
  const smallMinutes = input("number", "aiMinutes", String(initialMinutes ?? 5));
  smallMinutes.min = "1";
  smallMinutes.max = String(LIMITS.minutes);
  smallMinutes.required = true;
  const stepHelp = aiPanel({
    title: "aiStepTitle",
    action: "aiStepAction",
    disclosure: "aiStepDisclosure",
    controls: [field("aiCapacity", smallMinutes)],
    current: active,
    watch: [smallMinutes],
    signature: () =>
      JSON.stringify([
        detail.plan.revision,
        smallMinutes.value,
        Boolean(detail.plan.steps.find((item) => item.id === step.id)?.completedAt),
      ]),
    build: () => {
      if (!smallMinutes.reportValidity()) {
        smallMinutes.focus();
        return null;
      }
      if (detail.plan.steps.find((item) => item.id === step.id)?.completedAt) return null;
      return {
        action: "step_help",
        locale: getLocale(),
        planId: detail.plan.id,
        revision: detail.plan.revision,
        stepId: step.id,
        minutes: Number(smallMinutes.value),
      };
    },
  });
  const includeReflection = input("checkbox", "aiIncludeReflection");
  const reflectionConsent = el(
    "label",
    "checkbox-field",
    includeReflection,
    text("span", "aiReflectionConsent"),
  );
  const originalReflection = el("div", "ai-original-reflection");
  const studyHelp = aiPanel({
    title: "aiStudyTitle",
    action: "aiStudyAction",
    disclosure: "aiStudyDisclosure",
    controls: [reflectionConsent],
    current: active,
    watch: [reflection, includeReflection],
    signature: () =>
      JSON.stringify([
        detail.plan.revision,
        reflection.value,
        includeReflection.checked,
        reflection.readOnly,
      ]),
    build: () => ({
      action: "study_reflection",
      locale: getLocale(),
      planId: detail.plan.id,
      revision: detail.plan.revision,
      stepId: step.id,
      ...(includeReflection.checked && reflection.value.trim()
        ? { reflection: reflection.value.trim() }
        : {}),
    }),
    useLabel: "aiUseReflection",
    canUse: () => !reflection.readOnly,
    use: (result) => {
      if (result.kind !== "guidance" || reflection.readOnly) return;
      const previous = reflection.value;
      if (previous)
        originalReflection.replaceChildren(
          text("p", "aiOriginalReflection", "hint"),
          el("p", "reflection-text", previous),
        );
      reflection.value = [result.summary, result.nextAction]
        .filter(Boolean)
        .join("\n\n")
        .slice(0, LIMITS.reflection);
      dirty();
      reflection.focus();
    },
  });
  const completeButton = button(
    "completeStep",
    () => {
      if (!active()) return;
      cancelAiOperations();
      const unlock = lockForm(form);
      completeButton.disabled = true;
      completionStatus.replaceChildren(notice("saving"));
      let failed = false;
      void request<PlanDetail>(`/api/plans/${detail.plan.id}/completions`, "POST", {
        requestId: completionRequest,
        revision: detail.plan.revision,
        stepId: step.id,
      })
        .then((result) => {
          if (!active()) return;
          detail = result;
          update(result, false);
          stepHelp.hidden = true;
          completeButton.hidden = true;
          focusStatus(completionStatus, "completionSaved");
        })
        .catch((error: unknown) => {
          if (!active()) return;
          failed = true;
          completionStatus.replaceChildren(notice(errorKey(error), true));
        })
        .finally(() => {
          unlock();
          completeButton.disabled = false;
          if (failed) focusFailure(completionStatus, active);
        });
    },
    "button",
  );
  form.append(minutesField, reflectionField, originalReflection, studyHelp, save, status);
  form.addEventListener("input", dirty);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!active() || !form.reportValidity()) return;
    cancelAiOperations();
    minutesErrors.clear();
    reflectionErrors.clear();
    const body = {
      stepId: step.id,
      minutes: Number(minutes.value),
      ...(reflection.value.trim() ? { reflection: reflection.value.trim() } : {}),
    };
    const signature = JSON.stringify(body);
    if (signature !== savedSignature) {
      activityRequest = crypto.randomUUID();
      savedSignature = signature;
    }
    const unlock = lockForm(form);
    completeButton.disabled = true;
    status.replaceChildren(notice("saving"));
    let failed = false;
    let invalid: HTMLElement | undefined;
    void request<PlanDetail>(`/api/plans/${detail.plan.id}/activities`, "POST", {
      ...body,
      requestId: activityRequest,
      revision: detail.plan.revision,
    })
      .then((result) => {
        if (!active()) return;
        detail = result;
        update(result, true);
        minutes.readOnly = true;
        reflection.readOnly = true;
        save.hidden = true;
        focusStatus(status, "sessionSaved");
      })
      .catch((error: unknown) => {
        if (!active()) return;
        failed = true;
        if (
          error instanceof RequestError &&
          error.status === 400 &&
          error.code === "invalid_input" &&
          error.field === "minutes"
        ) {
          minutesErrors.show("invalidMinutes");
          invalid = minutes;
          status.replaceChildren();
        } else if (
          error instanceof RequestError &&
          error.status === 400 &&
          error.code === "invalid_input" &&
          error.field === "reflection"
        ) {
          reflectionErrors.show("invalidReflection");
          invalid = reflection;
          status.replaceChildren();
        } else status.replaceChildren(notice(errorKey(error), true));
      })
      .finally(() => {
        unlock();
        completeButton.disabled = false;
        if (failed) focusFailure(invalid ? form : status, active, invalid);
      });
  });
  host.replaceChildren(
    el("div", "page-heading", text("h1", "sessionTitle"), button("back", done, "button subtle")),
    el(
      "section",
      "study-summary",
      el("h2", "", step.title),
      text("p", "estimated", "hint", { minutes: step.estimatedMinutes }),
      text("p", "sessionHelp"),
    ),
    resources,
    stepHelp,
    form,
    el(
      "section",
      "completion-section",
      text("p", "completionHelp"),
      completeButton,
      completionStatus,
    ),
    button("returnLearning", done, "button subtle"),
  );
}

export function showActivity(
  host: HTMLElement,
  detail: PlanDetail,
  isCurrent: () => boolean = () => host.isConnected,
  lifecycle?: LifecycleContext,
): void {
  const list = el("ol", "history-list");
  for (const activity of [...detail.activities].reverse()) {
    const row = el(
      "li",
      "history-entry",
      el("h4", "", activity.stepTitle),
      el(
        "p",
        "hint",
        dated(activity.createdAt, detail.progress.timezone),
        ` · ${activity.minutes} min`,
      ),
    );
    if (activity.reflection)
      row.append(
        text("p", "privateNote", "reflection-label"),
        el("p", "reflection-text", activity.reflection),
      );
    if (lifecycle) row.append(studyRecordActions(host, detail, activity, lifecycle));
    list.append(row);
  }
  const completions = el("ol", "history-list");
  for (const completion of [...detail.completions].reverse()) {
    const row = el(
      "li",
      "history-entry",
      el("h4", "", completion.stepTitle),
      text("span", completion.correctedAt ? "completionCorrected" : "complete", "completed-label"),
      " · ",
      dated(completion.createdAt, detail.progress.timezone),
    );
    if (completion.correctedAt)
      row.append(
        text("p", "completionCorrectedCopy", "hint"),
        dated(completion.correctedAt, detail.progress.timezone),
      );
    else if (lifecycle) row.append(completionAction(host, detail, completion, lifecycle));
    completions.append(row);
  }
  const changes = el("div", "scope-history");
  for (const event of detail.scopeEvents)
    changes.append(
      el(
        "p",
        "hint",
        text("span", event.kind === "restore" ? "stepRestoredHistory" : "scopeChanged", "", {
          before: event.previousCount,
          after: event.currentCount,
        }),
        " · ",
        dated(event.createdAt, detail.progress.timezone),
      ),
    );
  const goal = el("h2", "", detail.plan.goal);
  goal.id = "activity-goal";
  const history = text("h2", "history");
  history.id = "activity-history-title";
  const overview = el(
    "section",
    "activity-overview",
    goal,
    text("p", "historyCopy", "hint"),
    rhythm(detail),
    aiPanel({
      title: "aiProgressTitle",
      action: "aiProgressAction",
      disclosure: "aiProgressDisclosure",
      current: isCurrent,
      signature: () => String(detail.plan.revision),
      build: () => ({
        action: "progress_recap",
        locale: getLocale(),
        planId: detail.plan.id,
        revision: detail.plan.revision,
      }),
    }),
  );
  overview.setAttribute("aria-labelledby", goal.id);
  const retained = el(
    "section",
    "activity-history",
    history,
    text("p", "pastCompletions", "", { count: detail.progress.cumulativeCompletions }),
    el(
      "section",
      "activity-records",
      text("h3", "sessionCount", "", { count: detail.activities.length }),
      detail.activities.length ? list : text("p", "noActivity", "empty-copy"),
    ),
    detail.completions.length
      ? el("section", "activity-records", text("h3", "activityCompletions"), completions)
      : null,
    detail.scopeEvents.length
      ? el("section", "activity-records", text("h3", "activityChanges"), changes)
      : null,
  );
  retained.setAttribute("aria-labelledby", history.id);
  host.replaceChildren(
    el(
      "div",
      "activity-layout",
      el("div", "page-heading", text("h1", "activity")),
      overview,
      retained,
    ),
  );
  if (lifecycle)
    host.querySelector(".activity-layout")?.append(removedStepsSection(host, detail, lifecycle));
}
