// Turning one run into a readable history.
//
// Deliberately flat prose. A simulator that narrates catastrophe in an exciting
// voice is training the reader to feel something about numbers they should be
// weighing instead, and the numbers here are quite bad enough unassisted.

const fmtPeople = (bn) => {
  const n = bn * 1e9;
  if (n >= 1e9) return (n / 1e9).toFixed(n >= 1e10 ? 1 : 2) + ' billion';
  if (n >= 1e6) return (n / 1e6).toFixed(0) + ' million';
  if (n >= 1e3) return (n / 1e3).toFixed(0) + ' thousand';
  return Math.round(n).toLocaleString();
};

const pct = (x, d = 1) => (x * 100).toFixed(d) + '%';

export function narrateEvent(ev, hz) {
  const dead = fmtPeople(ev.killedAbs);
  const bits = [];
  bits.push(`${dead} dead within the decade (${pct(ev.killedFraction)} of everyone alive).`);
  if (ev.industryAfter < 0.97) bits.push(`Industrial capacity falls to ${pct(ev.industryAfter, 0)}.`);
  bits.push(`${fmtPeople(ev.popAfter)} remain.`);
  return {
    head: `${hz ? hz.name : ev.hazard} — ${ev.tier}`,
    detail: bits.join(' '),
  };
}

// The one-line summary that goes above the timeline.
export function summarise(run, cfg, hazIndex) {
  if (!run.survived) {
    const culprit = hazIndex[run.ending];
    const yrs = run.endYear - cfg.startYear;
    return `This world ends in ${run.endYear}, ${yrs} year${yrs === 1 ? '' : 's'} from now. ` +
      `The proximate cause is ${culprit ? culprit.name.toLowerCase() : run.ending}. ` +
      `${fmtPeople(run.deaths)} people died along the way.`;
  }
  const big = run.events.filter((e) => e.killedFraction > 0.01);
  const end = cfg.startYear + cfg.horizon;
  if (!big.length) {
    return `This world reaches ${end} without a single event killing even one percent of humanity. ` +
      `It holds ${fmtPeople(run.pop)} people. This is the most common outcome, and it is worth ` +
      `sitting with: the modal future is not an ending.`;
  }
  const worst = big.reduce((a, b) => (b.killedFraction > a.killedFraction ? b : a));
  const wh = hazIndex[worst.hazard];
  return `This world survives to ${end} with ${fmtPeople(run.pop)} people — against ` +
    `${fmtPeople(run.popBaseline)} in a world where nothing went wrong. ` +
    `Its worst year was ${worst.year}: ${wh ? wh.name.toLowerCase() : worst.hazard}, ` +
    `${pct(worst.killedFraction)} of humanity. ` +
    `${big.length > 1 ? `${big.length} events crossed the one-percent line in all. ` : ''}` +
    `Industrial capacity finished at ${pct(run.industry, 0)}.`;
}

// The line under the ensemble verdict — the rule of thumb, which is the thing
// worth carrying away from a simulation like this.
export function ruleOfThumb(res, cfg, hazIndex) {
  const out = [];
  const century = Math.min(cfg.horizon, 75) / cfg.horizon;
  const pAny = res.pScratch;
  const top = res.firstCatastrophe[0];
  const topEnd = res.byEnding[0];

  out.push(
    `Across ${res.n.toLocaleString()} simulated worlds, ${pct(pAny, pAny < 0.02 ? 2 : 0)} suffered at ` +
    `least one event killing more than a tenth of humanity, ${pct(res.pCollapse, res.pCollapse < 0.02 ? 2 : 0)} ` +
    `lost more than half, and ${pct(res.pExtinct, 2)} ended.`
  );

  if (top) {
    const h = hazIndex[top[0]];
    out.push(
      `The most likely thing to hurt you is ${h ? h.name.toLowerCase() : top[0]} — it caused the first ` +
      `major catastrophe in ${pct(top[1] / res.n, 1)} of runs.`
    );
  }
  if (topEnd && res.extinct > 0) {
    const h = hazIndex[topEnd[0]];
    const share = topEnd[1] / res.extinct;
    out.push(
      `But the most likely thing to END you is ${h ? h.name.toLowerCase() : topEnd[0]}, which accounts for ` +
      `${pct(share, 0)} of the runs that ended. ` +
      (top && topEnd[0] !== top[0]
        ? `Those are different hazards, and that gap is the single most useful thing this model has to say: ` +
          `the catastrophes you are most likely to live through are not the ones that finish it.`
        : `Here they are the same hazard, which is unusual — at most settings they are not.`)
    );
  } else if (res.extinct === 0) {
    out.push(
      `No run ended. At these settings the model cannot find humanity's death; that is a statement about ` +
      `the settings and about ${res.n.toLocaleString()} being a small number against a probability this ` +
      `low, not a reassurance.`
    );
  }

  out.push(
    `Median worst drawdown: ${pct(res.medianDrawdown, 1)} of the population that would otherwise have ` +
    `existed. In the worst tenth of worlds: ${pct(res.p90Drawdown, 0)}.`
  );
  return out;
}

export { fmtPeople, pct };
