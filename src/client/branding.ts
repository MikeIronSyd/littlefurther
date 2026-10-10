export const APP_NAME = "LittleFurther";

export function createBrand(): HTMLDivElement {
  const namespace = "http://www.w3.org/2000/svg";
  const mark = document.createElementNS(namespace, "svg");
  mark.classList.add("brand-mark");
  for (const [name, value] of Object.entries({
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "4",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "aria-hidden": "true",
    focusable: "false",
  }))
    mark.setAttribute(name, value);
  const path = document.createElementNS(namespace, "path");
  path.setAttribute("d", "M5 7V25H17V7H27M17 15H25");
  mark.append(path);

  const name = document.createElement("span");
  name.className = "brand-name";
  // The selected name is unchanged in both locales; allow only this word boundary.
  name.append(APP_NAME.slice(0, 6), document.createElement("wbr"), APP_NAME.slice(6));
  const brand = document.createElement("div");
  brand.className = "brand";
  brand.append(mark, name);
  return brand;
}
