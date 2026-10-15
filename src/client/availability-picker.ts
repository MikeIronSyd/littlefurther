import { LIMITS } from "../shared/contracts.js";
import { bind, dateLabel, type MessageKey, message } from "./i18n.js";
import { button, el, field, fieldErrors, icon, input, text } from "./ui.js";

function validDate(value: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    value >= "2000-01-01" &&
    value <= "2100-12-31" &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}

export function availabilityPicker(initialDates: string[]): {
  element: HTMLFieldSetElement;
  picker: HTMLInputElement;
  values: () => string[];
  validate: () => boolean;
  showError: (key: MessageKey, values?: Record<string, string | number>) => void;
  clearError: () => void;
} {
  let dates = [...new Set(initialDates)].sort();
  let feedback: { key: MessageKey; date: string } | null = null;
  const element = el("fieldset", "availability-picker", text("legend", "availability"));
  const picker = input("date", "availabilityDate");
  picker.min = "2000-01-01";
  picker.max = "2100-12-31";
  const pickerField = field("availabilityChoose", picker);
  const hint = text("p", "availabilityHint", "hint");
  hint.id = `${picker.id}-hint`;
  const count = el("p", "hint availability-count");
  count.id = `${picker.id}-count`;
  picker.setAttribute("aria-describedby", `${hint.id} ${count.id}`);
  const status = el("p", "hint availability-status");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.setAttribute("aria-atomic", "true");
  const list = el("ul", "availability-selected");
  const rows = new Map<string, HTMLLIElement>();
  const empty = text("p", "availabilityEmpty", "hint");
  const pending = text("p", "availabilityPending", "hint");
  const limit = text("p", "availabilityTooMany", "hint", { max: LIMITS.availability });
  const open = el("button", "button subtle availability-open", icon("calendar"));
  open.type = "button";
  bind(open, () => {
    open.setAttribute("aria-label", message("availabilityOpen"));
    open.title = message("availabilityOpen");
  });
  open.addEventListener("click", () => {
    picker.focus();
    try {
      if (typeof picker.showPicker === "function") picker.showPicker();
    } catch {
      // Native input remains usable when a browser cannot open its picker here.
    }
  });
  const add = button("availabilityAdd", () => {
    if (!picker.value) {
      feedback = null;
      updateStatus();
      errors.show("availabilityPickRequired");
      picker.focus();
      return;
    }
    if (!validDate(picker.value)) {
      feedback = null;
      updateStatus();
      errors.show("availabilityInvalid", { dates: picker.value });
      picker.focus();
      return;
    }
    if (dates.includes(picker.value)) {
      errors.clear();
      feedback = { key: "availabilityDuplicate", date: picker.value };
      updateStatus();
      return;
    }
    if (dates.length >= LIMITS.availability) {
      errors.show("availabilityTooMany", { max: LIMITS.availability });
      picker.focus();
      return;
    }
    dates = [...dates, picker.value].sort();
    feedback = { key: "availabilityAdded", date: picker.value };
    errors.clear();
    renderDates();
    changed();
  });
  add.classList.add("availability-add");
  add.setAttribute("aria-describedby", count.id);
  const controls = el("div", "availability-controls", pickerField, open, add);
  element.append(controls, hint, list, empty, pending, count, limit, status);
  const errors = fieldErrors(picker, element);
  const label = (date: string): string => (validDate(date) ? dateLabel(date) : date);
  const updateStatus = (): void => {
    status.textContent = feedback ? message(feedback.key, { date: label(feedback.date) }) : "";
  };
  const changed = (): void => {
    element.dispatchEvent(new Event("input", { bubbles: true }));
  };
  const updateEmptyState = (): void => {
    const hasPendingDate = validDate(picker.value);
    empty.hidden = dates.length > 0 || hasPendingDate;
    pending.hidden = dates.length > 0 || !hasPendingDate;
  };
  const renderDates = (): void => {
    const selected = new Set(dates);
    for (const [date, row] of rows) {
      if (!selected.has(date)) {
        row.remove();
        rows.delete(date);
      }
    }
    let nextRow = list.firstElementChild;
    for (const date of dates) {
      let row = rows.get(date);
      if (!row) {
        const value = el("span", "availability-date-label");
        const remove = button(
          "remove",
          () => {
            const index = dates.indexOf(date);
            dates = dates.filter((item) => item !== date);
            feedback = { key: "availabilityRemoved", date };
            errors.clear();
            renderDates();
            changed();
            const remaining = list.querySelectorAll<HTMLButtonElement>("button");
            const next = remaining[index] ?? remaining[index - 1];
            (next ?? picker).focus();
          },
          "button subtle",
        );
        bind(remove, () => {
          remove.textContent = message("remove");
          remove.setAttribute("aria-label", message("availabilityRemove", { date: label(date) }));
          value.textContent = label(date);
        });
        row = el("li", "availability-date", value, remove);
        rows.set(date, row);
      }
      if (row === nextRow) nextRow = row.nextElementSibling;
      else list.insertBefore(row, nextRow);
    }
    updateEmptyState();
    list.hidden = dates.length === 0;
    const addFocused = document.activeElement === add;
    add.disabled = dates.length >= LIMITS.availability;
    if (add.disabled && addFocused) picker.focus();
    limit.hidden = dates.length < LIMITS.availability;
    count.textContent = message("availabilityCount", {
      count: dates.length,
      max: LIMITS.availability,
    });
    updateStatus();
  };
  bind(count, () => {
    count.textContent = message("availabilityCount", {
      count: dates.length,
      max: LIMITS.availability,
    });
  });
  bind(status, updateStatus);
  picker.addEventListener("input", () => {
    feedback = null;
    updateEmptyState();
    updateStatus();
  });
  picker.addEventListener("change", updateEmptyState);
  renderDates();
  return {
    element,
    picker,
    values: () => [...dates],
    validate: () => {
      const invalid = dates.filter((date) => !validDate(date));
      if (!dates.length) errors.show("availabilityRequired");
      else if (invalid.length) errors.show("availabilityInvalid", { dates: invalid.join(", ") });
      else if (dates.length > LIMITS.availability)
        errors.show("availabilityTooMany", { max: LIMITS.availability });
      else {
        errors.clear();
        return true;
      }
      return false;
    },
    showError: errors.show,
    clearError: errors.clear,
  };
}
