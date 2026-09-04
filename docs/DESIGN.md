# Design notes

Field notes on why the model is shaped the way it is. Written for whoever picks
this up next, including me.

## The shape of the problem

"How is the world likely to end, based on real science and data" looks like one
question and is three:

1. **What can end it?** — an inventory problem. Solved by reading the literature.
2. **How often, and how badly?** — a rate-and-severity problem. Mostly solved by
   the literature, with wide and honestly-reported disagreement.
3. **How do those combine over a century?** — a *modelling* problem, and the only
   one where a simulator adds anything a table could not.

Most published treatments stop at (2) and present a table of per-risk
probabilities. A table cannot answer the questions people actually have — what
happens if two of these land in the same decade, whether the food buffer matters
more than the hazard rate, whether the thing most likely to hurt you is the thing
most likely to finish you. That is what (3) is for and it is the whole reason to
build this rather than write a list.

## Why competing hazards and not a decision tree

A decision tree ("if nuclear war, then…") bakes in the ordering. The interesting
structure here is that hazards are *simultaneous* and *coupled*: a volcanic
winter during a pandemic is worse than either alone, and a nuclear exchange raises
the probability of the systemic failures that follow it. A year-stepped competing-
hazards loop gets that for free, and it makes the cascade structure explicit data
rather than implicit control flow.

## The single most important modelling decision

**Severity is computed, not tabulated.**

Every published severity figure — Xia et al.'s five billion without adequate
calories, the impact-winter crop-failure estimates, the pandemic mortality
fractions — was computed against a world resembling the present one. If the model
simply reads those numbers off a table, then every food-system knob in the
interface is a lie: you could set grain reserves to a year and nothing would move.

So the tier tables carry a *reference* death fraction and the engine scales it by
a resilience term built from grain reserves, trade openness, sunlight-independent
food capacity, concurrent stresses and remaining industrial capacity. At default
settings the resilience term is near 1 and the model reproduces the published
figure; away from defaults it moves, and `tools/check.mjs` sweeps every knob to
confirm it moves in the direction the label claims.

The corollary matters: **prompt deaths and famine deaths are separated.** Blast
casualties are not buffered by a grain reserve. Only the famine term is scaled.
Conflating them would let a strategic grain reserve save people from a fireball.

## Why extinction is a threshold and not a tier

The tempting implementation is a tier flagged `extinction: true` that ends the
run when it fires. That implementation returns exactly the doom you wrote into
the table, and it is unfalsifiable.

Instead: a terminal tier is a *claim about recovery*, and it is checked. It ends
the run only if the population it left behind is small enough for the claim to be
credible against the recovery machinery — a population floor, a rebuild rate, and
a bootstrapping penalty. A handful of mechanisms genuinely do not care how many
people there are (false-vacuum decay is the honest example); those carry an
`absolute` flag and bypass the check. There are very few of them, and that is a
finding, not an oversight.

## Where the numbers come from, and how they were checked

Twelve parallel researchers, one per risk class, each required to do live web
searches and fetch primary sources — explicitly forbidden from answering from
memory, because a plausible-looking citation generated from memory is the single
most likely failure mode of this whole exercise.

Each packet was then handed to a **hostile citation auditor** whose brief was to
assume at least one error was present, and who checked every citation for: does
the paper exist, are the authors and year right, does the *exact figure claimed*
match what the source says, does the URL resolve, and does the derived per-year
rate square with the cited recurrence interval. Corrections from the audit are
folded into `data/hazards.json` and the audit trail lives in `docs/AUDIT.md`.

This is the same discipline as a structural fact-check on a mineral's twin laws:
a fabricated citation is worse than no citation, because it survives casual
inspection.

## The instrument that refuses

`tools/check.mjs` contains a rate-fidelity instrument: it accumulates the
probabilities the engine actually drew against the fires it actually produced,
and tests them as a Poisson process. This catches a whole class of plumbing bugs
that are invisible from the outside, because the only externally visible signal is
deaths, and deaths are the product of the rate and half a dozen other things.

The instrument **refuses to report** on any hazard whose expected event count is
below ~25 at the available run count, and prints instead how many run-years would
be needed to resolve it. For a 1-in-a-million-years hazard that is of order
25 million run-years. This is deliberate: an instrument with too little resolution
returns noise shaped like an answer, and a green tick on a hazard it cannot
actually see is worse than an explicit refusal.

It also means the page's headline numbers for the rare tail are *arithmetic on the
inputs*, not an empirical finding of the simulation. The page says so.

## Non-monotone on purpose

Trade openness is the one knob deliberately excluded from the monotonicity sweep.
Open trade moves food from surplus regions to deficit ones and it propagates
export bans; both effects are documented, and the 2007-08 and 2010-11 cascades are
the standing evidence for the second. The model puts the optimum at
high-but-not-total openness, and the check tool records the sweep as `n/a` with
that reason rather than pretending it should be a straight line.

Every other knob is swept and must move `P(collapse)` in the direction its label
claims. A knob that comes back flat is a knob that does nothing, which is a lie
told to the user; the sweep prints `FLAT` in that case.

## What is deliberately not modelled

- **Geography.** No regions, no trade network topology, no where-you-live. The
  literature's severity figures are global and disaggregating them honestly would
  need a food-trade network model — a much larger project, and one where the
  input data is genuinely contested.
- **Politics as a dynamic.** Crisis tempo is a knob, not an emergent property.
  Modelling it endogenously would be inventing rather than reporting.
- **Recovery beyond the first restart.** A world that rebuilds to full industry is
  treated as being back on the board with the same hazard rates. Whether a
  civilisation that has been through a collapse is more or less careful is a
  genuinely open question and the model declines to answer it.
- **Anything with a positive sign.** No hazard here can be retired permanently,
  even though several plausibly can be (a completed asteroid catalogue with a
  standing deflection capability comes close). The knobs let you approach it; the
  structure does not let you reach zero. That is a conservatism, and it is stated
  on the page.

## The deliverable is not the simulator

The simulator is stage one. The thing worth carrying away is the extracted rule of
thumb, and the one this build produced is the gap between the two rankings:

> The catastrophes you are most likely to live through are not the ones most
> likely to finish it.

That result is robust across most of the parameter space, which is what makes it
worth stating without the model attached. Anything else the page says should be
treated as conditional on its inputs — and the inputs are all on the screen.
