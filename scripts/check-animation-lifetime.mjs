import assert from "node:assert/strict";
import { AnimationLifetime } from "../src/components/art/animation-lifetime.ts";

// Exercise resource ownership without a browser or animation implementation.
const previousWindow = globalThis.window;
globalThis.window = new EventTarget();
try {
  const lifetime = new AnimationLifetime();
  const target = new EventTarget();
  let events = 0, disconnected = 0, cleanups = 0;
  target.addEventListener("change", () => events++, { signal: lifetime.signal });
  lifetime.observe({ disconnect: () => disconnected++ });
  lifetime.add(() => cleanups++);

  const cached = new Event("pagehide"); cached.persisted = true;
  window.dispatchEvent(cached);
  assert.equal(lifetime.signal.aborted, false, "Back/forward cache must preserve resources");
  target.dispatchEvent(new Event("change"));
  assert.equal(events, 1);

  const unloaded = new Event("pagehide"); unloaded.persisted = false;
  window.dispatchEvent(unloaded);
  assert.equal(lifetime.signal.aborted, true);
  target.dispatchEvent(new Event("change"));
  assert.equal(events, 1, "Disposal must remove signal-owned listeners");
  lifetime.dispose();
  assert.equal(disconnected, 1);
  assert.equal(cleanups, 1, "Repeated disposal must be harmless");
  lifetime.add(() => cleanups++);
  assert.equal(cleanups, 2, "Late resources must be released immediately");

  const broken = new AnimationLifetime();
  const failure = new Error("Test cleanup failure");
  broken.add(() => { throw failure; });
  broken.add(() => cleanups++);
  assert.throws(() => broken.dispose(), error => error instanceof AggregateError && error.errors[0] === failure);
  assert.equal(cleanups, 3, "One failed cleanup must not retain unrelated resources");
  broken.dispose();
  console.log("Animation lifetime checks passed");
} finally {
  if (previousWindow === undefined) delete globalThis.window;
  else globalThis.window = previousWindow;
}
