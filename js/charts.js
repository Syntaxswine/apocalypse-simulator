// Canvas charts, drawn in the same register as the rest of the page: hairlines,
// tabular labels, no gradients, no animation. The point of every one of these is
// to show a SPREAD — a single line through the middle of an ensemble is the one
// thing a Monte Carlo must never be reduced to, because no world experiences the
// median.

const CSS = (n, fb) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  return v || fb;
};

function setup(canvas, hCss) {
  const dpr = Math.min(3, window.devicePixelRatio || 1);
  const wCss = canvas.parentElement.clientWidth || 640;
  canvas.style.width = wCss + 'px';
  canvas.style.height = hCss + 'px';
  canvas.width = Math.round(wCss * dpr);
  canvas.height = Math.round(hCss * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, wCss, hCss);
  ctx.font = '10px ui-monospace, Consolas, monospace';
  ctx.textBaseline = 'middle';
  return { ctx, w: wCss, h: hCss };
}

function frame(ctx, w, h, pad) {
  ctx.strokeStyle = CSS('--rule-2', '#ded8c6');
  ctx.lineWidth = 1;
  ctx.strokeRect(pad.l + 0.5, pad.t + 0.5, w - pad.l - pad.r - 1, h - pad.t - pad.b - 1);
}

// ---------------------------------------------------------------------------
// Survival curve: P(civilisation still standing) against year.
// ---------------------------------------------------------------------------

export function drawSurvival(canvas, res, cfg, marks) {
  const pad = { l: 44, r: 12, t: 10, b: 22 };
  const { ctx, w, h } = setup(canvas, 190);
  const x0 = pad.l, x1 = w - pad.r, y0 = pad.t, y1 = h - pad.b;
  const X = (i) => x0 + (i / Math.max(1, cfg.horizon - 1)) * (x1 - x0);

  // The y axis is deliberately not 0..1. Almost all the action in a survival
  // curve for this question lives in the top few percent, and a full-range axis
  // renders it as a flat line at the top — which is technically true and
  // completely uninformative.
  const lo = Math.min(0.9, Math.floor(Math.min(...res.survival) * 20) / 20);
  const Y = (p) => y1 - ((p - lo) / (1 - lo)) * (y1 - y0);

  const ink = CSS('--ink', '#2e2b25');
  const dim = CSS('--dim', '#837c6c');
  const rule = CSS('--rule-2', '#ded8c6');

  // gridlines
  ctx.strokeStyle = rule;
  ctx.fillStyle = dim;
  ctx.textAlign = 'right';
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const p = lo + (i / steps) * (1 - lo);
    const y = Y(p);
    ctx.beginPath(); ctx.moveTo(x0, y + 0.5); ctx.lineTo(x1, y + 0.5); ctx.stroke();
    ctx.fillText((p * 100).toFixed(p > 0.99 ? 1 : 0) + '%', x0 - 5, y);
  }

  // decade ticks
  ctx.textAlign = 'center';
  const decade = cfg.horizon > 200 ? 50 : cfg.horizon > 120 ? 25 : 20;
  for (let y = 0; y < cfg.horizon; y += decade) {
    const px = X(y);
    ctx.strokeStyle = rule;
    ctx.beginPath(); ctx.moveTo(px + 0.5, y0); ctx.lineTo(px + 0.5, y1); ctx.stroke();
    ctx.fillStyle = dim;
    ctx.fillText(String(cfg.startYear + y), px, y1 + 11);
  }

  // published reference points, so the model's own answer is never shown
  // without the numbers it should be checked against
  for (const m of marks || []) {
    const yy = Y(1 - m.p);
    if (yy < y0 || yy > y1) continue;
    ctx.strokeStyle = m.color;
    ctx.setLineDash([2, 3]);
    ctx.beginPath(); ctx.moveTo(x0, yy + 0.5); ctx.lineTo(x1, yy + 0.5); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = m.color;
    ctx.textAlign = 'left';
    ctx.fillText(m.label, x0 + 4, yy - 6);
  }

  // the curve
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let y = 0; y < cfg.horizon; y++) {
    const px = X(y), py = Y(res.survival[y]);
    y === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.lineWidth = 1;
  frame(ctx, w, h, pad);
}

// ---------------------------------------------------------------------------
// Population fan: the ensemble's 5th–95th percentile envelope over time.
// ---------------------------------------------------------------------------

