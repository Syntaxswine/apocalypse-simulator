// The knobs.
//
// Every one of these has a real-world value, not a made-up midpoint, and every
// default carries an `anchor` string saying what that value IS and where it came
// from. A slider whose default is "0.5" is a slider that means nothing; a slider
// whose default is "12,241 warheads — FAS Nuclear Notebook, 2025" is an argument
// you can disagree with.
//
// `scale` says how the raw slider maps to the model: 'lin' or 'log'.

export const KNOBS = [
  // ── the shocks we choose ────────────────────────────────────────────────
  {
    id: 'warheadTarget', group: 'Nuclear', label: 'warheads', unit: '',
    def: 12241, min: 0, max: 70000, step: 100, scale: 'log',
    anchor: '12,241 worldwide as of early 2025 (FAS Nuclear Notebook); the 1986 peak was about 70,300.',
    fmt: (v) => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : String(Math.round(v)),
  },
  {
    id: 'cityTargeting', group: 'Nuclear', label: 'counter-value', unit: '',
    def: 0.5, min: 0, max: 1, step: 0.05, scale: 'lin',
    anchor: 'Fraction of warheads that would land on cities rather than silos. Soot — and therefore famine — comes almost entirely from burning cities.',
    fmt: (v) => (v * 100).toFixed(0) + '%',
  },
  {
    id: 'crisisRate', group: 'Nuclear', label: 'crisis tempo', unit: '×',
    def: 1, min: 0.1, max: 8, step: 0.1, scale: 'log',
    anchor: 'Multiplier on the rate of nuclear-armed confrontations. 1 = the Cold War average implied by the documented near-miss record; October 1962 was many times higher.',
    fmt: (v) => v.toFixed(1) + '×',
  },

  // ── the shocks we can see coming ────────────────────────────────────────
  {
    id: 'neoSurvey', group: 'Impact', label: 'NEO catalogue', unit: '',
    def: 0.95, min: 0, max: 1, step: 0.01, scale: 'lin',
    anchor: 'Fraction of >1 km near-Earth asteroids found and tracked. NASA reports better than 95% for this size class; the ≥140 m class is far less complete.',
    fmt: (v) => (v * 100).toFixed(0) + '%',
  },
  {
    id: 'deflection', group: 'Impact', label: 'deflection', unit: '',
    def: 0.25, min: 0, max: 1, step: 0.05, scale: 'lin',
    anchor: 'Probability a catalogued, decades-out impactor is actually deflected. DART (2022) proved kinetic impact works on a small body; no operational system exists.',
    fmt: (v) => (v * 100).toFixed(0) + '%',
  },

  // ── the buffer ──────────────────────────────────────────────────────────
  {
    id: 'reserveDays', group: 'Food system', label: 'grain reserve', unit: 'd',
    def: 90, min: 10, max: 365, step: 5, scale: 'lin',
    anchor: 'Days of world cereal consumption held in store. Global stocks-to-use has run roughly 25–30% of annual use, which is of order 100 days; it fell to about 60 in the 2007–08 spike.',
    fmt: (v) => Math.round(v) + ' d',
  },
  {
    id: 'tradeOpenness', group: 'Food system', label: 'trade openness', unit: '',
    def: 0.75, min: 0, max: 1, step: 0.05, scale: 'lin',
    anchor: 'Open trade moves food from surplus to deficit — and propagates export bans. Both effects are documented; the model makes the middle of the range the safest place to be.',
    fmt: (v) => (v * 100).toFixed(0) + '%',
  },
  {
    id: 'resilientFoodShare', group: 'Food system', label: 'sunless calories', unit: '',
    def: 0.02, min: 0, max: 0.8, step: 0.02, scale: 'lin',
    anchor: 'Share of calories obtainable without sunlight inside a crisis — seaweed, single-cell protein, cellulosic sugar, greenhouses. Essentially nothing is pre-positioned today.',
    fmt: (v) => (v * 100).toFixed(0) + '%',
  },

  // ── the slow burn ───────────────────────────────────────────────────────
  {
    id: 'warmingRate', group: 'Climate', label: 'warming rate', unit: '°C/decade',
    def: 0.027, min: 0, max: 0.09, step: 0.001, scale: 'lin',
    anchor: 'Observed warming has run about 0.2 °C per decade recently; the model tracks it per year. SSP1-2.6 flattens it, SSP5-8.5 roughly doubles it.',
    fmt: (v) => (v * 10).toFixed(2) + '°/dec',
  },
  {
    id: 'sensitivityScale', group: 'Climate', label: 'sensitivity', unit: '×',
    def: 1, min: 0.5, max: 2.2, step: 0.05, scale: 'lin',
    anchor: 'Multiplier on climate sensitivity. IPCC AR6 gives a likely equilibrium range of 2.5–4 °C with a best estimate of 3 °C; 1× here is that best estimate.',
    fmt: (v) => v.toFixed(2) + '×',
  },

  // ── the engineered ──────────────────────────────────────────────────────
  {
    id: 'synthScreening', group: 'Biotechnology', label: 'synthesis screening', unit: '',
    def: 0.8, min: 0, max: 1, step: 0.05, scale: 'lin',
    anchor: 'Share of commercial gene synthesis subject to customer and sequence screening. Consortium members cover most of the market by volume; benchtop synthesisers and non-member providers are the gap.',
    fmt: (v) => (v * 100).toFixed(0) + '%',
  },
  {
    id: 'bioGrowth', group: 'Biotechnology', label: 'capability growth', unit: '%/yr',
    def: 0.035, min: 0, max: 0.15, step: 0.005, scale: 'lin',
    anchor: 'Compound growth in the number of actors able to do serious synthetic biology. This is the term that makes engineered pandemic a rising rather than a stationary hazard.',
    fmt: (v) => (v * 100).toFixed(1) + '%',
  },
  {
    id: 'spillover', group: 'Biotechnology', label: 'spillover pressure', unit: '×',
    def: 1, min: 0.3, max: 3, step: 0.05, scale: 'lin',
    anchor: 'Land-use change, livestock density and wildlife trade set the rate of novel zoonoses. 1 = the present-day rate implied by the four-century epidemic record.',
    fmt: (v) => v.toFixed(2) + '×',
  },

  // ── the contested one ───────────────────────────────────────────────────
  {
    id: 'aiGrowth', group: 'Artificial intelligence', label: 'capability growth', unit: '%/yr',
    def: 0.09, min: 0, max: 0.3, step: 0.005, scale: 'lin',
    anchor: 'Compound growth in the capability index that drives the AI hazard rate. Deliberately exposed rather than asserted, because nobody knows it.',
    fmt: (v) => (v * 100).toFixed(1) + '%',
  },
  {
    id: 'alignmentEffort', group: 'Artificial intelligence', label: 'safety effort', unit: '×',
    def: 1, min: 0.25, max: 6, step: 0.25, scale: 'log',
    anchor: 'Multiplier on alignment and governance investment relative to today. Enters as a divisor on the conditional severity, not on the event rate.',
    fmt: (v) => v.toFixed(2) + '×',
  },

  // ── infrastructure ──────────────────────────────────────────────────────
  {
    id: 'gridHardening', group: 'Infrastructure', label: 'grid hardening', unit: '',
    def: 0.15, min: 0, max: 1, step: 0.05, scale: 'lin',
    anchor: 'Share of extra-high-voltage transformers protected against geomagnetically induced currents, plus spares held. Replacement lead times of a year or more are what turn a storm into a famine.',
    fmt: (v) => (v * 100).toFixed(0) + '%',
  },

  // ── recovery ────────────────────────────────────────────────────────────
  {
    id: 'mvp', group: 'Recovery', label: 'viable population', unit: 'people',
    def: 5000, min: 100, max: 500000, step: 100, scale: 'log',
    anchor: 'Population floor below which the model treats recovery as failed. The published minimum-viable-population work clusters near a few thousand, but it was written about wildlife, not about a species with agriculture and books. One of the weakest numbers here.',
    fmt: (v) => v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 0 : 1) + 'k' : String(Math.round(v)),
  },
  {
    id: 'rebuildRate', group: 'Recovery', label: 'rebuild rate', unit: '/yr',
    def: 0.02, min: 0.002, max: 0.12, step: 0.002, scale: 'log',
    anchor: 'Annual fractional recovery of industrial capacity at full labour. Post-1945 reconstruction ran far faster than this; a world that has to restart without reachable surface coal would run far slower.',
    fmt: (v) => (v * 100).toFixed(1) + '%',
  },
];

