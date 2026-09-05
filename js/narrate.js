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
    const what = culprit ? culprit.name.toLowerCase() : run.ending;
    if (run.endKind === 'lock-in') {
      return `This world does not end in ${run.endYear} — it closes. ${fmtPeople(run.pop)} people are ` +
        `alive and will stay alive. What has ended is the possibility of anything else, through ` +
        `${what}. Only ${fmtPeople(run.deaths)} died getting here, which is exactly what makes this ` +
        `outcome invisible to every model that counts bodies.`;
    }
    return `This world ends in ${run.endYear}, ${yrs} year${yrs === 1 ? '' : 's'} from now. ` +
      `The proximate cause is ${what}. ` +
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
  const pAny = res.pScratch;
  const top = res.firstCatastrophe[0];
  const topEnd = res.byEnding[0];
  const end = cfg.startYear + cfg.horizon;

  out.push(
    `Across ${res.n.toLocaleString()} simulated worlds run to ${end}, ` +
    `${pct(pAny, pAny < 0.02 ? 2 : 1)} suffered a single event killing more than a tenth of ` +
    `humanity, and ${pct(res.pCollapse, res.pCollapse < 0.02 ? 2 : 1)} an event killing more than ` +
    `half. ${pct(res.pExtinct, 2)} ended in extinction; a further ${pct(res.pLockIn, 2)} ended in ` +
    `lock-in — humanity alive, its future closed. Those two are counted apart on purpose, because ` +
    `a body count cannot see the second one.`
  );

  if (top) {
    const h = hazIndex[top[0]];
    out.push(
      `The most likely thing to hurt you is ${h ? h.name.toLowerCase() : top[0]}: it caused the ` +
      `first major catastrophe in ${pct(top[1] / res.n, 1)} of runs.`
    );
  }
  const ended = res.extinct + res.lockedIn;
  if (topEnd && ended > 0) {
    const h = hazIndex[topEnd[0]];
    const share = topEnd[1] / ended;
    const same = top && topEnd[0] === top[0];
    out.push(
      `The most likely thing to END you is ${h ? h.name.toLowerCase() : topEnd[0]}, which accounts ` +
      `for ${pct(share, 0)} of the runs that ended. ` +
      (same
        ? `Here they are the same hazard, which is unusual — at most settings on this page they are not.`
        : `Those are different hazards, and the gap between the two lists is the most useful thing ` +
          `this model has to say. The catastrophes you are most likely to live through are not the ` +
          `ones most likely to finish it, and attention that follows the first list is not protecting ` +
          `you from the second.`)
    );
  } else if (ended === 0) {
    out.push(
      `No run ended. At these settings the model cannot find humanity's death — which is a statement ` +
      `about ${res.n.toLocaleString()} being a small number against a probability this low, not a ` +
      `reassurance. Raise the trial count and it will find some.`
    );
  }

  out.push(
    `Against the population that would otherwise have existed, the median world finishes ` +
    `${pct(res.medianDrawdown, 1)} short. The worst tenth finish ${pct(res.p90Drawdown, 0)} short.`
  );
  return out;
}

export { fmtPeople, pct };
