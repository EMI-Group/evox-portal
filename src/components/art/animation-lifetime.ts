// Keep observers, listeners and render resources tied to their document.
// A bfcache entry keeps its state; normal navigation releases every resource.
export class AnimationLifetime {
  private controller = new AbortController();
  private cleanups: (() => void)[] = [];
  get signal() { return this.controller.signal; }

  constructor() {
    window.addEventListener("pagehide", (event) => {
      if (!event.persisted) this.dispose();
    }, { signal: this.signal });
  }

  observe<T extends { disconnect(): void }>(observer: T): T {
    this.add(() => observer.disconnect());
    return observer;
  }

  add(cleanup: () => void) {
    if (this.signal.aborted) cleanup();
    else this.cleanups.push(cleanup);
  }

  dispose() {
    if (this.signal.aborted) return;
    this.controller.abort();
    const errors: unknown[] = [];
    for (const cleanup of this.cleanups.splice(0)) {
      try { cleanup(); } catch (error) { errors.push(error); }
    }
    // A failed cleanup must not prevent unrelated observers or frames releasing.
    if (errors.length) throw new AggregateError(errors, "Animation resource cleanup failed");
  }
}
