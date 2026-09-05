// The engine.
//
// This is a competing-hazards Monte Carlo. One year at a time, every hazard on
// the board gets a chance to fire; if it fires, a severity is drawn; the world
// state absorbs the damage and then tries to recover. Run it ten thousand times
// and the distribution of endings is the answer to "how is the world likely to
// end".
//
// Three structural commitments, each of which is a correction to how these
// models usually go wrong:
//
//  1. THE EVENT IS NOT THE CATASTROPHE. Almost nothing on this board kills
//     people directly at global scale. Asteroids, supervolcanoes and nuclear
//     exchanges all kill by the same mechanism — they put aerosol in the
//     stratosphere, the growing season fails, and the food runs out. So
//     severity is not a number attached to the event; it is computed from the
//     event's forcing against the world's buffer at that moment.
//
//  2. RESILIENCE IS A STATE VARIABLE, NOT A SLIDER ON THE OUTPUT. Grain
//     reserves, trade openness and sunlight-independent food capacity change
//     what a given shock does. A 5-teragram soot injection into a world with
//     140 days of grain in store is a different event from the same injection
//     into a world with 60. The model has to let those come apart.
//
//  3. DEATH IS NOT EXTINCTION. Losing 90% of humanity is a distinct outcome
//     from losing humanity, and the literature is clear that the gap between
//     them is large. Recovery gets its own machinery: a population floor, a
//     rebuild rate, and a bootstrapping penalty that grows the longer industry
//     stays down.

import { makeRng } from './rng.js';
import { hazardRate, severityScale, cascadeBoosts } from './couplings.js';

// ---------------------------------------------------------------------------
// World state
// ---------------------------------------------------------------------------

export function initialWorld(cfg) {
  return {
    year: cfg.startYear,
    // Billions. UN WPP 2024 medium variant: 8.2 bn in 2025, peaking ~10.3 bn
    // in the 2080s. We track it as a fraction of the projected baseline so a
    // catastrophe's cost reads as "against what would otherwise have been".
    pop: cfg.pop0,
    popBaseline: cfg.pop0,
    // 0..1 industrial + technological capacity, 1 = 2026 civilisation.
    industry: 1,
    // Days of world grain consumption held in store. FAO/USDA stocks-to-use
    // puts this in the 70-100 day band for cereals; the model's default comes
    // from params.js.
    reserveDays: cfg.reserveDays,
    // Degrees C above pre-industrial.
    warming: cfg.warming0,
    // Strategic warheads worldwide.
    warheads: cfg.warheads0,
    // Dimensionless capability indices, 1 = 2026 level. These drive the two
    // hazards whose rates are not stationary.
    bioCap: 1,
    aiCap: 1,
    // Active stratospheric forcing events: each is {tag, yearsLeft, sunLoss}
    // where sunLoss is the fractional reduction in growing-season insolation.
    winters: [],
    // Temporary multipliers other hazards have placed on each other.
    boosts: {},
    // Cumulative bookkeeping.
    deaths: 0,
    worstDrawdown: 0,
    worstEvent: 0,
    events: [],
    // Terminal state. endKind separates the two ways a run can stop, which are
    // genuinely different outcomes and must not be summed into one number.
    alive: true,
    ending: null,
    endKind: null,
    endYear: null,
  };
}

// ---------------------------------------------------------------------------
// Secular trends — what happens in a year where nothing goes wrong
// ---------------------------------------------------------------------------

