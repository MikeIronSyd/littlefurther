import { bind, type MessageKey, message } from "./i18n.js";

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = "",
  ...children: (Node | string | null | undefined | false)[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  for (const child of children)
    if (child !== null && child !== undefined && child !== false) node.append(child);
  return node;
}
export function text<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  key: MessageKey,
  className = "",
  values: Record<string, string | number> = {},
): HTMLElementTagNameMap[K] {
  const node = el(tag, className);
  bind(node, () => {
    node.textContent = message(key, values);
  });
  return node;
}
export function button(key: MessageKey, run: () => void, className = "button"): HTMLButtonElement {
  const node = text("button", key, className);
  node.type = "button";
  node.addEventListener("click", run);
  return node;
}
export function named(node: Element, key: MessageKey, attribute = "aria-label"): void {
  bind(node, () => {
    node.setAttribute(attribute, message(key));
  });
}
export function field(
  key: MessageKey,
  control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  hint?: MessageKey,
): HTMLDivElement {
  control.id ||= `field-${crypto.randomUUID()}`;
  const label = text("label", key);
  label.htmlFor = control.id;
  const wrapper = el("div", "field", label, control);
  if (hint) {
    const help = text("p", hint, "hint");
    help.id = `${control.id}-hint`;
    control.setAttribute("aria-describedby", help.id);
    wrapper.append(help);
  }
  return wrapper;
}
export function input(type: string, name: string, value = ""): HTMLInputElement {
  const control = el("input");
  control.type = type;
  control.name = name;
  control.value = value;
  return control;
}
export function passwordField(control: HTMLInputElement): HTMLDivElement {
  const wrapper = field("password", control, "passwordHint");
  control.spellcheck = false;
  control.autocapitalize = "none";
  const reveal = el("button", "password-reveal");
  reveal.type = "button";
  reveal.setAttribute("aria-controls", control.id);
  const update = (): void => {
    const visible = control.type === "text";
    const label = message(visible ? "hidePassword" : "showPassword");
    reveal.setAttribute("aria-label", label);
    reveal.title = label;
    reveal.replaceChildren(icon(visible ? "eye-off" : "eye"));
  };
  bind(reveal, update);
  reveal.addEventListener("click", () => {
    const { selectionStart, selectionEnd, selectionDirection } = control;
    control.type = control.type === "password" ? "text" : "password";
    if (selectionStart !== null && selectionEnd !== null)
      control.setSelectionRange(selectionStart, selectionEnd, selectionDirection ?? "none");
    update();
  });
  const group = el("div", "password-control");
  control.replaceWith(group);
  group.append(control, reveal);
  return wrapper;
}
export function notice(key: MessageKey, danger = false): HTMLDivElement {
  const node = text("div", key, danger ? "notice error" : "notice");
  node.setAttribute("role", danger ? "alert" : "status");
  return node;
}
export function focusHeading(root: HTMLElement): void {
  const heading = root.querySelector<HTMLElement>("h1");
  if (heading) {
    heading.tabIndex = -1;
    heading.focus();
  }
}

export function lockForm(form: HTMLFormElement): () => void {
  const controls = [
    ...form.querySelectorAll<
      HTMLInputElement | HTMLButtonElement | HTMLSelectElement | HTMLTextAreaElement
    >("input, button, select, textarea"),
  ].map((control) => ({ control, disabled: control.disabled }));
  for (const { control } of controls) control.disabled = true;
  form.setAttribute("aria-busy", "true");
  return () => {
    for (const { control, disabled } of controls) control.disabled = disabled;
    form.removeAttribute("aria-busy");
  };
}

export function focusStatus(host: HTMLElement, key: MessageKey): void {
  const status = notice(key);
  status.tabIndex = -1;
  host.replaceChildren(status);
  status.focus();
}

// Lucide panel, theme and password icons, ISC license. Exact upstream geometry:
// https://lucide.dev/icons/{panel-left-close,panel-left-open,moon,sun,eye,eye-off}
export function icon(
  kind:
    | "panel-close"
    | "panel-open"
    | "moon"
    | "sun"
    | "eye"
    | "eye-off"
    | "home"
    | "path"
    | "activity"
    | "arrow"
    | "check"
    | "clock"
    | "edit"
    | "calendar"
    | "people"
    | "review",
): SVGSVGElement {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  for (const [key, value] of Object.entries({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "1.8",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "aria-hidden": "true",
    focusable: "false",
  }))
    svg.setAttribute(key, value);
  svg.classList.add("icon");
  const path = (d: string): void => {
    const p = document.createElementNS(ns, "path");
    p.setAttribute("d", d);
    svg.append(p);
  };
  if (kind === "panel-close" || kind === "panel-open") {
    svg.setAttribute("stroke-width", "2");
    const rect = document.createElementNS(ns, "rect");
    for (const [key, value] of Object.entries({
      width: "18",
      height: "18",
      x: "3",
      y: "3",
      rx: "2",
    }))
      rect.setAttribute(key, value);
    svg.append(rect);
    path("M9 3v18");
    path(kind === "panel-close" ? "m16 15-3-3 3-3" : "m14 9 3 3-3 3");
  } else if (kind === "eye" || kind === "eye-off") {
    svg.setAttribute("stroke-width", "2");
    if (kind === "eye") {
      path(
        "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      );
      const circle = document.createElementNS(ns, "circle");
      circle.setAttribute("cx", "12");
      circle.setAttribute("cy", "12");
      circle.setAttribute("r", "3");
      svg.append(circle);
    } else {
      for (const d of [
        "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
        "M14.084 14.158a3 3 0 0 1-4.242-4.242",
        "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
        "m2 2 20 20",
      ])
        path(d);
    }
  } else if (kind === "moon" || kind === "sun") {
    svg.setAttribute("stroke-width", "2");
    if (kind === "moon") {
      path(
        "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
      );
    } else {
      const circle = document.createElementNS(ns, "circle");
      circle.setAttribute("cx", "12");
      circle.setAttribute("cy", "12");
      circle.setAttribute("r", "4");
      svg.append(circle);
      for (const d of [
        "M12 2v2",
        "M12 20v2",
        "m4.93 4.93 1.41 1.41",
        "m17.66 17.66 1.41 1.41",
        "M2 12h2",
        "M20 12h2",
        "m6.34 17.66-1.41 1.41",
        "m19.07 4.93-1.41 1.41",
      ])
        path(d);
    }
  } else {
    const paths = {
      home: "m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9",
      path: "m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2ZM9 3v16M15 5v16",
      activity: "M5 20V13M12 20V7M19 20V3",
      arrow: "M4 12h16m-7-7 7 7-7 7",
      check: "m5 12 4 4 10-10",
      clock: "M12 7v5l3 2M21 12a9 9 0 1 1-9-9 9 9 0 0 1 9 9",
      edit: "m16 3 5 5-12 12-6 1 1-6ZM13 6l5 5",
      calendar: "M4 5h16v16H4ZM4 9h16M8 3v4M16 3v4M8 13h1M15 13h1M8 17h1M15 17h1",
      people:
        "M15 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0M2 21v-2a7 7 0 0 1 14 0v2ZM18 4a4 4 0 0 1 0 8M18 15a5 5 0 0 1 4 5v1",
      review: "M5 3h14v18H5ZM9 7h6M9 11h6M9 15h4",
    };
    path(paths[kind]);
  }
  return svg;
}
