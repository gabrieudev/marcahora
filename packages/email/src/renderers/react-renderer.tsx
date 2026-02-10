import { type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

export function reactRenderer(element: ReactElement): string {
  return "<!doctype html>" + renderToStaticMarkup(element);
}
