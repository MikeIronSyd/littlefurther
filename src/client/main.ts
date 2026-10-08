import type {
  GoalTemplate,
  LearningPlan,
  Locale,
  MeResponse,
  PlanDetail,
} from "../shared/contracts.js";
import { errorKey, RequestError, request } from "./api.js";
import { showCircles } from "./circle.js";
import { showComeback } from "./comeback.js";
import { getLocale, message, setLocale } from "./i18n.js";
import { showActivity, showLearning, showStudy } from "./journey.js";
import { showPlanEditor } from "./plan-editor.js";
import { createShell, type Route } from "./shell.js";
import { button, el, field, focusHeading, input, lockForm, notice, text } from "./ui.js";
import "./styles.css";

const root = document.getElementById("app");
if (!root) throw new Error("Missing application root");
let me: MeResponse | null = null;
let plans: LearningPlan[] = [];
let detail: PlanDetail | null = null;
let templates: GoalTemplate[] = [];
let dirty = false;
let route: Route = "learning";
let loadVersion = 0;
const shell = createShell(root, {
  onNavigate: (target) => {
    if (canLeave()) {
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
function canLeave(): boolean {
  if (dirty && !window.confirm(message("unsavedLeave"))) return false;
  dirty = false;
  return true;
}
function markDirty(): void {
  dirty = true;
}
async function changeLocale(locale: Locale): Promise<void> {
  setLocale(locale);
  if (me?.profile) {
    try {
      me = await request<MeResponse>("/api/me", "PUT", { ...me.profile, locale });
      shell.setUser(me);
      shell.status(null);
    } catch (error) {
      shell.status(errorKey(error));
    }
  }
}
async function signOut(): Promise<void> {
  if (!canLeave()) return;
  try {
    await request("/api/auth/sign-out", "POST", {});
    me = null;
    detail = null;
    plans = [];
    templates = [];
    shell.setUser(null);
    shell.status(null);
    showAuth();
  } catch (error) {
    shell.status(errorKey(error));
  }
}
function showAuth(signUp = false): void {
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
    field("password", password, "passwordHint"),
    submit,
    status,
    button(signUp ? "haveAccount" : "needAccount", () => showAuth(!signUp), "text-button"),
  );
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const unlock = lockForm(form);
    status.replaceChildren(notice("loading"));
    void (async () => {
      if (signUp)
        await request("/api/auth/sign-up/email", "POST", {
          name: name.value.trim(),
          email: email.value.trim(),
          password: password.value,
        });
      await request("/api/auth/sign-in/email", "POST", {
        email: email.value.trim(),
        password: password.value,
      });
      await initialize();
    })()
      .catch((error: unknown) => {
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
      });
  });
  shell.main.replaceChildren(
    el(
      "div",
      "auth-layout",
      el(
        "section",
        "auth-intro",
        text("h1", "welcome"),
        text("p", "welcomeCopy", "subtitle"),
        text("p", "localAccount", "hint"),
      ),
      form,
    ),
  );
}
function showProfile(): void {
  if (!me) {
    showAuth();
    return;
  }
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
  const form = el(
    "form",
    "settings-form",
    text("p", "profileCopy"),
    field("timezone", timezone, "timezoneHint"),
    list,
    save,
    status,
  );
  form.addEventListener("input", markDirty);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const unlock = lockForm(form);
    status.replaceChildren(notice("saving"));
    void request<MeResponse>("/api/me", "PUT", {
      locale: getLocale(),
      timezone: timezone.value.trim(),
    })
      .then(async (result) => {
        me = result;
        dirty = false;
        shell.status("profileSaved");
        await renderRoute(true);
      })
      .catch((error: unknown) => {
        status.replaceChildren(notice(errorKey(error), true));
      })
      .finally(() => {
        unlock();
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
function createOrEdit(existing: LearningPlan | null): void {
  if (!canLeave()) return;
  showPlanEditor(
    shell.main,
    templates,
    existing,
    (result) => {
      detail = result;
      dirty = false;
      route = "learning";
      shell.status("planSaved");
      void renderRoute(true);
    },
    () => {
      if (canLeave()) void renderRoute(true);
    },
    markDirty,
  );
  focusHeading(shell.main);
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
  const circleVersion = ++loadVersion;
  showCircles(
    shell.main,
    me,
    detail,
    () => void renderRoute(true),
    canLeave,
    (value) => {
      dirty = value;
    },
    () => loadVersion === circleVersion,
  );
  focusHeading(shell.main);
}
async function renderRoute(focus = false): Promise<void> {
  const version = ++loadVersion;
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
    if (version !== loadVersion) return;
    plans = planResult.plans;
    templates = templateResult.templates;
    const selected = plans.find((plan) => plan.id === detail?.plan.id) ?? plans[0];
    if (!selected) {
      detail = null;
      empty();
      if (focus) focusHeading(shell.main);
      return;
    }
    const current = await request<PlanDetail>(`/api/plans/${selected.id}`);
    if (version !== loadVersion) return;
    detail = current;
    if (route === "journeys") {
      const list = el("ul", "journey-list");
      for (const plan of plans) {
        const open = button("goJourney", () => {
          detail = { ...current, plan };
          route = "learning";
          history.replaceState(null, "", "#learning");
          void renderRoute(true);
        });
        list.append(
          el(
            "li",
            "journey-row",
            el(
              "div",
              "",
              el("h2", "", plan.goal),
              text("p", "planCount", "hint", { count: plan.steps.length }),
            ),
            open,
          ),
        );
      }
      shell.main.replaceChildren(
        el(
          "div",
          "page-heading",
          text("h1", "journeys"),
          button("createGoal", () => createOrEdit(null), "button primary"),
        ),
        list,
      );
    } else if (route === "activity") showActivity(shell.main, current);
    else
      showLearning(
        shell.main,
        current,
        () => createOrEdit(current.plan),
        (step, minutes) => {
          showStudy(
            shell.main,
            current,
            step,
            minutes,
            (result, studySaved) => {
              detail = result;
              if (studySaved) dirty = false;
            },
            () => {
              if (canLeave()) void renderRoute(true);
            },
            markDirty,
          );
          focusHeading(shell.main);
        },
        () => createOrEdit(null),
        () => {
          const comebackVersion = ++loadVersion;
          showComeback(
            shell.main,
            current,
            (result) => {
              detail = result;
              shell.status("comebackSaved");
              void renderRoute(true);
            },
            () => void renderRoute(true),
            (result) => createOrEdit(result.plan),
            () => loadVersion === comebackVersion,
          );
          focusHeading(shell.main);
        },
        openCircles,
      );
    if (plans.length > 1 && route !== "journeys") {
      const select = el("select");
      select.name = "currentJourney";
      for (const plan of plans) {
        const option = el("option", "", plan.goal);
        option.value = plan.id;
        select.append(option);
      }
      select.value = current.plan.id;
      select.addEventListener("change", () => {
        const chosen = plans.find((plan) => plan.id === select.value);
        if (chosen) {
          detail = { ...current, plan: chosen };
          void renderRoute(true);
        }
      });
      shell.main.prepend(field("choosePlan", select));
    }
    if (focus) focusHeading(shell.main);
  } catch (error) {
    if (version !== loadVersion) return;
    if (error instanceof RequestError && error.status === 401) {
      me = null;
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
  try {
    me = await request<MeResponse>("/api/me");
    shell.setUser(me);
    if (me.profile) setLocale(me.profile.locale);
    const hash = location.hash.slice(1);
    route = hash === "journeys" || hash === "activity" ? hash : "learning";
    await renderRoute();
  } catch (error) {
    if (error instanceof RequestError && error.status === 401) showAuth();
    else
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
shell.main.replaceChildren(text("p", "loading", "loading-state"));
void initialize();
