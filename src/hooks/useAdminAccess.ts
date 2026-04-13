import { useState, useEffect, useCallback } from "react";

/**
 * Returns true when the user has "unlocked" admin access
 * by pressing the 'A' key 9 times within 3 seconds.
 */
export const useAdminAccess = () => {
  const [unlocked, setUnlocked] = useState(() => {
    return sessionStorage.getItem("admin_unlocked") === "1";
  });

  useEffect(() => {
    const times: number[] = [];
    const handler = (e: KeyboardEvent) => {
      // Ignore if typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key.toLowerCase() === "a") {
        times.push(Date.now());
        while (times.length > 9) times.shift();
        if (times.length === 9 && times[8] - times[0] < 3000) {
          times.length = 0;
          sessionStorage.setItem("admin_unlocked", "1");
          setUnlocked(true);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const lock = useCallback(() => {
    sessionStorage.removeItem("admin_unlocked");
    setUnlocked(false);
  }, []);

  return { unlocked, lock };
};
