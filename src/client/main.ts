import type {
  GoalTemplate,
  LearningPlan,
  Locale,
  MeResponse,
  PlanDetail,
  Profile,
} from "../shared/contracts.js";
import { errorKey, RequestError, request } from "./api.js";
import { cancelAiOperations } from "./ai-assistance.js";
import { showCircles } from "./circle.js";
import { showComeback } from "./comeback.js";
import { getLocale, type MessageKey, message, setLocale } from "./i18n.js";
import { showActivity, showLearning, showStudy } from "./journey.js";
import { type LifecycleContext, showArchivedPlan, showJourneys } from "./learning-lifecycle.js";
import { showPlanEditor } from "./plan-editor.js";
import { createShell, type Route } from "./shell.js";
import {
  button,
  el,
  field,
  fieldErrors,
  focusFailure,
  focusHeading,
  input,
  lockForm,
  notice,
  passwordField,
  text,
} from "./ui.js";
import "./styles.css";

const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Missing application root");
const root = rootElement;
let me: MeResponse | null = null;
let plans: LearningPlan[] = [];
let detail: PlanDetail | null = null;
let selectedPlanId: string | null = null;
let templates: GoalTemplate[] = [];
let dirty = false;
let route: Route = "learning";
let journeyStatus: "active" | "archived" = "active";
let archivedPlanId: string | null = null;
let loadVersion = 0;
let sessionVersion = 0;
let profileVersion = 0;
let profileWrites: Promise<void> = Promise.resolve();
let signOutPending = false;
const shell = createShell(root, {
  onNavigate: (target) => {
    if (canLeave()) {
      archivedPlanId = null;
      route = target;
      history.replaceState(null, "", `#${route}`);
      void renderRoute(true);
    }
  },
  onLocale: (locale) => {
    void changeLocale(locale);
  },
  onSignOut: () => {
    void signOut();
  },
  onProfile: () => {
    if (canLeave()) showProfile();
  },
});
function beginView(): () => boolean {
  cancelAiOperations();
  const view = ++loadVersion;
  const session = sessionVersion;
  return () => view === loadVersion && session === sessionVersion;
}
function clearSession(): void {
  cancelAiOperations();
  sessionVersion += 1;
  loadVersion += 1;
  profileVersion += 1;
  profileWrites = Promise.resolve();
  me = null;
  detail = null;
  selectedPlanId = null;
  plans = [];
  templates = [];
  journeyStatus = "active";
  archivedPlanId = null;
  dirty = false;
  shell.setUser(null);
}
function canLeave(): boolean {
  if (signOutPending) return false;
  if (dirty && !window.confirm(message("unsavedLeave"))) return false;
  dirty = false;
  shell.status(null);
  return true;
}
function markDirty(): void {
  dirty = true;
}
function saveProfile(patch: Partial<Profile>): Promise<MeResponse | null> {
  const session = sessionVersion;
  const userId = me?.user.id;
  const write = profileWrites.then(async () => {
    if (session !== sessionVersion || !userId) return null;
    // Read inside the queue: an earlier response may have been lost even though
    // its write persisted. Never send a stale timezone with a locale-only edit.
    const previous = await request<MeResponse>("/api/me");
    if (session !== sessionVersion) return null;
    if (previous.user.id !== userId) throw new RequestError("SESSION_CHANGED", 401);
    const result = await request<MeResponse>("/api/me", "PUT", {
      ...previous.profile,
      ...patch,
    });
    if (session !== sessionVersion) return null;
    me = result;
    return result;
  });
  // A failed operation reports to its caller, but does not poison later retries.
  profileWrites = write.then(
    () => {},
    () => {},
  );
  return write;
}
async function changeLocale(locale: Locale): Promise<void> {
  if (signOutPending) return;
  cancelAiOperations();
  setLocale(locale);
  if (me?.profile) {
    const session = sessionVersion;
    const operation = ++profileVersion;
    const view = loadVersion;
    try {
      const result = await saveProfile({ locale });
      if (!result || session !== sessionVersion || operation !== profileVersion) return;
      shell.setUser(me);
      if (view === loadVersion) shell.status(null);
    } catch (error) {
      if (session === sessionVersion && operation === profileVersion && view === loadVersion)
        shell.status(errorKey(error));
    }
  }
}
async function signOut(): Promise<void> {
  if (signOutPending || !me) return;
  if (dirty && !window.confirm(message("unsavedLeave"))) return;
  const session = sessionVersion;
  signOutPending = true;
  // Keep existing forms and their in-flight saves alive until the outcome is
  // known. Inert prevents new interactions without erasing unsaved input.
  root.inert = true;
  root.setAttribute("aria-busy", "true");
  shell.status("loading");
  try {
    await request("/api/auth/sign-out", "POST", {});
    if (session !== sessionVersion) return;
    clearSession();
    shell.status(null);
    showAuth();
  } catch (error) {
    if (session === sessionVersion) shell.status(errorKey(error));
  } finally {
    signOutPending = false;
    root.inert = false;
    root.removeAttribute("aria-busy");
  }
}
function showAuth(signUp = false): void {
  const current = beginView();
  shell.setUser(null);
  const email = input("email", "email");
  email.required = true;
  email.maxLength = 254;
  email.autocomplete = "email";
  const password = input("password", "password");
  password.required = true;
  password.minLength = 8;
  password.maxLength = 128;
  password.autocomplete = signUp ? "new-password" : "current-password";
  const name = input("text", "name");
  name.required = true;
  name.maxLength = 80;
  name.autocomplete = "name";
  const status = el("div");
  const submit = text("button", signUp ? "signUp" : "signIn", "button primary");
  submit.type = "submit";
  const form = el(
    "form",
    "auth-form",
    text("h2", signUp ? "signUp" : "signIn"),
    ...(signUp ? [field("name", name)] : []),
    field("email", email),
    passwordField(password),
    submit,
    status,
    button(signUp ? "haveAccount" : "needAccount", () => showAuth(!signUp), "text-button"),
  );
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!current() || signOutPending || !form.reportValidity()) return;
    const unlock = lockForm(form);
    let failed = false;
    status.replaceChildren(notice("loading"));
    void (async () => {
      if (signUp) {
        await request("/api/auth/sign-up/email", "POST", {
          name: name.value.trim(),
          email: email.value.trim(),
          password: password.value,
        });
        if (!current()) return;
      }
      await request("/api/auth/sign-in/email", "POST", {
        email: email.value.trim(),
        password: password.value,
      });
      if (!current()) return;
      clearSession();
      await initialize();
    })()
      .catch((error: unknown) => {
        if (!current()) return;
        failed = true;
        status.replaceChildren(
          notice(
            error instanceof RequestError && error.status === 0
              ? "networkError"
              : signUp
                ? "accountError"
                : "credentials",
            true,
          ),
        );
      })
      .finally(() => {
        unlock();
        if (failed) focusFailure(status, current);
      });
  });
  shell.main.replaceChildren(
    el(
      "div",
      "auth-layout",
      el("section", "auth-intro", text("h1", "welcome"), text("p", "welcomeCopy", "subtitle")),
      form,
    ),
  );
  // Sign-out renders this view while root is inert. Focus only after its
  // finally block unlocks the page, and never focus a superseded auth view.
  queueMicrotask(() => {
    if (current()) focusHeading(shell.main);
  });
}
function showProfile(): void {
  if (!me) {
    showAuth();
    return;
  }
  const current = beginView();
  const previous = me.profile;
  const timezone = input(
    "text",
    "timezone",
    previous?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  timezone.required = true;
  timezone.maxLength = 100;
  const list = el("datalist");
  list.id = "timezones";
  for (const zone of [
    "Africa/Lagos",
    "Africa/Nairobi",
    "Africa/Dakar",
    "Africa/Cairo",
    "Europe/Paris",
    "Europe/London",
    "America/New_York",
    "Asia/Dubai",
    "UTC",
  ]) {
    const option = el("option");
    option.value = zone;
    list.append(option);
  }
  timezone.setAttribute("list", list.id);
  const save = text("button", "confirmProfile", "button primary");
  save.type = "submit";
  const status = el("div");
  const timezoneField = field("timezone", timezone, "timezoneHint");
  const timezoneErrors = fieldErrors(timezone, timezoneField);
  const form = el(
    "form",
    "settings-form",
    text("p", "profileCopy"),
    timezoneField,
    list,
    save,
    status,
  );
  form.addEventListener("input", () => {
    if (current()) markDirty();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!current() || signOutPending || !form.reportValidity()) return;
    profileVersion += 1;
    const unlock = lockForm(form);
    let failed = false;
    let failedControl: HTMLElement | undefined;
    status.replaceChildren(notice("saving"));
    void saveProfile({
      locale: getLocale(),
      timezone: timezone.value.trim(),
    })
      .then(async (result) => {
        if (!result || !current()) return;
        dirty = false;
        shell.status("profileSaved");
        await renderRoute(true);
      })
      .catch((error: unknown) => {
        if (!current()) return;
        failed = true;
        if (
          error instanceof RequestError &&
          error.status === 400 &&
          error.code === "invalid_input" &&
          error.field === "timezone"
        ) {
          timezoneErrors.show(errorKey(error));
          status.replaceChildren();
          failedControl = timezone;
        } else status.replaceChildren(notice(errorKey(error), true));
      })
      .finally(() => {
        unlock();
        if (failed) focusFailure(status, current, failedControl);
      });
  });
  shell.main.replaceChildren(
    text("h1", "profileTitle"),
    form,
    ...(previous
      ? [
          button(
            "cancel",
            () => {
              if (canLeave()) void renderRoute(true);
            },
            "button subtle",
          ),
        ]
      : []),
  );
  focusHeading(shell.main);
}
function createOrEdit(existing: LearningPlan | null, selectedStepId?: string): void {
  if (!canLeave()) return;
  const current = beginView();
  const focusSelectedStep = showPlanEditor(
    shell.main,
    templates,
    existing,
    (result) => {
      if (!current()) return;
      detail = result;
      selectedPlanId = result.plan.id;
      dirty = false;
      route = "learning";
      history.replaceState(null, "", "#learning");
      shell.status("planSaved");
      void renderRoute(true);
    },
    () => {
      if (current() && canLeave()) void renderRoute(true);
    },
    () => {
      if (current()) markDirty();
    },
    { ...(selectedStepId === undefined ? {} : { selectedStepId }), isCurrent: current },
  );
  focusHeading(shell.main);
  focusSelectedStep();
}
function empty(): void {
  shell.main.replaceChildren(
    el(
      "section",
      "empty-state",
      text("h1", "noPlan"),
      text("p", "noPlanCopy", "subtitle"),
      button("createGoal", () => createOrEdit(null), "button primary"),
      el(
        "section",
        "empty-circle-entry",
        text("h2", "circleTitle"),
        text("p", "circleCopy", "hint"),
        button("openCircles", openCircles, "button subtle"),
      ),
    ),
  );
}
function openCircles(): void {
  if (!me || !canLeave()) return;
  const current = beginView();
  showCircles(
    shell.main,
    me,
    detail,
    () => {
      if (current()) void renderRoute(true);
    },
    canLeave,
    (value) => {
      if (current()) dirty = value;
    },
    current,
  );
  focusHeading(shell.main);
}
async function renderRoute(focus = false): Promise<void> {
  const isCurrent = beginView();
  shell.setRoute(route);
  if (!me) {
    showAuth();
    return;
  }
  if (!me.profile) {
    showProfile();
    return;
  }
  try {
    const [planResult, templateResult] = await Promise.all([
      request<{ plans: LearningPlan[] }>("/api/plans"),
      templates.length
        ? Promise.resolve({ templates })
        : request<{ templates: GoalTemplate[] }>("/api/templates"),
    ]);
    if (!isCurrent()) return;
    plans = planResult.plans;
    templates = templateResult.templates;
    const lifecycle: LifecycleContext = {
      current: isCurrent,
      setDirty: (value) => {
        if (isCurrent()) dirty = value;
      },
      changed: (result, outcome?: MessageKey) => {
        if (!isCurrent()) return;
        detail = result;
        selectedPlanId = result.plan.id;
        dirty = false;
        archivedPlanId = null;
        if (outcome === "planRestored") {
          route = "learning";
          history.replaceState(null, "", "#learning");
        } else if (result.plan.archivedAt) {
          route = "journeys";
          journeyStatus = "archived";
          history.replaceState(null, "", "#journeys");
        }
        shell.status(outcome ?? null);
        void renderRoute(true);
      },
      deleted: (planId) => {
        if (!isCurrent()) return;
        if (detail?.plan.id === planId) detail = null;
        if (selectedPlanId === planId) selectedPlanId = null;
        archivedPlanId = null;
        dirty = false;
        shell.status("planDeleted");
        void renderRoute(true);
      },
    };
    // Journeys must remain reachable for archived-only accounts. It does not
    // depend on loading an unrelated active plan first.
    if (route === "journeys") {
      if (archivedPlanId) {
        const archived = await request<PlanDetail>(`/api/plans/${archivedPlanId}`);
        if (!isCurrent()) return;
        if (!archived.plan.archivedAt) {
          detail = archived;
          archivedPlanId = null;
          route = "learning";
          history.replaceState(null, "", "#learning");
          void renderRoute(true);
          return;
        }
        showArchivedPlan(shell.main, archived, lifecycle, () => {
          if (!isCurrent() || !canLeave()) return;
          archivedPlanId = null;
          void renderRoute(true);
        });
      } else {
        showJourneys(shell.main, journeyStatus, {
          current: isCurrent,
          canLeave,
          setDirty: lifecycle.setDirty,
          selectStatus: (value) => {
            journeyStatus = value;
            void renderRoute(true);
          },
          open: (plan) => {
            if (!isCurrent()) return;
            if (plan.archivedAt) archivedPlanId = plan.id;
            else {
              selectedPlanId = plan.id;
              route = "learning";
              history.replaceState(null, "", "#learning");
            }
            void renderRoute(true);
          },
          create: () => createOrEdit(null),
          changed: lifecycle.changed,
          deleted: lifecycle.deleted,
        });
      }
      if (focus) focusHeading(shell.main);
      return;
    }
    const selected =
      plans.find((plan) => plan.id === (selectedPlanId ?? detail?.plan.id)) ?? plans[0];
    if (!selected) {
      detail = null;
      selectedPlanId = null;
      empty();
      if (focus) focusHeading(shell.main);
      return;
    }
    const current = await request<PlanDetail>(`/api/plans/${selected.id}`);
    if (!isCurrent()) return;
    if (current.plan.archivedAt) {
      archivedPlanId = current.plan.id;
      route = "journeys";
      history.replaceState(null, "", "#journeys");
      void renderRoute(true);
      return;
    }
    detail = current;
    selectedPlanId = current.plan.id;
    if (route === "activity") showActivity(shell.main, current, isCurrent, lifecycle);
    else
      showLearning(
        shell.main,
        current,
        (selectedStepId) => createOrEdit(current.plan, selectedStepId),
        (step, minutes) => {
          if (!isCurrent() || !canLeave()) return;
          const studyCurrent = beginView();
          showStudy(
            shell.main,
            current,
            step,
            minutes,
            (result, studySaved) => {
              if (!studyCurrent()) return;
              detail = result;
              if (studySaved) dirty = false;
            },
            () => {
              if (studyCurrent() && canLeave()) void renderRoute(true);
            },
            () => {
              if (studyCurrent()) markDirty();
            },
            templates,
            studyCurrent,
          );
          focusHeading(shell.main);
        },
        () => createOrEdit(null),
        () => {
          if (!isCurrent() || !canLeave()) return;
          const comebackCurrent = beginView();
          showComeback(
            shell.main,
            current,
            (result) => {
              if (!comebackCurrent()) return;
              detail = result;
              shell.status("comebackSaved");
              void renderRoute(true);
            },
            () => {
              if (comebackCurrent()) void renderRoute(true);
            },
            (result) => {
              if (comebackCurrent()) createOrEdit(result.plan);
            },
            comebackCurrent,
          );
          focusHeading(shell.main);
        },
        openCircles,
        isCurrent,
        lifecycle,
      );
    if (plans.length > 1) {
      const select = el("select");
      select.name = "currentJourney";
      for (const plan of plans) {
        const option = el("option", "", plan.goal);
        option.value = plan.id;
        select.append(option);
      }
      select.value = current.plan.id;
      select.addEventListener("change", () => {
        if (!isCurrent()) return;
        if (!canLeave()) {
          select.value = current.plan.id;
          return;
        }
        const chosen = plans.find((plan) => plan.id === select.value);
        if (chosen) {
          detail = { ...current, plan: chosen };
          selectedPlanId = chosen.id;
          void renderRoute(true);
        }
      });
      shell.main.prepend(field("choosePlan", select));
    }
    if (focus) focusHeading(shell.main);
  } catch (error) {
    if (!isCurrent()) return;
    if (error instanceof RequestError && error.status === 401) {
      clearSession();
      shell.status("signedOut");
      showAuth();
    } else
      shell.main.replaceChildren(
        notice(errorKey(error), true),
        button("retry", () => {
          void renderRoute(true);
        }),
      );
  }
}
async function initialize(): Promise<void> {
  const current = beginView();
  try {
    const result = await request<MeResponse>("/api/me");
    if (!current()) return;
    if (me?.user.id !== result.user.id) clearSession();
    me = result;
    shell.setUser(me);
    if (me.profile) setLocale(me.profile.locale);
    const hash = location.hash.slice(1);
    route = hash === "journeys" || hash === "activity" ? hash : "learning";
    await renderRoute();
  } catch (error) {
    if (!current()) return;
    if (error instanceof RequestError && error.status === 401) {
      clearSession();
      showAuth();
    } else
      shell.main.replaceChildren(
        notice(errorKey(error), true),
        button("retry", () => {
          void initialize();
        }),
      );
  }
}
window.addEventListener("hashchange", () => {
  const hash = location.hash.slice(1);
  if (hash === "main-content") {
    shell.main.focus();
    return;
  }
  if (canLeave()) {
    route = hash === "journeys" || hash === "activity" ? hash : "learning";
    void renderRoute(true);
  }
});
window.addEventListener("beforeunload", (event) => {
  if (dirty) event.preventDefault();
});
window.addEventListener("littlefurther-session-expired", () => {
  clearSession();
  shell.status("signedOut");
  showAuth();
});
shell.main.replaceChildren(text("p", "loading", "loading-state"));
void initialize();