function advanceTrends(w, cfg, rng) {
  // Population: logistic toward the UN medium-variant peak, but only if the
  // world is functioning. A wrecked civilisation does not follow a demographic
  // projection.
  const carrying = cfg.popPeak * (0.25 + 0.75 * w.industry);
  // The growth RATE is damped by industrial capacity as well as the ceiling.
  // Without this the model snaps back far too fast, and the empirical anchor is
  // unambiguous: Jedwab, Johnson & Koyama find a European city facing 10%
  // Black Death mortality was still 8.7% below its pre-plague size fifty years
  // later, and a whole region 13-15% below — which works out at an intrinsic
  // post-shock growth of roughly 0.03% a year, some thirty times slower than
  // the undamaged rate. Winchester never recovered at all; Florence took
  // centuries. Populations do not snap back, and a model that lets them
  // quietly converts every catastrophe into a dip.
  const vitality = 0.05 + 0.95 * w.industry;
  const growth = cfg.popGrowth * vitality * w.pop * (1 - w.pop / carrying);
  w.pop = Math.max(0, w.pop + growth);
  w.popBaseline = Math.min(
    cfg.popPeak,
    w.popBaseline + cfg.popGrowth * w.popBaseline * (1 - w.popBaseline / cfg.popPeak)
  );

  // Warming follows the chosen emissions pathway, scaled by the chosen climate
  // sensitivity. A collapsed industry stops emitting — which is a real effect
  // and one the model should not hide, even though it is a grim way to hit a
  // climate target.
  const forcing = cfg.warmingRate * (0.15 + 0.85 * w.industry);
  w.warming += forcing * cfg.sensitivityScale;

  // Arsenals drift toward the policy target rather than jumping.
  w.warheads += (cfg.warheadTarget - w.warheads) * 0.03;

  // Capability curves. Exponential, because that is what the last seventy years
  // of both fields look like, with the rate exposed as a knob rather than
  // asserted.
  w.bioCap *= 1 + cfg.bioGrowth;
  w.aiCap *= 1 + cfg.aiGrowth;

  // Reserves refill toward the policy target when there is spare production.
  const target = cfg.reserveDays;
  const slack = w.industry * (1 - sunLoss(w));
  w.reserveDays += (target - w.reserveDays) * 0.25 * slack;

  // Industry rebuilds. The bootstrapping penalty is the important term: the
  // longer capacity stays down, the harder the restart, because the easily
  // reachable coal and surface ore that bootstrapped the first industrial
  // revolution are gone and the people who knew how are dying.
  if (w.industry < 1) {
    const laborShare = Math.min(1, w.pop / (0.35 * cfg.popPeak));
    const rebuild = cfg.rebuildRate * laborShare * Math.max(0.05, w.industry);
    w.industry = Math.min(1, w.industry + rebuild);
  }
}

// The world's path with nothing going wrong: warming accumulating, capability
// indices compounding, arsenals drifting to their policy target. Exported
// because two other places need it and must not re-derive it — the rate
// calibration in tools/build-hazards.mjs, and the runaway instrument in
// tools/check.mjs. A calibration computed against a slightly different
// trajectory than the engine actually runs would be silently wrong in a way
// nothing would catch.
export function quietTrajectory(cfg, years) {
  const w = initialWorld(cfg);
  const out = [];
  for (let y = 0; y < years; y++) {
    out.push({ year: w.year, warming: w.warming, aiCap: w.aiCap, bioCap: w.bioCap, warheads: w.warheads, industry: w.industry, pop: w.pop, reserveDays: w.reserveDays });
    w.year = cfg.startYear + y;
    advanceTrends(w, cfg, null);
  }
  return out;
}

// Total fractional loss of growing-season sunlight from all active winters.
// Overlapping injections do not simply add — the stratosphere saturates — so
// they combine as one-minus-product of transmissions.
export function sunLoss(w) {
  let transmit = 1;
  for (const s of w.winters) transmit *= 1 - s.sunLoss;
  return 1 - transmit;
}

// ---------------------------------------------------------------------------
// Resilience — the buffer a shock has to chew through
// ---------------------------------------------------------------------------
//
// Returns a multiplier on a hazard's tabulated deaths_fraction. 1.0 means "as
// bad as the source's figure, which was computed against a world like today's".
// Below 1 means the world is better buffered than the source assumed; above 1
// means worse.

