import { useEffect } from "react";

export function useInitServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").catch((err) => {
        console.error("Service Worker registration failed:", err);
      });
    }
  }, []);
}