// Fixed structural constants — not knobs, but not magic numbers either.
export const CONST = {
  startYear: 2026,
  // UN World Population Prospects 2024, medium variant.
  pop0: 8.2,
  popPeak: 10.3,
  popGrowth: 0.0085,
  // Observed warming above the 1850–1900 baseline, mid-2020s.
  warming0: 1.35,
  warheads0: 12241,
};

export const PRESETS = [
  {
    id: 'now',
    name: '2026, as it is',
    note: 'Every knob at its sourced present-day value. This is the model’s honest reading of the world you are in.',
    over: {},
  },
  {
    id: 'oct62',
    name: 'October 1962',
    note: 'Arsenals near their historical peak, a crisis tempo matching the thirteen days, and a food system with the reserves of the era. Not a prediction — a calibration: the model should say that world was much more dangerous, and by roughly how much.',
    over: { warheadTarget: 30000, crisisRate: 6, cityTargeting: 0.75, reserveDays: 110, resilientFoodShare: 0, synthScreening: 0, neoSurvey: 0, deflection: 0, gridHardening: 0, aiGrowth: 0, bioGrowth: 0.01, warmingRate: 0.01 },
  },
  {
    id: 'hardened',
    name: 'A civilisation that took it seriously',
    note: 'Everything that is currently cheap and undone, done: full synthesis screening, a completed asteroid catalogue with a standing deflection capability, hardened transformers with spares, a real strategic grain reserve, and enough pre-positioned sunless food capacity to matter. No new physics, no new treaties — just the existing shopping list, bought.',
    over: { reserveDays: 220, resilientFoodShare: 0.35, synthScreening: 1, neoSurvey: 1, deflection: 0.85, gridHardening: 0.9, warheadTarget: 4000, crisisRate: 0.6, alignmentEffort: 4, warmingRate: 0.012 },
  },
  {
    id: 'careless',
    name: 'The careless century',
    note: 'Arsenals rebuilt, screening abandoned, reserves run down to just-in-time, a high-emissions pathway, and capability racing ahead of everything meant to contain it. Each individual setting here has a real-world precedent within the last fifty years.',
    over: { warheadTarget: 25000, crisisRate: 2.5, cityTargeting: 0.7, reserveDays: 45, tradeOpenness: 0.95, resilientFoodShare: 0, synthScreening: 0.25, bioGrowth: 0.07, aiGrowth: 0.16, alignmentEffort: 0.35, warmingRate: 0.05, sensitivityScale: 1.3, gridHardening: 0.02 },
  },
  {
    id: 'quiet',
    name: 'Nothing but the rocks',
    note: 'Every anthropogenic hazard switched off, leaving only what the solar system does on its own. This is the background rate humanity inherited — and it is startlingly small. Everything above it, we brought.',
    over: {},
    onlyNatural: true,
  },
];
