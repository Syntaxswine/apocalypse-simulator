# APOCALYPSE SIMULATOR

**A competing-hazards Monte Carlo over the published global-catastrophic-risk record.**

→ **[syntaxswine.github.io/apocalypse-simulator](https://syntaxswine.github.io/apocalypse-simulator/)**

31 hazards. 179 citations, every one of which you can click. Drag the assumptions
and watch which ending wins.

---

## The finding

At the sourced present-day settings, run to 2100:

| | |
|---|---|
| one event kills more than 10% of humanity | **23.5%** |
| one event kills more than half | **7.3%** |
| extinction | **0.38%** |
| lock-in — humanity alive, its future closed | **0.32%** |

And underneath those, the thing worth carrying away:

> **The most likely thing to hurt you is not the most likely thing to end you.**
>
> Nuclear exchange causes the first major catastrophe in about 13% of runs, at
> both scales combined, and almost never finishes it. Unaligned AI and entrenched
> lock-in cause almost no catastrophes and account for nearly all the endings.
>
> Two different lists. Attention that follows the first is not protecting you
> from the second.

That result is robust across most of the parameter space, which is what makes it
worth stating without the model attached.

## The other half of the question

"How is the world likely to end" has a second honest answer at a different scale,
and the page gives both. At the scale of a civilisation it is a probability. At
the scale of the planet it is a **schedule** — and the first item on that schedule
is not the Sun going out. It is the Sun getting *brighter*: rising luminosity
drives the carbon-silicate cycle to strip CO₂ below the minimum for land plants
somewhere between 1.0 and 1.86 billion years from now, ending macroscopic land
life while the Sun is still an unremarkable main-sequence star, six billion years
before it swallows the Earth.

Twelve dated entries, from that to false-vacuum decay at 10¹³⁹ years.

## How the model works

One year at a time. Every hazard on the board gets a chance to fire at a rate that
depends on the state of the world; if it fires, a severity is drawn; the world
absorbs the damage, cascades fire, and then it tries to recover.

Three structural commitments, each a correction to how these models usually go wrong:

- **The event is not the catastrophe.** Almost nothing here kills at global scale
  directly. Asteroids, supervolcanoes and nuclear exchanges all kill the same way —
  aerosol in the stratosphere, growing seasons fail, food runs out. Xia et al.
  separate ~27M direct deaths from ~260M famine deaths at 5 Tg of soot, and ~360M
  from over 5 billion at 150 Tg. The model separates them too, and only the famine
  half is buffered by the food-system controls.
- **Resilience is a state variable, not a slider on the output.** A given soot
  injection into a world holding 220 days of grain is a different event from the
  same injection into a world holding 45.
- **Death is not extinction, and extinction is not the only ending.** A tier
  labelled "civilisation does not return" only ends a run if the population it left
  behind makes that credible. And a *third* outcome is tracked separately: lock-in,
  where humanity persists and its future does not. The published treatments of
  entrenched dystopia are explicit that it involves almost no deaths — a body-count
  model cannot see it at all.

## What was done to keep it honest

**Twelve parallel researchers, then a hostile citation auditor per packet**, briefed
to assume an error was present. **43 of 226 citations came back not-confirmed —
19%.** Not near misses: a real arXiv ID attached to the wrong first author and
repeated verbatim across two packets; two-thirds of a transcribed tipping-point
table wrong by whole degrees; an author list explicitly (and falsely) certified as
"as published". Every correction is carried into the data and shown on the hazard
card under *What the citation auditor caught*.

**Provenance is a chain, not a claim.** `docs/research-packets.json` (what was
found) + `data/judgement.json` (every modelling call, each with a stated reason) →
`data/hazards.json`, merged mechanically by `tools/build-hazards.mjs`. Nothing is
retyped, and either layer can be attacked without disentangling it from the other.

**The instruments found four errors that all inflated the answer**, and each is
worth knowing about if you build something like this:

1. **The famine was counted twice** — the published severity figures already *are*
   famine numbers, and the winter mechanism was charging it again.
2. **Chronic hazards charged deaths the demography already had.** Today's AMR
   burden and today's climate mortality are inside the UN projection the model
   grows against. This alone put P(losing over half of humanity) at 35%.
3. **A rate annualised from a by-2100 figure must not then be given a trend.** The
   forecaster was asked about 2100 and answered about 2100. Coupling it to a
   compounding capability index on top took unaligned AI from ~6% century-cumulative
   to 74%, purely as the coupling's shape read back. Fixed by solving each such
   modifier's reference point so the century *integral* stays pinned to what was
   published while the shape stays free to rise.
4. **A cascade fired off the wrong tier** — "war → nuclear war" was triggering on
   every conflict killing a million people, inflating the nuclear hazard by ~2×.

**The rare hazards are unfalsifiable and the harness says so.** `tools/check.mjs`
refuses to report rate fidelity on 8 of the 31 hazards and prints the run-years it
would actually need: ~400,000 for a supereruption, 1.3 billion for a long-period
comet, 2.5 × 10¹³ for vacuum decay. An instrument with too little resolution returns
noise shaped like an answer.

**The direction audit** (`tools/direction-audit.mjs`) is the one I would keep if I
kept only one. The hazard rates came from the literature, but the *couplings* are
mine — and a model built entirely from honest numbers can still be dishonest if the
joins all lean the same way. It turns each coupling off in turn and measures the
signed change. If every resolvable choice raised risk, that is the doom-generator
signature and a finding about the author rather than the world.

Two results, in `docs/DIRECTION-AUDIT.txt`. The audit **refuses** a verdict on the
92 individual couplings — only 2 resolve above the noise floor, and separating a
typical one would need ~1.5 million runs per trial, 92 times over. But the
aggregate resolves, and it goes the *other* way from the worry: turning the whole
coupling layer off raises P(any ending) from 0.77% to 1.55%. The layer as a body
roughly halves the headline, dominated by the rate calibration. The couplings here
are not innocent of bias — they are biased **down**.

**The biggest disagreement in the field is a control, not a default.** In the 2023
Existential Risk Persuasion Tournament, superforecasters and AI domain experts
argued at length with incentives to persuade and came away differing by a factor of
eight, with minimal convergence. The *whose prior* slider is that disagreement, and
its stops were **measured** with `tools/calibrate-prior.mjs`, not asserted: 0.75×
reproduces the superforecasters' 0.38% AI extinction by 2100, 6× the domain experts'
3%, 7× Ord's 1-in-10 by 2120.

The page carries a section called *How this model is wrong*. It is not decoration.

## Running it

No build step, no dependencies, no network calls at runtime.

```bash
node tools/serve.mjs
```

```bash
node tools/check.mjs
```

```bash
node tools/direction-audit.mjs
```

## Layout

| path | what it is |
| --- | --- |
| `index.html`, `style.css` | the page |
| `js/model.js` | the engine: year loop, resilience, recovery, the two ending kinds |
| `js/couplings.js` | how world state moves rates and severities — data-driven |
| `js/params.js` | the knobs, each with a sourced real-world default |
| `js/worker.js` | the ensemble, off the main thread |
| `data/hazards.json` | **generated** — every rate, tier and citation |
| `data/judgement.json` | every modelling call that was not in the literature |
| `data/benchmarks.json` | the published aggregates, to check the model against |
| `data/deeptime.json` | the scheduled ends |
| `data/honesty.json` | the model's own limitations, shown on the page |
| `docs/research-packets.json` | what the researchers found and the auditors said |
| `docs/research/*.md` | four cross-cutting briefs: aggregates, epistemics, cascades, recovery |
| `tools/` | build, gates, instruments |

## Licence

Code MIT. The figures belong to the papers they came from — follow the links and
cite those, not this.
