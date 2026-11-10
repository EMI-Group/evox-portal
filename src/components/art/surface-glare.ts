import type { AnimationLifetime } from "./animation-lifetime";

// One delegated listener serves glass and solid surfaces. Pointer events share
// one frame; geometry is read before either custom property is written.
export function mountSurfaceGlare(lifetime: AnimationLifetime) {
  if (lifetime.signal.aborted) return;
  const motion = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  const transparency = matchMedia("(prefers-reduced-transparency: reduce)");
  let frame = 0, x = 0, y = 0;
  let target: HTMLElement | null = null;
  const cancel = () => { cancelAnimationFrame(frame); frame = 0; target = null; };
  const enabled = () => motion.matches && !lifetime.signal.aborted;
  const hidden = (element: HTMLElement) => transparency.matches && element.classList.contains("glass");
  document.addEventListener("pointermove", event => {
    if (!enabled() || event.pointerType !== "mouse" || !(event.target instanceof Element)) return;
    const host = event.target.closest<HTMLElement>('.glass:not([data-glass="frosted"]), .surface-card, .surface-button, .site-header');
    target = host?.classList.contains("site-header") ? host.querySelector<HTMLElement>(":scope > .glass") : host;
    if (!target || hidden(target)) return;
    x = event.clientX; y = event.clientY;
    frame ||= requestAnimationFrame(() => {
      frame = 0;
      if (!target?.isConnected || !enabled() || hidden(target)) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--lg-x", `${x - rect.left}px`);
      target.style.setProperty("--lg-y", `${y - rect.top}px`);
    });
  }, { passive: true, signal: lifetime.signal });
  motion.addEventListener("change", cancel, { signal: lifetime.signal });
  transparency.addEventListener("change", cancel, { signal: lifetime.signal });
  lifetime.add(cancel);
}
