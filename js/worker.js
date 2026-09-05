// The ensemble runs here, off the main thread.
//
// Not for speed — forty thousand hundred-year worlds take about four seconds,
// which a main thread can technically survive. It is off the main thread because
// a chunked requestAnimationFrame loop is throttled to a crawl whenever the tab
// is not visible, which turns "run forty thousand worlds" into a progress bar
// that stops at 95% and sits there. A worker is not frame-locked and does not
// care whether anybody is looking.

import { runOnce, makeEnsemble, seedFor } from './model.js';

self.onmessage = (e) => {
  const { hazards, cfg, n, base } = e.data;
  const ens = makeEnsemble(cfg, n);
  const runCfg = { ...cfg, keepTrace: false };
  const stride = Math.max(1, Math.round(n / 50));

  for (let i = 0; i < n; i++) {
    ens.push(runOnce(hazards, runCfg, seedFor(base, i), ens.slot()));
    if (i % stride === 0) self.postMessage({ type: 'progress', done: i, n });
  }

  self.postMessage({ type: 'done', result: ens.finish() });
};
