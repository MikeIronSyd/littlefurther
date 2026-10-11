import type { Locale, MeResponse } from "../shared/contracts.js";
import { createBrand } from "./branding.js";
import { bind, getLocale, message } from "./i18n.js";
import { button, el, icon, named, text } from "./ui.js";

type Theme = "light" | "dark";
const THEME_KEY = "capstone.ui.theme";
const SIDEBAR_KEY = "capstone.ui.sidebar";
function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* The current-page choice remains usable when storage is blocked. */
  }
}
export type Route = "learning" | "journeys" | "activity";
export interface ShellOptions {
  onNavigate: (route: Route) => void;
  onLocale: (locale: Locale) => void;
  onSignOut: () => void;
  onProfile: () => void;
}

export function createShell(root: HTMLElement, options: ShellOptions) {
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const mobileQuery = window.matchMedia("(max-width: 799px)");
  const storedTheme = read(THEME_KEY);
  let explicitTheme: Theme | null =
    storedTheme === "light" || storedTheme === "dark" ? storedTheme : null;
  let collapsed = read(SIDEBAR_KEY) === "collapsed";
  let signedIn = false;
  let route: Route = "learning";
  const skip = text("a", "skip", "skip-link");
  skip.href = "#main-content";
  const navTrigger = el("button", "nav-trigger");
  navTrigger.type = "button";
  const brand = createBrand();
  const brandGroup = el("div", "brand-group", navTrigger, brand);
  const language = el("select", "language-select");
  for (const [value, label] of [
    ["en", "English"],
    ["fr", "Français"],
  ]) {
    const option = el("option", "", label);
    option.value = value ?? "en";
    language.append(option);
  }
  bind(language, () => {
    language.value = getLocale();
    language.setAttribute("aria-label", message("language"));
  });
  language.addEventListener("change", () =>
    options.onLocale(language.value === "fr" ? "fr" : "en"),
  );
  const themeButton = el("button", "theme-button");
  themeButton.type = "button";
  const themeTooltip = el("span", "theme-tooltip");
  themeTooltip.id = "theme-tooltip";
  themeTooltip.setAttribute("role", "tooltip");
  themeTooltip.hidden = true;
  const themeControl = el("div", "theme-control", themeButton, themeTooltip);
  let themeHovered = false;
  let themeFocused = false;
  let tooltipDismissed = false;
  const paintTooltip = (): void => {
    themeTooltip.hidden = tooltipDismissed || !(themeHovered || themeFocused);
  };
  themeControl.addEventListener("pointerenter", () => {
    themeHovered = true;
    tooltipDismissed = false;
    paintTooltip();
  });
  themeControl.addEventListener("pointerleave", () => {
    themeHovered = false;
    paintTooltip();
  });
  themeButton.addEventListener("focus", () => {
    themeFocused = true;
    tooltipDismissed = false;
    paintTooltip();
  });
  themeButton.addEventListener("blur", () => {
    themeFocused = false;
    paintTooltip();
  });
  root.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !themeTooltip.hidden) {
      tooltipDismissed = true;
      paintTooltip();
    }
  });
  const account = el("details", "account-menu");
  const accountSummary = el("summary", "account-summary");
  named(accountSummary, "account");
  const accountName = el("span", "account-name");
  const avatar = el("span", "avatar", "?");
  avatar.setAttribute("aria-hidden", "true");
  const accountChevron = icon("chevron");
  accountChevron.classList.add("account-chevron");
  accountSummary.append(avatar, accountName, accountChevron);
  const accountItems = el(
    "div",
    "account-items",
    button(
      "preferences",
      () => {
        account.open = false;
        options.onProfile();
      },
      "menu-action",
    ),
    button(
      "signOut",
      () => {
        account.open = false;
        options.onSignOut();
      },
      "menu-action",
    ),
  );
  account.append(accountSummary, accountItems);
  account.hidden = true;
  const utilities = el("div", "utilities", language, themeControl, account);
  const header = el("header", "app-header", brandGroup, utilities);
  const sidebar = el("aside", "sidebar");
  sidebar.id = "desktop-navigation";
  const drawer = el("dialog", "mobile-drawer");
  drawer.id = "mobile-navigation";
  drawer.setAttribute("aria-labelledby", "drawer-title");
  const drawerTitle = text("h2", "navigation");
  drawerTitle.id = "drawer-title";
  const closeDrawer = button("close", () => drawer.close(), "button subtle");
  const main = el("main", "workspace");
  main.id = "main-content";
  main.tabIndex = -1;
  const liveStatus = el("div", "global-status");
  liveStatus.setAttribute("role", "status");
  liveStatus.setAttribute("aria-live", "polite");
  const frame = el("div", "app-frame", sidebar, el("div", "main-column", liveStatus, main));
  const navLinks: HTMLAnchorElement[] = [];
  const createNavigation = (): HTMLElement => {
    const nav = el("nav", "nav-links");
    named(nav, "navigation");
    for (const item of ["learning", "journeys", "activity"] as const) {
      const link = el(
        "a",
        "nav-link",
        icon(item === "learning" ? "home" : item === "journeys" ? "path" : "activity"),
        text("span", item, "nav-label"),
      );
      link.href = `#${item}`;
      link.dataset.route = item;
      named(link, item);
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const fromDrawer = drawer.open;
        if (fromDrawer) {
          returningFocus = false;
          drawer.close();
        }
        options.onNavigate(item);
      });
      navLinks.push(link);
      nav.append(link);
    }
    return nav;
  };
  let returningFocus = true;
  sidebar.append(createNavigation());
  drawer.append(el("div", "drawer-heading", drawerTitle, closeDrawer), createNavigation());
  root.replaceChildren(skip, header, frame, drawer);
  const effectiveTheme = (): Theme => explicitTheme ?? (darkQuery.matches ? "dark" : "light");
  const paintTheme = (): void => {
    const value = effectiveTheme();
    document.documentElement.dataset.theme = value;
    themeButton.replaceChildren(icon(value === "dark" ? "sun" : "moon"));
    const action = message(value === "dark" ? "switchToLight" : "switchToDark");
    themeButton.setAttribute("aria-label", action);
    themeTooltip.textContent = action;
  };
  const paintNavigation = (): void => {
    const mobile = mobileQuery.matches;
    frame.classList.toggle("signed-out", !signedIn);
    frame.classList.toggle("sidebar-collapsed", collapsed);
    navTrigger.hidden = !signedIn;
    sidebar.hidden = !signedIn;
    drawer.hidden = !signedIn;
    navTrigger.replaceChildren(
      icon(
        mobile
          ? drawer.open
            ? "panel-close"
            : "panel-open"
          : collapsed
            ? "panel-open"
            : "panel-close",
      ),
    );
    navTrigger.setAttribute(
      "aria-label",
      message(mobile ? "openNav" : collapsed ? "expandNav" : "collapseNav"),
    );
    navTrigger.setAttribute("aria-controls", mobile ? drawer.id : sidebar.id);
    navTrigger.setAttribute("aria-expanded", String(mobile ? drawer.open : !collapsed));
    for (const link of navLinks) {
      if (link.dataset.route === route) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
  };
  bind(themeButton, paintTheme);
  bind(navTrigger, paintNavigation);
  themeButton.addEventListener("click", () => {
    explicitTheme = effectiveTheme() === "dark" ? "light" : "dark";
    write(THEME_KEY, explicitTheme);
    paintTheme();
  });
  darkQuery.addEventListener("change", () => {
    if (!explicitTheme) paintTheme();
  });
  navTrigger.addEventListener("click", () => {
    if (!signedIn) return;
    if (mobileQuery.matches) {
      returningFocus = true;
      drawer.showModal();
      document.body.classList.add("drawer-open");
      paintNavigation();
      closeDrawer.focus();
    } else {
      collapsed = !collapsed;
      write(SIDEBAR_KEY, collapsed ? "collapsed" : "expanded");
      paintNavigation();
    }
  });
  drawer.addEventListener("close", () => {
    document.body.classList.remove("drawer-open");
    paintNavigation();
    if (returningFocus && signedIn) navTrigger.focus();
    returningFocus = true;
  });
  drawer.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const controls = [
      ...drawer.querySelectorAll<HTMLElement>("button:not(:disabled), a[href]"),
    ].filter((control) => control.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (!first || !last) return;
    if (
      event.shiftKey &&
      (document.activeElement === first || !drawer.contains(document.activeElement))
    ) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      (document.activeElement === last || !drawer.contains(document.activeElement))
    ) {
      event.preventDefault();
      first.focus();
    }
  });
  mobileQuery.addEventListener("change", () => {
    const active = document.activeElement;
    if (!mobileQuery.matches && drawer.open) {
      returningFocus = false;
      drawer.close();
      navTrigger.focus();
    } else if (mobileQuery.matches && active instanceof Node && sidebar.contains(active))
      navTrigger.focus();
    document.body.classList.remove("drawer-open");
    paintNavigation();
  });
  paintTheme();
  paintNavigation();
  return {
    main,
    setRoute(value: Route): void {
      route = value;
      paintNavigation();
    },
    setUser(value: MeResponse | null): void {
      signedIn = Boolean(value);
      if (!signedIn) {
        account.open = false;
        if (drawer.open) {
          returningFocus = false;
          drawer.close();
        }
        document.body.classList.remove("drawer-open");
      }
      account.hidden = !value;
      avatar.textContent = value?.user.name.slice(0, 1).toLocaleUpperCase() ?? "?";
      accountName.textContent = value?.user.name ?? "";
      paintNavigation();
    },
    status(key: Parameters<typeof message>[0] | null): void {
      liveStatus.replaceChildren(...(key ? [text("span", key)] : []));
    },
  };
}
