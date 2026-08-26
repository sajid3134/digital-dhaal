"use client";

import { useEffect } from "react";

export default function RegisterSW() {
  useEffect(() => {
    // Only run the PWA service worker in production. In dev it would cache the
    // app shell (including any transient error page) and replay it on reload,
    // which is confusing while iterating. Also proactively unregister any SW
    // left over from a previous dev session.
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    } else {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => regs.forEach((r) => r.unregister()))
        .catch(() => {});
    }
  }, []);

  return null;
}
