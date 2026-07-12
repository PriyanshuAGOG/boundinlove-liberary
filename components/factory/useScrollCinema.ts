"use client";

import { useEffect } from "react";

// Turns a stack of sections into a single continuous "scroll film".
//
// - Each element marked [data-scene] fades / lifts / scales into place as it
//   enters, then holds a clean final state (never a permanently animating page).
// - A --scene-progress custom property (0 at entry, 1 when centred) is written
//   per scene so CSS can drive parallax and scrubbed reveals off scroll.
// - A --reveal (0..1) property on the shell tracks overall scroll depth for the
//   progress rail and background drift.
// - Everything is disabled under prefers-reduced-motion: scenes simply show.
export function useScrollCinema(rootRef: React.RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !active) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scenes = Array.from(root.querySelectorAll<HTMLElement>("[data-scene]"));

    if (reduce) {
      scenes.forEach((scene) => scene.classList.add("is-inview"));
      root.style.setProperty("--reveal", "1");
      return;
    }

    // Reveal scenes once, the first time they cross into view.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -12% 0px" },
    );
    scenes.forEach((scene) => observer.observe(scene));

    let frame = 0;
    const update = () => {
      frame = 0;
      const viewport = window.innerHeight || 1;

      const doc = document.documentElement;
      const max = doc.scrollHeight - viewport;
      root.style.setProperty("--reveal", max > 0 ? String(Math.min(1, Math.max(0, window.scrollY / max))) : "1");

      for (const scene of scenes) {
        const rect = scene.getBoundingClientRect();
        // 0 when the scene's top hits the bottom of the viewport, 1 when it is
        // centred — a scrubbable value for parallax and scaling.
        const raw = 1 - (rect.top + rect.height * 0.25) / (viewport + rect.height * 0.25);
        scene.style.setProperty("--scene-progress", String(Math.min(1, Math.max(0, raw))));
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [rootRef, active]);
}
