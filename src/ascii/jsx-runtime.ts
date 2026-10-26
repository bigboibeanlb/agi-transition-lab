import { jsx as render, Fragment } from "react/jsx-runtime";
import type { JSX, ReactNode, InputHTMLAttributes, ChangeEvent } from "react";
import { ascii } from "./text";
export { Fragment };
export type { JSX } from "react";
function textNodes(value: unknown): unknown {
  return typeof value === "string"
    ? ascii(value)
    : Array.isArray(value)
      ? value.map(textNodes)
      : value;
}
function Checkbox(props: InputHTMLAttributes<HTMLInputElement>) {
  return render("button", {
    type: "button",
    role: props.role || "checkbox",
    "aria-checked": !!props.checked,
    "aria-label": props["aria-label"],
    disabled: props.disabled,
    className: "ascii-check",
    onClick: () =>
      props.onChange?.({
        target: { checked: !props.checked },
      } as ChangeEvent<HTMLInputElement>),
    children: render("span", {
      "aria-hidden": true,
      children: props.checked ? "[x]" : "[ ]",
    }),
  });
}
/** A single display boundary also covers imported hypotheses and future research. */
export function jsx(
  type: unknown,
  props: Record<string, unknown> | null,
  key?: string,
): JSX.Element {
  if (typeof type !== "string") return render(type as never, props, key);
  const next = { ...props };
  next.children = textNodes(next.children);
  const cls = String(next.className || "");
  if (cls.includes("progress-segment"))
    next.children = cls.includes("complete") ? "[#]" : "[.]";
  if (cls === "verification-meter") next.children = "[............]";
  if (cls === "green-dot" || cls === "green-dot pulse") next.children = "*";
  if (cls === "unchecked-box") next.children = "[?]";
  for (const field of ["aria-label", "title", "placeholder"])
    if (typeof next[field] === "string")
      next[field] = ascii(next[field] as string);
  if (type === "input" && next.type === "checkbox")
    return render(Checkbox, next, key);
  if (type === "input" && next.type === "number") {
    next.type = "text";
    next.inputMode = "numeric";
    next.role = "spinbutton";
  }
  if (type === "button") {
    const label = next["aria-label"];
    next.children = render(Fragment, {
      children: [
        render("span", { "aria-hidden": true, children: "[ " }),
        next.children as ReactNode,
        render("span", { "aria-hidden": true, children: " ]" }),
      ],
    });
    if (label) next["aria-label"] = label;
  }
  return render(type as never, next, key);
}
export const jsxs = jsx;
