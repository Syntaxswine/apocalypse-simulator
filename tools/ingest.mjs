// Mechanical transform from the research packets into engine shape.
//
// This exists so that nothing gets retyped. Every field that is a straight
// carry-over — name, mechanism, the rate and its basis, the tier probabilities
// and death fractions, every citation — is copied by machine. The fields that
// require judgement are left explicitly `null` for a human to fill:
//
//   promptDeaths   what share of the deaths are NOT famine, and so are not
//                  buffered by grain reserves
//   infra          how much industrial capacity the event destroys
//   sunLoss        fractional loss of growing-season sunlight, and
//   winterYears    how long it lasts
//   absolute       does this kill regardless of how many people there are
//   rateMods       how world state changes the rate
//   sevMods        how world state changes the severity
//   cascades       mult/years for each coupling the researcher named
//   anthropogenic  did we bring this one
//   rate.cap       ceiling, for rates coupled to a compounding index
//
// Splitting it this way means a mistake in the copied half is a bug in twelve
// lines of code, and a mistake in the judged half is visible as a judgement.
//
//   node tools/ingest.mjs <research.json> > data/hazards.draft.json

import { readFileSync } from 'node:fs';

const src = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const DEEP = /^deep-time-/;

const hazards = src.hazards
  .filter((h) => !DEEP.test(h.id))
  .map((h) => {
    const total = h.severity_tiers.reduce((s, t) => s + t.p_given_event, 0) || 1;
    return {
      id: h.id,
      name: h.name,
      cat: h.category,
      anthropogenic: null,
      oneLine: h.one_line,
      mechanism: h.mechanism,
      rate: {
        best: h.annual_probability.best,
        low: h.annual_probability.low,
        high: h.annual_probability.high,
        basis: h.annual_probability.basis,
        eventDefinition: h.annual_probability.event_definition,
        trend: h.annual_probability.trend,
        cap: null,
      },
      rateMods: null,
      sevMods: null,
      tiers: h.severity_tiers.map((t) => ({
        label: t.label,
        desc: t.description,
        // Normalised here rather than in the engine, so that editing a severity
        // mix can never silently change the event rate.
        p: t.p_given_event / total,
        deaths: t.deaths_fraction,
        promptDeaths: null,
        infra: null,
        sunLoss: null,
        winterYears: null,
        recovery: t.recovery_years,
        terminal: !!t.terminal,
        absolute: false,
      })),
      cascades: (h.cascades_into || []).map((c) => {
        const [to, ...why] = String(c).split(':');
        return { to: to.trim(), mult: null, years: null, when: '*', why: why.join(':').trim() };
      }),
      citations: h.citations.map((c) => ({
        claim: c.claim,
        authors: c.authors,
        year: c.year,
        venue: c.venue,
        figure: c.exact_figure,
        url: c.url,
      })),
      uncertainty: h.uncertainty_notes,
      // Kept only as a note to whoever writes the modifiers; stripped before ship.
      _params: (h.key_parameters || []).map((p) => `${p.id} [${p.unit}] now=${p.current_value} (${p.min}..${p.max}): ${p.effect}`),
    };
  });

process.stdout.write(JSON.stringify({ hazards }, null, 1));