export function resilience(w, cfg) {
  // Grain in store, against the ~90-day baseline most published famine
  // estimates implicitly assume.
  const stock = w.reserveDays / 90;
  // Sunlight-independent calories that can be stood up inside the crisis.
  const alt = cfg.resilientFoodShare;
  // Trade openness cuts both ways and the literature is explicit about this:
  // open trade moves food from surplus to deficit regions (Puma et al. on the
  // food-trade network), and it propagates export bans (2007-08, 2010-11,
  // 2022). The optimum therefore sits at high-but-not-total openness, and the
  // curve is deliberately ASYMMETRIC: autarky is far worse than hyper-openness,
  // because 83% of countries have low or marginal food self-sufficiency.
  // Calibrated to exactly 1.0 at the default of 0.75, so that at default
  // settings the model reproduces the published death figures rather than
  // silently discounting them.
  const t = cfg.tradeOpenness;
  const trade = t < 0.75
    ? 1 + 0.45 * Math.pow((0.75 - t) / 0.75, 2)
    : 1 + 0.25 * Math.pow((t - 0.75) / 0.25, 2);
  // Concurrent stresses compound rather than add: a famine during a pandemic
  // during a grid failure is worse than the sum.
  const concurrent = 1 + 0.25 * Math.max(0, w.winters.length - 1);

  const buffer = 0.45 / Math.max(0.15, stock) + 0.55;
  const mult = buffer * trade * concurrent * (1 - 0.6 * alt);
  // Industry below 1 means less capacity to move food, run cold chains, and
  // manufacture fertiliser.
  const industrial = 1 + 0.8 * (1 - w.industry);
  return Math.max(0.15, mult * industrial);
}

// ---------------------------------------------------------------------------
// Applying an event
// ---------------------------------------------------------------------------

function applyTier(w, cfg, hz, tier, rng) {
  const scale = resilience(w, cfg) * severityScale(hz, tier, w, cfg);

  // A chronic hazard fires every year, but its tabulated death fraction is a
  // multi-year total (climate mortality and AMR burden are both published as
  // annual-or-decadal loads, not as one-off events). Spreading it keeps the
  // cited number intact and stops the hazard charging it ten times over.
  //
  // `baseline` is the second and less obvious correction. The population
  // projection this model grows against is the UN medium variant, which is a
  // NET projection: the deaths already happening — including today's climate
  // mortality and today's 1.14 million annual AMR deaths — are inside it
  // already. Charging the full observed burden on top would count those people
  // twice, once in the demography and once as a catastrophe. Only the EXCESS
  // over what the projection already assumes is a loss against the baseline.
  // Getting this wrong put P(losing over half of humanity) at 35% on the first
  // build, almost all of it manufactured by two hazards that are not events.
  const spread = hz.chronic || 1;
  const chargeable = Math.max(0, (tier.deaths ?? 0) - (hz.baseline ?? 0));
  const promptShare = tier.deaths > 0 ? (tier.promptDeaths ?? 0) / tier.deaths : 0;

  // Prompt deaths — blast, disease, the event itself. Not buffered by grain
  // reserves, so they take only the hazard-specific scaling and not the
  // resilience term.
  const prompt = Math.min(1, ((chargeable * promptShare) / spread) * severityScale(hz, tier, w, cfg));

  // Famine deaths — everything else, and on most of this board that is nearly
  // everything. These ARE buffered, which is the whole point of tracking
  // reserves, trade and sunless calories.
  const famineBase = (chargeable * (1 - promptShare)) / spread;
  // Lognormal spread around the tabulated central estimate. sigma 0.45 gives a
  // roughly 2.5x spread between the 10th and 90th percentile, which is the
  // right order for how much these published numbers move between studies.
  const famine = Math.min(1 - prompt, famineBase * scale * Math.exp(0.45 * rng.normal() - 0.10));

  const killed = Math.min(0.995, prompt + famine);
  const lost = w.pop * killed;
  w.pop -= lost;
  w.deaths += lost;

  // Infrastructure. A winter does not knock down factories; a nuclear exchange
  // or a grid collapse does. Tabulated separately for that reason.
  w.industry = Math.max(0.01, w.industry * (1 - (tier.infra ?? 0)));
  w.reserveDays *= 1 - Math.min(0.95, killed + (tier.infra ?? 0) * 0.5);

  if (tier.winterYears > 0 && tier.sunLoss > 0) {
    w.winters.push({
      tag: hz.id,
      yearsLeft: Math.max(1, Math.round(tier.winterYears * rng.range(0.7, 1.4))),
      sunLoss: Math.min(0.95, tier.sunLoss * rng.range(0.7, 1.4)),
    });
  }

  // Cascades: this event makes other things likelier for a while.
  for (const [target, mult, years] of cascadeBoosts(hz, tier)) {
    const cur = w.boosts[target];
    w.boosts[target] = cur
      ? { mult: Math.max(cur.mult, mult), yearsLeft: Math.max(cur.yearsLeft, years) }
      : { mult, yearsLeft: years };
  }

  if (killed > w.worstEvent) w.worstEvent = killed;
  w.events.push({
    year: w.year,
    hazard: hz.id,
    name: hz.name,
    tier: tier.label,
    killedFraction: killed,
    killedAbs: lost,
    popAfter: w.pop,
    industryAfter: w.industry,
    terminal: !!tier.terminal,
  });

  return { killed, terminal: !!tier.terminal };
}