export function drawFan(canvas, res, cfg) {
  const pad = { l: 44, r: 12, t: 10, b: 22 };
  const { ctx, w, h } = setup(canvas, 210);
  const x0 = pad.l, x1 = w - pad.r, y0 = pad.t, y1 = h - pad.b;
  const H = cfg.horizon;
  const X = (i) => x0 + (i / Math.max(1, H - 1)) * (x1 - x0);

  const top = Math.max(cfg.popPeak, ...res.fan.p95) * 1.05;
  const Y = (v) => y1 - (v / top) * (y1 - y0);

  const dim = CSS('--dim', '#837c6c');
  const rule = CSS('--rule-2', '#ded8c6');
  const ink = CSS('--ink', '#2e2b25');

  ctx.strokeStyle = rule; ctx.fillStyle = dim; ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const v = (i / 4) * top, y = Y(v);
    ctx.beginPath(); ctx.moveTo(x0, y + 0.5); ctx.lineTo(x1, y + 0.5); ctx.stroke();
    ctx.fillText(v.toFixed(1), x0 - 5, y);
  }
  ctx.textAlign = 'center';
  const decade = H > 200 ? 50 : H > 120 ? 25 : 20;
  for (let y = 0; y < H; y += decade) {
    const px = X(y);
    ctx.strokeStyle = rule;
    ctx.beginPath(); ctx.moveTo(px + 0.5, y0); ctx.lineTo(px + 0.5, y1); ctx.stroke();
    ctx.fillStyle = dim;
    ctx.fillText(String(cfg.startYear + y), px, y1 + 11);
  }

  const band = (lo, hi, fill) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    for (let i = 0; i < H; i++) { const px = X(i), py = Y(hi[i]); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    for (let i = H - 1; i >= 0; i--) ctx.lineTo(X(i), Y(lo[i]));
    ctx.closePath(); ctx.fill();
  };
  band(res.fan.p05, res.fan.p95, '#41607820');
  band(res.fan.p25, res.fan.p75, '#41607838');

  ctx.strokeStyle = ink; ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i < H; i++) { const px = X(i), py = Y(res.fan.p50[i]); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
  ctx.stroke();
  ctx.lineWidth = 1;
  frame(ctx, w, h, pad);
}

// ---------------------------------------------------------------------------
// One run's trace: population, industrial capacity, and lost sunlight.
// ---------------------------------------------------------------------------

export function drawRun(canvas, run, cfg) {
  const pad = { l: 44, r: 34, t: 10, b: 22 };
  const { ctx, w, h } = setup(canvas, 168);
  const x0 = pad.l, x1 = w - pad.r, y0 = pad.t, y1 = h - pad.b;
  const H = cfg.horizon;
  const X = (i) => x0 + (i / Math.max(1, H - 1)) * (x1 - x0);
  const top = Math.max(cfg.popPeak, ...run.trace.map((t) => t.pop)) * 1.05;

  const dim = CSS('--dim', '#837c6c');
  const rule = CSS('--rule-2', '#ded8c6');
  const ink = CSS('--ink', '#2e2b25');
  const red = CSS('--red', '#a3402c');
  const blue = CSS('--blue', '#416078');

  ctx.strokeStyle = rule; ctx.fillStyle = dim; ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const v = (i / 4) * top, y = y1 - (v / top) * (y1 - y0);
    ctx.beginPath(); ctx.moveTo(x0, y + 0.5); ctx.lineTo(x1, y + 0.5); ctx.stroke();
    ctx.fillText(v.toFixed(1), x0 - 5, y);
  }
  ctx.textAlign = 'left'; ctx.fillStyle = dim;
  ctx.fillText('0%', x1 + 4, y1);
  ctx.fillText('100%', x1 + 4, y0);

  ctx.textAlign = 'center';
  const decade = H > 200 ? 50 : H > 120 ? 25 : 20;
  for (let y = 0; y < H; y += decade) {
    const px = X(y);
    ctx.strokeStyle = rule;
    ctx.beginPath(); ctx.moveTo(px + 0.5, y0); ctx.lineTo(px + 0.5, y1); ctx.stroke();
    ctx.fillStyle = dim;
    ctx.fillText(String(cfg.startYear + y), px, y1 + 11);
  }

  const line = (get, color, dash, width) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width || 1;
    ctx.setLineDash(dash || []);
    ctx.beginPath();
    run.trace.forEach((t, i) => {
      const px = X(i), py = get(t);
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    });
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineWidth = 1;
  };

  // Lost sunlight first, as a filled band — it is the cause, and it belongs
  // underneath the two curves it drags down.
  ctx.fillStyle = '#8a6a4e26';
  ctx.beginPath();
  ctx.moveTo(X(0), y1);
  run.trace.forEach((t, i) => ctx.lineTo(X(i), y1 - t.sunLoss * (y1 - y0)));
  ctx.lineTo(X(run.trace.length - 1), y1);
  ctx.closePath(); ctx.fill();

  line((t) => y1 - (t.industry) * (y1 - y0), blue, [3, 2]);
  line((t) => y1 - (t.pop / top) * (y1 - y0), ink, [], 1.6);

  if (!run.survived && run.endYear != null) {
    const px = X(run.endYear - cfg.startYear);
    ctx.strokeStyle = red;
    ctx.beginPath(); ctx.moveTo(px + 0.5, y0); ctx.lineTo(px + 0.5, y1); ctx.stroke();
  }
  frame(ctx, w, h, pad);
}
