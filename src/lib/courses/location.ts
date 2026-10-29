"use client";
import { useSyncExternalStore } from "react";
import { courseById } from "./content";
const signal = "deutsch-garden:course-location";
function subscribe(f: () => void) {
  window.addEventListener("hashchange", f);
  window.addEventListener("popstate", f);
  window.addEventListener(signal, f);
  return () => {
    window.removeEventListener("hashchange", f);
    window.removeEventListener("popstate", f);
    window.removeEventListener(signal, f);
  };
}
function get() {
  const id = window.location.hash.slice(1).replace(/^ders-/, "");
  return courseById(id) ? id : "";
}
export const useCourseLocation = () =>
  useSyncExternalStore(subscribe, get, () => "");
export function setCourseLocation(id: string | null) {
  const url = new URL(window.location.href);
  url.hash = id ? "ders-" + id : "";
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event(signal));
}