// Advance every active stratospheric-aerosol event by a year.
//
// NOTE, because this is the easiest error in the whole model to make and I made
// it first time round: this function charges NO DEATHS. Every published severity
// figure this model is built on — Xia et al.'s five billion without adequate
// calories, the impact-winter harvest-failure estimates, the Tambora and Toba
// mortality reconstructions — is ALREADY a famine number. It counts the people
// who starve in years two and three, not the ones under the fireball. Charging
// famine again per winter-year would double-count the entire mechanism and would
// roughly double the death toll of every aerosol hazard on the board.
//
// So the tabulated deaths carry the famine, scaled by resilience() at the moment
// the event lands. What an ongoing winter does instead is all second-order, and
// all real: it drains the grain reserve, it blocks the reserve from refilling
// (via the sunlight term in advanceTrends), it holds industrial recovery down,
// and it makes any OTHER event landing during it markedly worse through the
// concurrent-stress term in resilience(). A volcanic winter does not kill you
// twice; it makes the next thing that happens far more likely to.
function advanceWinters(w) {
  const loss = sunLoss(w);
  if (loss <= 0) return;
  w.reserveDays = Math.max(0, w.reserveDays - 365 * loss * 0.35);
  for (const s of w.winters) s.yearsLeft--;
  w.winters = w.winters.filter((s) => s.yearsLeft > 0);
}

// ---------------------------------------------------------------------------
// Terminal conditions
// ---------------------------------------------------------------------------
//
// Extinction is not a tier that fires. It is a threshold the world falls
// through, and it has to be checked against the recovery machinery rather than
// asserted, or the model just returns whatever doom the tier table was written
// to contain.

function checkTerminal(w, cfg, rng) {
  // Hard floor. Below this the demographic and genetic arguments for recovery
  // stop working. See docs/SOURCES.md — the minimum-viable-population figure is
  // one of the weakest numbers on the board and it is a knob for that reason.
  if (w.pop * 1e9 < cfg.mvp) return 'extinction';

  // Soft floor: a small population with no industry, being ground down by an
  // ongoing winter, can fail to recover even without hitting the hard floor.
  if (w.pop * 1e9 < cfg.mvp * 40 && w.industry < 0.05 && sunLoss(w) > 0.2) {
    if (rng.bern(0.12)) return 'failed-recovery';
  }
  return null;
}

// ---------------------------------------------------------------------------
// One run
// ---------------------------------------------------------------------------

