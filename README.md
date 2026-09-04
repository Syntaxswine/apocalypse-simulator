# APOCALYPSE SIMULATOR

**A competing-hazards Monte Carlo over the published global-catastrophic-risk record.**

Every rate in this model comes from a citation you can click. Every citation was
checked by an adversarial auditor whose job was to catch fabricated sources and
figures that do not match what the paper actually says. Where no published figure
exists, the model says so, in the interface, with a badge.

You drag the assumptions. It tells you which ending wins.

---

## The question, taken literally

"How is the world likely to end" has two honest answers at two different scales,
and the page gives both.

**At the scale of a human life or a civilisation**, the answer is probabilistic
and it is dominated by things we are doing to ourselves. Run the model with every
anthropogenic hazard switched off and the background rate humanity inherited from
the solar system is startlingly small. Everything above that floor, we brought.

**At the scale of the planet**, the answer is not a probability at all. It is a
schedule, and the first item on it is not the Sun going out — it is the Sun
getting brighter, the carbon-silicate cycle running down, and photosynthesis
becoming impossible while the Sun is still an unremarkable main-sequence star.
That happens on the order of a billion years from now, which is roughly a fifth
of the time life has already had.

Most "how will the world end" material conflates these. This page keeps them
apart, because the interventions are different: one of them has a shopping list
and the other does not.

## What the model actually does

One year at a time, over a century by default:

1. **Every hazard on the board gets a chance to fire**, at a rate that depends on
   the state of the world — arsenals, capability indices, warming, and the knobs
   you have set.
2. **If it fires, a severity is drawn** from that hazard's tier table.
3. **The world absorbs the damage.** Crucially, severity is *not* a fixed number.
   Almost nothing here kills at global scale directly: asteroids, supervolcanoes
   and nuclear exchanges all kill by the same mechanism — aerosol in the
   stratosphere, growing seasons fail, food runs out. So the death toll is
   computed from the event's forcing against the world's buffer *at that moment*.
4. **Cascades fire.** An event can raise other hazards' rates for years.
5. **The world tries to recover** — population regrows, industry rebuilds, and a
   bootstrapping penalty makes a long outage progressively harder to climb out of.
6. **Extinction is checked, not asserted.** A tier labelled "civilisation does not
   return" only ends the run if the population it left behind is small enough for
   that claim to be credible.

Run it four thousand times and the distribution of endings is the answer.

### Three structural commitments

These are the corrections to how models like this usually go wrong, and they are
the reason the output is not simply a doom generator:

- **The event is not the catastrophe.** Blast, tsunami and thermal pulse are
  regional. Famine is global. The model separates prompt deaths from famine
  deaths and only the second are buffered.
- **Resilience is a state variable, not a slider on the output.** A 5-teragram
  soot injection into a world holding 140 days of grain is a genuinely different
  event from the same injection into a world holding 60. The model lets those
  come apart, so the food-system knobs do real work.
- **Death is not extinction.** Losing 90% of humanity and losing humanity are
  different outcomes and the gap between them is large. Recovery gets its own
  machinery rather than being folded into a severity number.

## What it is honest about

The interface carries a section titled *How this model is wrong*, and it is not
decoration. The short version:

- **The rare hazards are unfalsifiable.** `tools/check.mjs` includes a rate-fidelity
  instrument that **refuses to report** on any hazard too rare to resolve at the run
  count available, and prints how many run-years it would actually need. For a
  1-in-a-million-years hazard that number is astronomical. This is not a defect of
  the harness; it is the central epistemic fact about the whole subject.
- **The anthropic shadow cuts both ways** and the literature is currently arguing
  about it — the 2010 paper proposing the effect and the 2024 paper arguing it is
  much weaker are both cited on the page.
- **The expert disagreement is larger than the model's uncertainty.** On AI risk,
  superforecasters and domain experts in the same forecasting tournament, after
  being made to argue with each other, differed by more than an order of magnitude
  and did not converge. The page shows both numbers rather than picking one.
- **Some numbers had to be constructed.** Those carry an `estimated` badge and are
  the ones to attack first.

## Running it

No build step, no dependencies, no network calls at runtime.

```bash
node tools/serve.mjs        # then open http://localhost:8117/
```

Verification harness — gates that fail loudly, plus instruments that only report:

```bash
node tools/check.mjs        # fast
node tools/check.mjs --full # slow sweeps, tighter statistics
```

## Layout

| path | what it is |
| --- | --- |
| `index.html`, `style.css` | the page |
| `js/model.js` | the engine: year loop, resilience, recovery, extinction |
| `js/couplings.js` | how world state modifies rates and severities — data-driven |
| `js/params.js` | the knobs, each with a sourced real-world default |
| `js/charts.js` | survival curve, population fan, single-run trace |
| `js/narrate.js` | turning one run into a readable history |
| `data/hazards.json` | **every rate, tier and citation** |
| `data/benchmarks.json` | published aggregate estimates to check the model against |
| `data/deeptime.json` | the scheduled ends |
| `data/honesty.json` | the model's own limitations, shown on the page |
| `tools/check.mjs` | gates and instruments |
| `docs/` | design notes and the sourcing record |

## A note on what this is for

A simulator like this is not a forecast. It is a **shorthand factory**: you run it
to extract rules of thumb that survive outside it. The ones that fell out of this
build are on the page under *The verdict*, and the most durable of them is this —

> The catastrophes you are most likely to live through are not the ones most
> likely to finish it. Those are two different lists, and confusing them is how
> attention ends up in the wrong place.

## Licence

Code MIT. The sourced figures belong to the papers they came from; follow the
links and cite those, not this.