export function runOnce(hazards, cfg, seed, popOut) {
  const rng = makeRng(seed);
  const w = initialWorld(cfg);
  const trace = [];

  for (let y = 0; y < cfg.horizon; y++) {
    w.year = cfg.startYear + y;

    advanceTrends(w, cfg, rng);

    // Decay cascade boosts.
    for (const k of Object.keys(w.boosts)) {
      if (--w.boosts[k].yearsLeft <= 0) delete w.boosts[k];
    }

    for (const hz of hazards) {
      if (!cfg.enabled[hz.id]) continue;
      let p = hazardRate(hz, w, cfg);
      const boost = w.boosts[hz.id];
      if (boost) p *= boost.mult;
      p = Math.min(0.95, p);
      const fired = p > 0 && rng.bern(p);
      // Instrumentation hook. tools/check.mjs uses it to test that the engine
      // actually fires each hazard at the rate the data asks for — a check that
      // is impossible from the outside, because the only externally visible
      // signal is deaths, and deaths are the product of the rate and half a
      // dozen other things.
      if (cfg.onDraw) cfg.onDraw(hz.id, p, fired, w.year);
      if (!fired) continue;

      // Which severity? The tier probabilities are conditional on the event and
      // are normalised here so a data edit cannot silently change the event
      // rate as a side effect of changing the severity mix.
      const total = hz.tiers.reduce((s, t) => s + t.p, 0);
      let roll = rng.next() * total;
      let tier = hz.tiers[hz.tiers.length - 1];
      for (const t of hz.tiers) {
        roll -= t.p;
        if (roll <= 0) { tier = t; break; }
      }

      const res = applyTier(w, cfg, hz, tier, rng);
      // Three ways a tier can be the end, and they are not the same thing.
      //
      // `absolute` is the handful of mechanisms that do not care how many
      // people there are or where they are standing — false-vacuum decay is
      // the honest example.
      //
      // `lockIn` is the outcome where humanity persists and its future does
      // not: a globally entrenched totalitarian order, or permanent
      // disempowerment by a system nobody can switch off. The published
      // treatments (Caplan in Bostrom & Cirkovic; Ord's "unrecoverable
      // dystopia") are explicit that this involves few or no deaths, which
      // means a body-count model cannot see it at all. Counting it as an
      // extinction would be wrong and dropping it would be worse, so it gets
      // its own ending kind and its own line in the verdict.
      //
      // `terminal` is the ordinary kind, and it still has to get past the
      // recovery machinery: a tier labelled "civilisation does not come back"
      // only ends the run if the population it left behind is small enough
      // for that claim to be credible.
      if (tier.absolute || tier.lockIn || (res.terminal && w.pop * 1e9 < cfg.mvp * 200)) {
        w.alive = false;
        w.ending = hz.id;
        w.endKind = tier.lockIn ? 'lock-in' : 'extinction';
        w.endYear = w.year;
      }
    }

    advanceWinters(w);

    const drawdown = 1 - w.pop / Math.max(0.001, w.popBaseline);
    if (drawdown > w.worstDrawdown) w.worstDrawdown = drawdown;

    if (w.alive) {
      const term = checkTerminal(w, cfg, rng);
      if (term) {
        w.alive = false;
        w.endKind = 'extinction';
        // Attribute the ending to the last thing that hit hard enough to matter.
        const culprit = [...w.events].reverse().find((e) => e.killedFraction > 0.05);
        w.ending = culprit ? culprit.hazard : term;
        w.endYear = w.year;
      }
    }

    if (popOut) popOut[y] = w.alive ? w.pop : 0;

    if (cfg.keepTrace) {
      trace.push({
        year: w.year,
        pop: w.pop,
        industry: w.industry,
        warming: w.warming,
        sunLoss: sunLoss(w),
        reserveDays: w.reserveDays,
      });
    }

    if (!w.alive) {
      // A dead run still has to fill the rest of the series with zeroes, or
      // the year-by-year percentiles would be computed over survivors only —
      // which is exactly the survivorship bias this whole model exists to
      // avoid committing.
      if (popOut) for (let k = y + 1; k < cfg.horizon; k++) popOut[k] = 0;
      break;
    }
  }

  return {
    survived: w.alive,
    ending: w.ending,
    endKind: w.endKind,
    endYear: w.endYear,
    pop: w.pop,
    popBaseline: w.popBaseline,
    industry: w.industry,
    warming: w.warming,
    deaths: w.deaths,
    worstDrawdown: w.worstDrawdown,
    worstEvent: w.worstEvent,
    events: w.events,
    trace,
  };
}

// ---------------------------------------------------------------------------
// Many runs
// ---------------------------------------------------------------------------

// The ensemble is accumulated through an explicit object rather than a single
// monolithic loop, so that the page (which runs in chunks to keep the interface
// alive) and tools/check.mjs (which runs straight through) share one
// implementation. Two implementations of "what the ensemble means" would
// eventually disagree, and the one you were not looking at would be the one on
// the screen.

export function makeEnsemble(cfg, n) {
  const H = cfg.horizon;
  const byEnding = new Map();
  const firstCatastrophe = new Map();
  const popGrid = new Float32Array(n * H);
  const drawdowns = [];
  const worstEvents = [];
  const popAt = [];
  const yearOfEnd = [];
  const survivalByYear = new Float64Array(H).fill(0);
  let i = 0, extinct = 0, lockedIn = 0, collapsed = 0, scratched = 0, baselineEnd = 0;

  return {
    get filled() { return i; },
    slot: () => popGrid.subarray(i * H, (i + 1) * H),
    push(r) {
      if (!r.survived) {
        if (r.endKind === 'lock-in') lockedIn++; else extinct++;
        byEnding.set(r.ending, (byEnding.get(r.ending) || 0) + 1);
        yearOfEnd.push(r.endYear);
        const endIdx = Math.max(0, Math.min(H, r.endYear - cfg.startYear));
        for (let y = 0; y < endIdx; y++) survivalByYear[y]++;
      } else {
        for (let y = 0; y < H; y++) survivalByYear[y]++;
      }
      // Two different questions, kept apart because the published figures
      // answer the first and the second is the one a reader actually feels.
      //   worstEvent    the largest SINGLE event's death fraction — this is
      //                 what the XPT and Ord mean by "a global catastrophe":
      //                 an event killing >10% of humanity in a short window.
      //   worstDrawdown the deepest cumulative shortfall against the population
      //                 that would otherwise have existed, across everything
      //                 that happened. Always the larger number.
      if (r.worstEvent > 0.5) collapsed++;
      if (r.worstEvent > 0.1) scratched++;
      drawdowns.push(r.worstDrawdown);
      worstEvents.push(r.worstEvent);
      // Deterministic and identical across runs, but reported from the run
      // rather than asserted, so the verdict panel and the narrated history can
      // never quote different counterfactuals.
      baselineEnd = r.popBaseline;
      popAt.push(r.pop);
      const first = r.events.find((e) => e.killedFraction > 0.1);
      if (first) firstCatastrophe.set(first.hazard, (firstCatastrophe.get(first.hazard) || 0) + 1);
      i++;
    },
    finish() {
      const used = i;
      drawdowns.sort((a, b) => a - b);
      worstEvents.sort((a, b) => a - b);
      popAt.sort((a, b) => a - b);
      const q = (arr, p) => arr[Math.min(arr.length - 1, Math.max(0, Math.floor(p * arr.length)))];

      const fan = { p05: [], p25: [], p50: [], p75: [], p95: [] };
      const col = new Float64Array(used);
      for (let y = 0; y < H; y++) {
        for (let k = 0; k < used; k++) col[k] = popGrid[k * H + y];
        const s = Array.prototype.slice.call(col).sort((a, b) => a - b);
        fan.p05.push(q(s, 0.05)); fan.p25.push(q(s, 0.25)); fan.p50.push(q(s, 0.50));
        fan.p75.push(q(s, 0.75)); fan.p95.push(q(s, 0.95));
      }
      yearOfEnd.sort((a, b) => a - b);

      return {
        n: used,
        baselineEnd,
        extinct, lockedIn, collapsed, scratched,
        pLockIn: lockedIn / used,
        pEnded: (extinct + lockedIn) / used,
        pExtinct: extinct / used,
        pCollapse: collapsed / used,
        pScratch: scratched / used,
        byEnding: [...byEnding.entries()].sort((a, b) => b[1] - a[1]),
        firstCatastrophe: [...firstCatastrophe.entries()].sort((a, b) => b[1] - a[1]),
        survival: Array.from(survivalByYear, (c) => c / used),
        fan,
        medianDrawdown: q(drawdowns, 0.5),
        p90Drawdown: q(drawdowns, 0.9),
        medianWorstEvent: q(worstEvents, 0.5),
        p90WorstEvent: q(worstEvents, 0.9),
        popMedian: q(popAt, 0.5),
        popP10: q(popAt, 0.1),
        popP90: q(popAt, 0.9),
        medianEndYear: yearOfEnd.length ? yearOfEnd[Math.floor(yearOfEnd.length / 2)] : null,
        // A binomial standard error on the headline, so nobody reads three
        // decimal places off a number that only has one.
        seExtinct: Math.sqrt((extinct / used) * (1 - extinct / used) / used),
        seEnded: Math.sqrt(((extinct + lockedIn) / used) * (1 - (extinct + lockedIn) / used) / used),
      };
    },
  };
}

export function seedFor(baseSeed, i) {
  return (baseSeed + i * 0x9e3779b9) >>> 0;
}

export function runMany(hazards, cfg, n, baseSeed) {
  const ens = makeEnsemble(cfg, n);
  const runCfg = { ...cfg, keepTrace: false };
  for (let i = 0; i < n; i++) {
    ens.push(runOnce(hazards, runCfg, seedFor(baseSeed, i), ens.slot()));
  }
  return ens.finish();
}
