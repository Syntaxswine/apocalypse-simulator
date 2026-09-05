# EPISTEMIC MACHINERY FOR AN HONEST APOCALYPSE SIMULATOR

## 0. Method note, and what I could and could not retrieve

**Important constraint on this session:** the `WebSearch` tool returned `web search budget exhausted (200 of 200 calls)` on my first two attempts and never became available. DuckDuckGo (both `/html/` and `/lite/`) served CAPTCHA challenges, which I did not attempt to solve. I therefore substituted structured bibliographic APIs as the search layer — Crossref, OpenAlex, Europe PMC, the arXiv API — plus site-native search (`globalprioritiesinstitute.org/?s=anthropic`), and then fetched primary documents directly. Roughly a dozen distinct query operations and fifteen document fetches were performed.

**Primary sources actually retrieved and read this session** (full text unless noted):

1. Ćirković, Sandberg & Bostrom 2010, *Risk Analysis* 30(10):1495–1506 — full PDF, all 12 pages read.
2. Thomas, T. (2024), *Dispelling the Anthropic Shadow*, GPI Working Paper No. 20-2024 — full PDF read.
3. Thomas, T. (2021), *Doomsday and Objective Chance*, GPI Working Paper No. 2-2021 — front matter and framing read.
4. Snyder-Beattie, Ord & Bonsall 2019, *Scientific Reports* 9:11054 — abstract via Europe PMC, methods/results via PMC6667434.
5. Cirillo & Taleb 2020, *Nature Physics* 16:606–613, via arXiv:2004.08658 — full preprint read.
6. Corral, A. (2020), arXiv:2007.06876, "Scientific comment on 'Tail risk of contagious diseases'" — abstract.
7. Clauset, A. (2018), *Science Advances* 4:eaao3580 — abstract and quantitative results via PMC5834001.
8. Olum, K. (2000), "The doomsday argument and the number of possible observers", arXiv:gr-qc/0009081 — full PDF read.
9. Caves, C. (2000), *Contemporary Physics* 41:143–153 — abstract via arXiv:astro-ph/0001414.
10. Kučinskas, Rosenberg, Ceppas de Castro, Jacobs, Canedy, Tetlock & Karger (2025), *Assessing Near-Term Accuracy in the Existential Risk Persuasion Tournament*, FRI — full report front matter read.
11. Karger et al. (2023), *Forecasting Existential Risks: Evidence from a Long-Run Forecasting Tournament*, FRI Working Paper #1 — landing pages; the 700+ page PDF exceeded the fetch size limit.
12. Kemp et al. (2022), *PNAS* 119(34):e2108146119, "Climate Endgame" — via PMC9407216.
13. Ord, T., "The Precipice Revisited" (tobyord.com) — author's own restatement of four Table 6.1 figures.

**Explicitly NOT retrieved — do not treat any number in these categories as sourced:**

- **Sandberg & Bostrom's 2008 Global Catastrophic Risks conference survey (FHI Technical Report 2008-1).** The `fhi.ox.ac.uk` domain no longer resolves (`ENOTFOUND`), and `web.archive.org` is blocked for this tool. I have not reproduced its table and will not quote it from memory.
- **Grace et al. / AI Impacts expert surveys.** Not retrieved. No figures reported.
- **Ord 2020 Table 6.1 in full.** I obtained only four categories from Ord's own later restatement, plus the headline total via Wikipedia's citation of the book. The remaining rows are not sourced here.
- **Beard, Rowe & Fox, "An analysis and evaluation of methods currently used to quantify the likelihood of existential hazards"** (*Futures* 2019; reprinted open access in *An Anthology of Global Risk*, 2024, DOI 10.11647/obp.0360.06). Open Book Publishers returned HTTP 429 on four separate attempts. This is the single most on-point source for §4 that I failed to open; a follow-up session should retry it.

Throughout, I keep the three quantities the brief demands separate, and I label them **(a)** probability the event occurs, **(b)** probability of large-fraction mortality given occurrence, **(c)** probability of permanent human extinction given occurrence.

---

## 1. The anthropic shadow, and the 2024 rebuttal

### 1.1 What Ćirković, Sandberg & Bostrom actually claim

The paper is **Milan M. Ćirković (Astronomical Observatory of Belgrade), Anders Sandberg and Nick Bostrom (Future of Humanity Institute, Oxford), "Anthropic Shadow: Observation Selection Effects and Human Extinction Risks", *Risk Analysis*, Vol. 30, No. 10, 2010, pp. 1495–1506, DOI 10.1111/j.1539-6924.2010.01460.x.**

Their abstract states the thesis: "the frequencies of catastrophes that destroy or are otherwise incompatible with the existence of observers are systematically underestimated."

**The toy model (their §2).** Over a past interval, a global catastrophe occurs with prior probability *P*; given the catastrophe, humanity survives with probability *Q* (so 1−*Q* is the "extinction probability" of the event). *E* is the fact of our present existence. Bayes gives

> P(B₂ | E) = PQ / (1 − P + PQ)

They then define an **overconfidence parameter**

> η ≡ P(a priori) / P(a posteriori) = (1 − P + PQ) / Q

This η is the factor by which naive inference from the historical record understates the true rate.

**Their headline worked example, verbatim in substance:** "suppose Q = 0.1 and P = 0.5, corresponding to a fair-coin-toss chance that a Toba-scale event occurs once per 1 million (10⁶) years of human evolution, and that the probability of human survival following such an event is 0.1. The resulting value of the overconfidence parameter is η = 5.5, indicating that the actual probability of such an event is 5.5 times larger than our initial estimate." (p. 1497)

**The limiting claim.** They prove

> lim(Q→0) η = ∞

and gloss it: "*Overconfidence becomes very large for very destructive events.* As a consequence, we should have no confidence in historically based probability estimates for events that would certainly extinguish humanity (Q = 0)." (p. 1497)

Note carefully what η is and is not. η is unbounded as the event's lethality approaches certainty, but it is *not* large for events we could survive: for large *Q*, η → 1. **The claimed bias is concentrated entirely in category (c)-type events and is negligible for category (b) events.** Their Fig. 2 plots η against extinction probability 1−Q for P = 0.001, 0.1, 0.5, 0.9, and the curves are near-flat until 1−Q approaches 1.

**The generalised model (their §3).** With α the inherent per-slot probability of a disaster, β the probability a disaster is lethal, and *N* slots, the probability an observer sees *k* disasters is Binomial-like:

> P(k, O | α, β) = C(N,k) α^k (1−α)^(N−k) (1−β)^k

and under uniform priors on (α, β), P(O, k) = 1 / [(1+k)(1+N)].

**Which hazards they say are affected (their §5).** The bias applies to hazards that (1) could have destroyed our species or its predecessors, (2) are sufficiently uncertain, and (3) have frequency estimates largely based on terrestrial records. They list: asteroidal/cometary impacts, supervolcanic episodes, supernovae/gamma-ray bursts, superstrong solar flares. They exempt hazards with independent external evidence — e.g. supernova/GRB rates inferred from *other* galaxies, and close-stellar-passage risk constrained by the observed stellar mass function of the solar neighbourhood: "because we have some knowledge of the solar neighborhood in the Milky Way … our estimate of these risks will not be appreciably affected by anthropic bias." Their Fig. 8 is the empirical illustration: crater diameter vs. age from the Earth Impact Database, showing an empty upper-right region — no large, recent craters.

**Their strongest applied claim** is against Hut & Rees's argument (*Nature* 1983, 302:508–509) that cosmic-ray bombardment of the Earth and Moon over ~4.5 Gyr proves particle colliders are safe: "A vacuum phase transition is an event for which Q = 0. Probability estimates based on observations of the Earth's and Moon's existence are thus completely unreliable." They extend the same criticism to the 2008 LHC Safety Assessment Group report. They approve of Tegmark & Bostrom's (2005, *Nature* 438:754) circumvention, which infers the rate from the planetary-age distribution and Earth's formation date rather than from mere survival, reporting that "the rate of vacuum phase transitions from the volume of the Milky Way is less than 10⁻⁹ per year."

They also quote Hut & Rees's own sensitivity claim: "if the probability of a high-energy physics disaster is 10⁻⁵⁰ per year, then a doubling or even 10-fold increase of the risk through deliberate human activities is arguably trivial."

### 1.2 The rebuttal: Thomas 2024

The paper you were told about exists but is titled differently. It is **Teruji Thomas (Global Priorities Institute, Faculty of Philosophy, University of Oxford), "Dispelling the Anthropic Shadow", GPI Working Paper No. 20-2024, September 2024**, PDF at `https://globalprioritiesinstitute.org/wp-content/uploads/Dispelling-the-Anthropic-Shadow-Teruji-Thomas.pdf`. It is **single-authored**, not "Thomas and collaborators" (he thanks Andreas Mogensen and Toby Ord for comments). There is no paper titled "Against Anthropic Shadow" in Crossref, OpenAlex, or the GPI publications list; if the brief's title came from a memory or a forum post, this is the paper it refers to.

**Abstract, verbatim:** "There are some possible events that we could not possibly discover in our past. We could not discover an omnicidal catastrophe, an event so destructive that it permanently wiped out life on Earth. Had such a catastrophe occurred, we wouldn't be here to find out. This space of unobservable histories has been called *the anthropic shadow*. Several authors claim that the anthropic shadow leads to an 'observation selection bias', analogous to survivorship bias, when we use the historical record to estimate catastrophic risks. I argue against this claim."

**The core argument, in his own three-line summary** (taking a "potentially omnicidal event" to be one with a 10% chance of permanently ending life):

> (A) The fact that life has survived so long is evidence that the rate of potentially omnicidal events is low.
> (B) Given the fact that life has survived so long, historical frequencies provide evidence for a true rate rather higher than the observed rate.
> (C) These two effects cancel out, so that, overall, the historical record provides evidence for a true rate close to the observed rate.

He states the diagnosis directly: "the authors quoted above are too focused on (B) … focusing on (B) neglects the base-rate provided by (A)." And in his conclusion: "analyses that do claim to find an effect of the anthropic shadow are misleading because of a form of base-rate neglect."

**The mechanism.** Thomas's "Supervolcano" model reproduces Ćirković et al.'s setup, then isolates the alleged difference with two intermediate cases. "The Martians" is a parallel population on Mars whose existence does *not* depend on Earth's eruption history — Jill the Martian can observe fatal eruptions, Jack the Earthling cannot. "Barking Dog" is an ordinary coin-flip experiment in which a dog barks with probability 1−*q* per head. The decisive algebraic point: conditional on the observed frequency *F* = *f*, the probability of no barks is

> Pr(NO BARK | F = f, P = p) = q^(fn)

which **does not depend on *p* at all**. So once you know the frequency, the non-occurrence of the catastrophic marker carries no further information about the rate. His conclusion for the pair: "Jack and Jill have essentially the same evidence about" the rate. Or as he puts it in the introduction: "The fact that we could not easily have had different evidence is not important in itself."

He is careful about the Q = 0 case, and this is worth quoting for the simulator's sake: with Q = 0, Jack knows *a priori* that F = 0, so he "should therefore be confident that P is close to 0 … Of course, 0 is the lowest possible value for P, so, even on my view, this observed frequency will probably be an underestimate. But this has nothing to do with the anthropic shadow. Consider witnessing a coin land tails 1,000 times in a row."

**The formal refutation of Snyder-Beattie et al.** This is the most simulator-relevant part, because it is arithmetic, not intuition. Snyder-Beattie et al. tried to correct for the shadow by conditioning on "observerhood was reached", using

> ℒ\*(μ₀) := Pr(T ≥ t_now | T ≥ S, μ = μ₀)

Thomas argues two things are wrong: T ≥ S is itself evidence, and we actually know the stronger conjunction T ≥ t_now ≥ S. The correct likelihood is therefore

> ℒ\*\*(μ₀) := Pr(T ≥ t_now ≥ S | μ = μ₀) = F_S(t_now) × ℒ(μ₀)

and since F_S(t_now) does not depend on μ₀, **ℒ\*\* is just ℒ times a constant.** His verdict: "the estimates for μ that we get using ℒ\*\* will be exactly the same as the ones we were getting using ℒ, before we tried to take observation selection effects into account… There are no observation selection effects, as far as this model goes."

**The same for Tegmark & Bostrom.** Their shadow-corrected likelihood yields, in their own frequentist phrasing, "we can rule out the hypothesis that τ < 2.5 Gyr with 95% confidence". Thomas's ℒ\*\* using all the evidence (T_v ≥ 13.7 Gyr, T_f ≈ 9.1 Gyr, T_o ≈ 4.5 Gyr) gives instead **τ ≥ 4.5 Gyr** at the same threshold. Note the *direction*: the shadow correction made the risk look **larger** than the full evidence supports. This is a concrete instance of the correction being a doom-generator.

**Where the dispute is genuinely open.** Thomas concedes the argument rests on a contested premise: whether one should align credences with known chances (his principle `(*)`, Pr(HEADS | P = p) = p) in a situation where one lacks self-locating evidence. He notes `(*)` and the self-ignorant `(**)` "are not generally compatible", that this is a version of the doomsday argument and of Sleeping Beauty, and that "this is bound to be one of the points of controversy." So: **the shadow's magnitude is hostage to an unresolved question in anthropic epistemology (SSA vs. SIA vs. chance-deference), and any simulator that hard-codes one answer is smuggling in a philosophical commitment.**

### 1.3 Verdict for the simulator

There are three defensible positions, and they differ by roughly an order of magnitude in what they say about natural (c)-class rates:

| Position | Correction to historically-inferred natural rate |
|---|---|
| Ćirković et al. 2010 | multiply by η = (1−P+PQ)/Q; unbounded as Q → 0 |
| Thomas 2024 | multiply by 1 (no correction); for the specific models examined, exactly 1 |
| Agnostic | treat the correction factor as an uncertain parameter with support spanning both |

The honest simulator implements the third. It also **does not apply any shadow correction to (b)-class events at all** — even on Ćirković et al.'s own formula, η ≈ 1 for survivable catastrophes — and it applies no correction to anthropogenic risks, which by construction have no past record for the shadow to censor.

---

## 2. Laplace's rule of succession, Gott, and the Doomsday Argument

### 2.1 Laplace's rule, and why it is only an upper bound

Laplace's rule of succession: after *n* independent trials with zero failures and a uniform prior on the failure rate, the posterior mean probability of failure on the next trial is **1/(n+2)**.

**These next figures are author-computed arithmetic from the rule, not quotations from a source.** Treating each year of *Homo sapiens*'s ~200,000-year record as a trial with no extinction: 1/200,002 ≈ **5.0 × 10⁻⁶ per year**, ≈ 5 × 10⁻⁴ per century. Using the ~2-Myr record of the genus *Homo*: ≈ **5 × 10⁻⁷ per year**.

Two things to say about this. First, it is **consistent with the peer-reviewed bound**: Snyder-Beattie, Ord & Bonsall (2019) conclude "the probability that humanity goes extinct from natural causes in any given year is almost guaranteed to be less than one in 14,000, and likely to be less than one in 87,000" (μ < 6.9 × 10⁻⁵ at a 10⁻⁶ relative-likelihood threshold; μ < 1.2 × 10⁻⁵ at 10⁻¹), and "an annual probability of natural extinction likely below one in 870,000" for the genus. The Laplace point estimate sits below both bounds, as it should.

Second, and this is the point the brief asks for: **it is a weak upper bound and nothing more, for four separate reasons.**

- The uniform prior is an assumption, not a finding. Snyder-Beattie et al. deliberately avoid one, reporting relative likelihoods instead: "the evidence T ≥ t_now supports a low value of μ ≈ 10⁻⁸ a million times more strongly than it supports a high value of μ ≈ 7 × 10⁻⁵" (Thomas's exposition of their model). A likelihood ratio is not a posterior; a strong prior favouring high μ can still land you above 7 × 10⁻⁵.
- It assumes **stationarity**, and the paper says exactly where that breaks: the bounds "only apply to extinction risks that have either remained constant or declined over human history", and "No similar guarantee can be made for risks that our ancestors did not face, such as anthropogenic climate change or nuclear/biological warfare." A rule-of-succession bound is *silent* about every risk invented after 1945.
- The choice of trial unit and reference class moves the answer by an order of magnitude (200 kyr vs. 2 Myr; *sapiens* vs. *Homo*; "extinction" vs. "civilisational collapse").
- It bounds only (c). It says nothing about (a) or (b).

Snyder-Beattie et al.'s own robustness work is worth copying into the simulator's design. They build four models of when a species becomes an "observer" — Model 1 constant-rate (exponential), Model 2 increasing-rate (Weibull, k > 1), Model 3 sequential steps (Erlang), Model 4 fixed deterministic time τ — and find that even the extreme Model 4 only loosens the bounds by a factor of **~1.2× to 2×**. Their reasoning: "if the extinction rate were exceptionally high, the lucky humans that do successfully survive to observerhood will have achieved such a status unusually quickly." Their cross-check against mammalian background rates: median **1.8 extinctions per million species-years (E/MSY), i.e. μ = 1.8 × 10⁻⁶**; molecular-phylogenetic estimates of 0.023 E/MSY for mammals and 0.219–0.359 E/MSY for primates. All comfortably under the bound.

### 2.2 Gott and the Doomsday Argument

**Gott, J. R. III (1993), "Implications of the Copernican principle for our future prospects", *Nature* 363:315–319, DOI 10.1038/363315a0** (citation confirmed via Crossref this session).

The delta-t argument, as set out by Olum (2000) §I: if you observe a phenomenon at a random point in its lifetime *T*, then with 95% probability 0.025*T* < t_past < 0.975*T*, which rearranges to

> t_past / 39 < t_future < 39 × t_past

"Applying this to the human species, Gott uses t_past ≈ 200,000 years to conclude that there is a 95% probability that the future lifetime of our species will be between **5,100 and 7.8 × 10⁶ years**."

The Carter–Leslie form runs through the **Self-Sampling Assumption**, which Olum quotes from Bostrom: "Every observer should reason as if they were a random sample drawn from the set of all observers." With ~6 × 10¹⁰ humans born so far, and a choice between total-ever-born of 2 × 10¹¹ (short) and 2 × 10¹⁴ (long), P(N|S) = 1000 × P(N|L), so

> P(S|N) = P_prior(S) / [P_prior(S) + 10⁻³ P_prior(L)]

and "Unless you started with P_prior(S) ~ 10⁻³ or less, you will find that the chance of a short-lived race is nearly 1."

**Objection 1 — the Self-Indication Assumption.** Olum's paper is the canonical statement. "In the scenario where the human race is very long-lived and there are many humans altogether, there is a greater 'chance to exist at all' than in the scenario where the race is soon to die out." Weighting the prior by the number of observers, P(a|I) ∝ N_total(a) P_prior(a), gives

> P(a|N) ∝ P(N|a) N_total(a) P_prior(a) ∝ P_prior(a)

His conclusion, verbatim: "Thus the increased chance of finding oneself in a long-lived race, because it contains more observers, exactly cancels the decreased chance of finding oneself with a particular N in the long-lived race. The chance of the race dying out quickly is thus the prior chance of such an event, whatever one computes that to be based on one's estimation of the various possible disasters. **The doomsday argument does not modify the conclusion.**" He credits Dieks with the original observation and notes Leslie and Bostrom criticise it, Kopf/Krtous/Page and Bartha/Hitchcock defend it. His "God's Coin Toss" case makes the disagreement crisp: on SSA you end up at 0.99 for heads, on SIA at exactly 1/2.

**Objection 2 — the reference class.** Bostrom's SSA is stated over "the set of all observers", and the answer changes depending on whether that set is *Homo sapiens*, all hominins, all sentient beings, all observer-moments, or all beings that could inspect their own track record. Thomas 2024 footnote 8 flags the same structural issue in a different guise: "the relevant thing is not ultimately the number of observers but the number of 'observer-moments' (people at times)."

**Objection 3 — Gott's version is not universally valid.** Caves, C. M. (2000), "Predicting future duration from present age: a critical assessment", *Contemporary Physics* 41:143–153, arXiv:astro-ph/0001414: "Though Gott's proposal contains a grain of truth, it does not have the universal predictive power that he attributes to it."

**Objection 4 — chance-deference dissolves it.** Thomas, T. (2021), *Doomsday and Objective Chance*, GPI WP 2-2021: he develops a version of Lewis's Principal Principle that "yields the thirder solution to Sleeping Beauty, and denies that Doomsday is especially close at hand", unifying SSA and SIA under a principle he calls Proportionality.

### 2.3 Verdict for the simulator

Gott's interval and the Carter–Leslie shift are **not usable as risk inputs**. They are underdetermined by an unresolved choice (SSA/SIA/Proportionality) that flips the answer between "doom is near" and "no update at all". A simulator that ships a doomsday-argument term has shipped a philosophical position as a number.

---

## 3. Fat tails: why the mean is the wrong statistic, and why the record truncates exactly the events we care about

### 3.1 Pandemics — the strongest published case, and its rebuttal

**Cirillo, P. & Taleb, N. N. (2020), "Tail Risk of Contagious Diseases", *Nature Physics* 16:606–613, DOI 10.1038/s41567-020-0921-x**; preprint arXiv:2004.08658, read in full.

Dataset: **72 epidemics with more than 1,000 estimated victims, 429 BC to 2020.**

The naive descriptive statistics, verbatim: "the sample average is 4.9M, while the median is 76K… The 90% quantile is 6.5M and the 99% quantile is 137.5M. The sample standard deviation is 19M." A distribution whose mean is 64× its median is not summarisable by its mean.

The formal diagnosis: the Maximum-to-Sum plot "clearly shows that no finite moment is likely to exist for the number of victims in pandemics, as the R_n ratio does not converge to 0 for p = 1, 2, 3, 4, no matter how many data points we use. Such a behavior hints that the victims distribution has such a fat right tail that not even the first theoretical moment is finite. We are looking at a phenomenon for which observed quantities such as the naive sample average and standard deviation are therefore meaningless for inference."

The EVT fit, on the dual-transformed data (their eq. 1 log-transformation, which respects the finite upper bound of world population): "the best GPD fit threshold is around 200K victims, with 34.7% of the observations lying above. For what concerns the GPD parameters, we estimate **ξ = 1.62 (standard error 0.52)**, and **β = 1,174.7K (standard error 536.5K)**." Since ξ = 1/α, ξ > 1 implies α < 1, i.e. an apparently infinite mean.

The corrected expectation: "For actual data we get a shadow mean of **20.1M**, which is definitely larger (almost 1.5 times) than the corresponding sample tail mean of 13.9M… Combining the shadow mean with the sample mean below the 200K threshold, we get an overall mean of **7M instead of the naive 4.9M**. It is therefore important to stress that a naive use of the sample mean would induce an underestimation of risk, and would also be statistically incorrect."

Robustness: 10,000 perturbed copies with each observation allowed to vary ±20% give ξ "always above 1 … the average value is **1.62 (standard deviation 0.10)**"; a jackknife dropping 1–7 observations at random gives the same message.

Their two policy claims, both directly relevant to simulator architecture:

> "epidemiological models like the SIR differential equations, sometimes supplemented with simulative experiments, while useful for scientific discussions for the bulk of the distribution of infections and deaths, or to understand the dynamics of events after they happened, should never be used for precautionary risk management, which should focus on maxima and tail exposures instead."

> "Owing to the compounding effect of parameters' uncertainty, the 'tail wagging the dog' effect easily invalidates both point estimates and scenario analyses."

**And now the rebuttal, which an honest simulator must carry.** Corral, A. (2020), "Scientific comment on 'Tail risk of contagious diseases'", arXiv:2007.06876: "Reanalyzing the same data, we find that, although the data may be compatible with a power-law tail, these results are not conclusive, and other distributions, not fat-tailed, could explain the data equally well. Simulation of a log-normally distributed random variable provides synthetic data whose statistics are undistinguishable from the statistics of the empirical data."

This is the central epistemic fact about tail estimation: **with n = 72 and 25 exceedances above threshold, a lognormal and a power law are not distinguishable.** The tail index is the parameter your answer is most sensitive to and the one your data least constrains.

### 3.2 Wars — the cleanest quantification of "the record is too short"

**Clauset, A. (2018), "Trends and fluctuations in the severity of interstate wars", *Science Advances* 4:eaao3580, DOI 10.1126/sciadv.aao3580** (PMC5834001).

Dataset: Correlates of War interstate conflicts, **1823–2003, 95 wars, 1,000 to 16,634,907 battle deaths.**

Fit: "maximum likelihood power-law parameter is α̂ = **1.53 ± 0.07** for wars with severity x ≥ x_min = 7061", with "95% of the bootstrap distribution of α̂ falls within the interval **[1.37, 1.76]**." Since α̂ < 2, the mean does not exist.

Forward projections: for a war at least as large as WWII, "p\* = **0.43 ± 0.01**" over the next 100 years, with "expected number of these events over the next 100 years is **0.62 ± 0.01**." For a billion-death war, "the median forecasted waiting time for such an event is **1339 years**" with "5 to 95% quantiles ranging from **383 to 11,489 years**."

And the result that should govern how a simulator treats trend claims: "the long peace would need to hold for at least another 100 years before it would become statistically unusual", with the crossing points "around **100 to 140 years** in the future for models 1 and 2."

That is the truncation problem stated as a number. **Seventy-three years of post-1945 peace is not enough data to reject stationarity.** Any simulator that treats an observed quiet period as evidence of a regime change is, on this evidence, reading noise.

### 3.3 The structural point

Three distinct censorings compound in the historical severity record, and they are not the same thing:

1. **Classical taphonomic loss** — erosion, missing craters, undated events. Ćirković et al. explicitly separate this from anthropic censoring: "Anthropic shadow is cumulative with the 'classical' selection effects applicable to any sort of event."
2. **Reporting-threshold truncation** — Cirillo & Taleb "only refer to events with more than 1K estimated victims"; Clauset's x_min = 7,061. The left tail is cut off by construction, which is fine, but it means the fitted distribution describes only exceedances.
3. **The upper bound is real and matters.** Cirillo & Taleb's dual-distribution device exists precisely because "no disease can kill more people than those living on the planet at a given time" — H = 7.7 billion. "A bounded tail with very large upper limit is therefore mistakenly taken for an unbounded one, and no model will be able to see the difference, even if epistemologically we are in two extremely different situations." **For an extinction simulator this is not a technicality: the difference between "infinite-mean power law" and "power law truncated at world population" is the difference between a doom-generator and a model.**

---

## 4. Correlation between risks

This is the section where the published literature is thinnest and where I most want to flag the gap: **the Beard, Rowe & Fox chapter, the best direct treatment, returned HTTP 429 on every attempt.** What follows separates what I retrieved from what is arithmetic.

### 4.1 The arithmetic (author-derived, not a citation)

For any set of hazards with marginal existential probabilities p_i, the probability that at least one occurs is 1 − Π(1 − p_i) under independence, which is **strictly less than Σ p_i**. With Ord's four published figures — unaligned AI 1/10, pandemics 1/30, nuclear 1/1,000, climate 1/1,000 — Σ p_i ≈ 0.1353 while the independent union ≈ 0.1288, about 5% lower. Positive correlation between hazards pushes the union *further below* the sum, because correlated hazards co-occur and their "successes" overlap.

So on the stated events, **summing overstates.** But the effect is small at these magnitudes, and it is not the important error.

### 4.2 The important error runs the other way

The decomposition itself is lossy. Each p_i is assessed as "*this hazard, by itself, permanently ends humanity*". The union of those events omits every **compound pathway**: a nuclear exchange that is survivable alone, followed by a pandemic that is survivable alone, in a world whose agricultural and medical systems have already been destroyed. No p_i contains that scenario, so the union of the p_i **understates** total (c)-class risk.

This is exactly Kemp et al.'s point. **Kemp, Xu, Depledge, Ebi, Gibbins, Kohler, Rockström, Scheffer, Schellnhuber, Steffen & Lenton (2022), "Climate Endgame: Exploring catastrophic climate change scenarios", *PNAS* 119(34):e2108146119**:

> "A thorough risk assessment would need to consider how risks spread, interact, amplify, and are aggravated by human responses"

> "compound hazard analyses of interacting climate hazards and drivers are underused. Yet this is how risk unfolds in the real world."

Their worked illustration is a cyclone destroying infrastructure and leaving the population exposed to a subsequent heat wave. They also state the fat-tail point independently: "We know that temperature rise has 'fat tails': low-probability, high-impact extreme outcomes", and that "climate damages are likely to be nonlinear and result in an even larger tail." Their quantitative anchor: under SSP3-7.0, **~2 billion people** projected to live in areas with mean annual temperature >29 °C by 2070, versus **30 million** today; they define "extreme climate change" as ≥3 °C by 2100.

The complementary framing is Avin, Wintle, Weitzdörfer, Ó hÉigeartaigh, Sutherland & Rees (2018), "Classifying global catastrophic risks", *Futures*, DOI 10.1016/j.futures.2018.02.001 — which classifies by **critical system affected, global spread mechanism, and prevention/mitigation failure** rather than by hazard, precisely so that risks sharing a mechanism are not counted as independent. I confirmed the citation via OpenAlex but ScienceDirect returned 403; I have not read the text and quote nothing from it.

### 4.3 On Ord's total

Ord's headline total is **"a 1 in 6 total risk of existential catastrophe occurring in the next century"**, with unaligned AI at **"1 in 10 over the next century, higher than all other sources of existential risk combined"** — I retrieved these via Wikipedia's citation of *The Precipice* (2020), not the book itself, so treat them as reported-via-secondary.

Ord's own restatement in "The Precipice Revisited" (tobyord.com) confirms four figures directly from the author: "These were **1 in 1,000 for Climate and for Nuclear, 1 in 30 for Pandemics and 1 in 10 for Unaligned AI**." He adds that the figures "are all rounded off (usually to the nearest factor of 10)". His post-publication directional revisions: climate risk down ("moving towards the middle of the range means lower existential risk"); nuclear risk up ("A Russian invasion of a European country, leading to a proxy war with the US. The only remaining arms control treaty due to expire… While civil society actors working to limit these risks see their funding halve. Nuclear risk is up."); pandemics and AI "mixed — lots of changes, but no clear direction for the overall risk."

Two observations for the simulator. First, **the rounding is to the nearest factor of ten**, so any simulator arithmetic that treats 1/30 and 1/1,000 as precise to two significant figures is manufacturing precision the author disclaims. Second, if the total is 1/6 ≈ 0.167 while the four published components sum to ≈ 0.135, the residual sits in categories I could not retrieve — which is itself informative: **a substantial fraction of the headline total is not attributable to any named hazard.**

---

## 5. Calibration on long-horizon, low-probability events

### 5.1 What the XPT measured

**Karger, E., Rosenberg, J., Jacobs, Z., Hickman, M., Hadshar, R., Gamin, K., Smith, T., Williams, B., McCaslin, T., Thomas, S., & Tetlock, P. E. (2023), "Forecasting Existential Risks: Evidence from a Long-Run Forecasting Tournament", Forecasting Research Institute Working Paper #1**, published 10 July 2023, revised 8 August 2023. (The 7.5 MB report PDF exceeded the fetch size cap; figures below come from FRI's own pages and from the 2025 follow-up report, which restates them.)

Design: **169 participants, June–October 2022 — 89 superforecasters and 80 domain experts.** 59 forecasting questions decomposing into 172 subquestions, resolving from mid-2024 to 2100. The tournament "incentivized accurate forecasting and persuasive argumentation".

Headline medians, by 2100 (from the 2025 follow-up's Introduction, quoting the original):

| | Global catastrophe (≥10% of world population dies) | Human extinction |
|---|---|---|
| **Domain experts** (median) | **20%** | **6%** |
| **Superforecasters** (median) | **9%** | **1%** |

"This held across domains, though not uniformly: superforecasters and experts were much further apart on risk related to AI than on the risk of nuclear war."

Note that this table is exactly the (b) vs. (c) distinction, and note the ratio: experts put extinction at 30% of catastrophe; superforecasters at 11%. **The two groups disagree not just about magnitude but about conditional lethality.**

**Expert-pool composition, which is a selection effect a simulator should record rather than launder:** "32 AI experts, 12 biorisk experts, 12 nuclear experts, 9 climate experts, and 15 'general' experts who study existential risks more broadly… Many in the expert pool were affiliated with the Effective Altruism (EA) community; **42% of experts participating in the XPT reported having attended an EA meetup in the past.**"

### 5.2 Persuasion failed

The original report's own abstract: "We document **large-scale disagreement and minimal convergence of beliefs** over the course of the XPT, with the largest disagreement about risks from artificial intelligence." And it poses the puzzle rather than solving it: "why did rational forecasters, incentivized by the XPT to persuade each other, not converge after months of debate and the exchange of millions of words and thousands of forecasts?"

This is the single most important empirical fact in the whole brief. **Months of incentivised argument between two groups of able, motivated people moved the extinction estimates from 6% vs. 1% essentially not at all.** Whatever the disagreement is about, it is not about anything that was resolved by exchanging arguments.

### 5.3 And near-term skill does not transfer

**Kučinskas, S., Rosenberg, J., Ceppas de Castro, R., Jacobs, Z., Canedy, J., Tetlock, P. E., & Karger, E. (2025), "Assessing Near-Term Accuracy in the Existential Risk Persuasion Tournament", Forecasting Research Institute**, first released 2 September 2025. Analyses the **38 subquestions (32 questions) that had resolved as of mid-2025**.

Findings, from the abstract verbatim:

- "(a) there was overall performance parity between superforecasters and domain experts, with both groups underestimating AI progress and overestimating improvements in climate technology"
- "(b) both superforecasters and domain experts substantially outperformed a baseline of educated members of the general public" — the public scored **1.82 standard deviations** below the median XPT participant
- "(c) at the individual level, **the median superforecaster and median domain expert performed statistically indistinguishably from simple extrapolation algorithms**"
- "(d) at the aggregate level, superforecasters and domain experts showed improved accuracy" — median aggregation improved accuracy "by roughly 1 standard deviation"
- "(e) **there was no statistically significant correlation between near-term accuracy and long-term existential risk forecasts**"

The report's own gloss on (e): "Ideally, we would use near-term forecasting ability to assess the reliability of forecasts about humanity's long-term future. Unfortunately, in our XPT data, near-term forecasting accuracy did not consistently align with any particular position on long-term risks. Overall, near-term forecasting accuracy provides limited evidence at present for identifying who makes the most credible long-term risk forecasts."

Also worth noting for scale: the spread between the most- and least-accurate XPT participant groups "spanned just **0.18 standard deviations**".

### 5.4 The one directional bias that was measured

This is usable, because it is signed and quantified. On AI, both groups were **too pessimistic about capability progress**: for MATH, MMLU and QuALITY, domain experts assigned **21.4%, 25.0% and 43.5%** to the outcomes actually achieved by end-2024; superforecasters **9.3%, 7.2% and 20.1%**. On the International Mathematical Olympiad — AI reaching gold-level in July 2025 — domain experts assigned **8.6%**, superforecasters **2.3%**. Across the four AI benchmarks: superforecasters averaged **9.7%** on realised outcomes, experts **24.6%**.

On climate technology, the bias ran the other way — too optimistic. Renewable-electricity hydrogen in 2024 actually cost **$7.50/kg** against median forecasts of **$4.50** (superforecasters) and **$3.50** (experts). Direct air capture reached **0.01 MtCO₂/yr** against medians of **0.32** and **0.60**.

Also note the timing caveat the report itself raises: "the XPT tournament concluded prior to the public release of ChatGPT in November 2022."

---

## 6. The "we have survived N years therefore the rate is low" fallacy, and its correct form

**The fallacious form.** "Life on Earth has survived 4 billion years; therefore sterilising events are extremely rare; therefore we are safe." Tegmark & Bostrom's *Nature* statement of why this fails, quoted in Thomas 2024: "this argument is flawed because it fails to take into account an observation-selection effect… If it takes at least 4.6 Gyr for intelligent observers to arise, then the mere observation that Earth has survived for this duration cannot even give us grounds for rejecting with 99% confidence the hypothesis that the average cosmic neighbourhood is typically sterilized, say, every 1,000 years."

**But there are actually four distinct errors bundled here, and they do not all survive scrutiny:**

1. **Treating "no event observed" as "rate ≈ 0".** Always wrong, no anthropics required. Zero observed failures in n trials gives an upper bound, not a point estimate. This is the error Laplace's rule fixes.
2. **Applying a past-derived rate to a hazard class that did not exist in the past.** Always wrong, and the one that matters most for a simulator. Snyder-Beattie et al. state it flatly: "No similar guarantee can be made for risks that our ancestors did not face."
3. **Ignoring truncation of the severity record.** Real and quantified (§3): the record cuts off below a reporting threshold and cannot resolve the difference between an unbounded and a population-bounded tail.
4. **The anthropic-shadow error proper.** **Contested.** Thomas 2024 argues it is not an error at all in the models where it has been claimed — for Snyder-Beattie's model, ℒ\*\* = F_S(t_now) × ℒ with F_S independent of μ, so the "corrected" estimate is identical to the naive one.

**The correct form.** Survival to time *t* under a constant-rate model delivers a likelihood over rate hypotheses, ℒ(μ₀) = e^(−μ₀ t). That likelihood:

- **is evidence, not a point estimate** — it must be combined with a prior, and the answer depends on that prior. Snyder-Beattie et al. sidestep this by reporting likelihood ratios ("supports μ ≈ 10⁻⁸ a million times more strongly than μ ≈ 7 × 10⁻⁵") and Thomas notes the necessary caveat: "if one's prior over values of μ strongly favoured high values, then one might still end up confident in values higher than 7 × 10⁻⁵."
- **constrains only the hazard classes that were operating throughout *t***.
- **bounds only (c)**, and bounds it from above.
- **is not, on Thomas's analysis, in need of an anthropic correction** — but you should carry the uncertainty about that, because the question turns on a live dispute in anthropic epistemology.

And Thomas's own honest concession, which belongs in the simulator's documentation: even on his deflationary view, when Q = 0 the observed frequency will "probably be an underestimate" — but for the boring reason that zero is the floor, not because of any selection effect. "Consider witnessing a coin land tails 1,000 times in a row."

---

## CONCRETE MODELLING RULES

These are the deliverable. Each rule names the error it prevents and the source that motivates it.

**On the anthropic shadow**

1. **Make the shadow a parameter, not a constant.** Ship a scalar `shadow_factor` applied to natural (c)-class rates, with a prior spanning `1.0` (Thomas 2024) to `η = (1−P+PQ)/Q` (Ćirković et al. 2010). Never hard-code either. Report results as a two-branch sensitivity, and say which branch each headline number came from.

2. **Never apply a shadow correction to (b)-class events.** Even on Ćirković et al.'s own formula, η → 1 as Q → 1. A shadow correction applied to "kills 10% of humanity" is unsupported by the paper that invented the concept.

3. **Never apply a shadow correction to anthropogenic risks.** There is no censored historical record for AI, engineered pathogens, or nuclear war. Ćirković et al. themselves restrict the effect to hazards "for which frequency estimates are largely based on terrestrial records".

4. **Reduce the shadow correction to zero for any hazard with independent, non-terrestrial evidence.** Ćirković et al. exempt supernova/GRB rates (inferred from other galaxies) and close-stellar-passage risk (constrained by the stellar mass function). Encode this as a per-hazard `evidence_is_external` flag that suppresses the correction.

5. **Before applying any shadow correction, check whether it moves the answer toward more risk than the full evidence supports.** Thomas's Tegmark–Bostrom result is the test case: the "corrected" bound was τ ≥ 2.5 Gyr; using all the evidence gives τ ≥ 4.5 Gyr. A correction that only ever increases risk is a doom-generator, not a debiasing step. Instrument the sign of every correction and log it.

**On survival-record inference**

6. **Emit a likelihood function over rates, never a single rate.** For every hazard estimated from a survival record, store ℒ(μ) = e^(−μt) and the prior separately, so a user can vary the prior and see the answer move. Report likelihood ratios alongside posteriors, as Snyder-Beattie et al. do.

7. **Hard-partition hazards into "has a past record" and "does not".** No rule-of-succession, Laplace, Gott or survival bound may propagate into a hazard flagged as post-1945. Snyder-Beattie et al.'s bound of 1-in-14,000/yr is a bound on *natural* extinction and nothing else; the simulator must refuse to let it constrain the AI or bio branches.

8. **Record the reference class as an explicit field and sweep it.** 200 kyr (*sapiens*) vs. 2 Myr (*Homo*) moves the natural background bound by a factor of ten (1-in-87,000 vs. 1-in-870,000 per year). If a headline number changes when you change the reference class, say so in the output.

9. **Never ship a Doomsday-Argument term.** Gott's 5,100–7.8 Myr interval and the Carter–Leslie shift are underdetermined by the SSA/SIA choice, which Olum shows "exactly cancels" the doomsday update. If a user wants the term, expose it as an opt-in toggle with a warning naming the dispute — do not bake it into a default.

**On severity distributions**

10. **Model severity with an explicit tail parameter and propagate its uncertainty.** Use the published estimates as priors, not point values: wars α̂ = 1.53, bootstrap 95% CI [1.37, 1.76] (Clauset 2018); pandemics ξ = 1.62, SE 0.52 (Cirillo & Taleb 2020). Sampling α at its point estimate and calling the run "uncertainty-quantified" is the most common lie in this genre.

11. **Always impose the population upper bound, and always report the truncated and untruncated answers side by side.** "no disease can kill more people than those living on the planet" (Cirillo & Taleb). The gap between the "apparent tail" and the "real tail with smooth truncation" is where an unbounded-power-law simulator manufactures its extinctions.

12. **Never report a mean severity as a headline.** Where α < 2 or ξ > 1 the mean does not exist. Report the median, selected quantiles, and the exceedance probability for named thresholds. Cirillo & Taleb's own case: mean 4.9M, median 76K, 99% quantile 137.5M — three numbers that tell three different stories, and only two of them are meaningful.

13. **Carry the tail-shape rebuttal in the model, not the footnotes.** Corral (2020) showed the same pandemic data are "undistinguishable" from a lognormal. Fit both a power-law and a lognormal tail, run both, and report the spread as a first-class output. If your conclusion flips between them, that is the finding.

14. **Do not let compartmental or process models set the tail.** "epidemiological models like the SIR differential equations… should never be used for precautionary risk management, which should focus on maxima and tail exposures instead" (Cirillo & Taleb). Use the mechanistic model for the bulk and an EVT layer for the tail, and make the handover threshold an explicit, visible parameter.

15. **Build a trend-detectability check and refuse trend claims that fail it.** Before the simulator is allowed to say "risk has declined since year X", it must compute how long the quiet period would have to last to be statistically distinguishable from a stationary process. Clauset's answer for the long peace was **another 100–140 years**. If the required horizon exceeds the observed one, the model must report "not detectable", not "declining".

**On combining risks**

16. **Never sum marginal probabilities. Use 1 − Π(1 − p_i) as the floor, and treat that as a lower bound on total risk, not the answer.** The arithmetic gap is small at Ord's magnitudes (0.135 vs. 0.129), so the sum is not the dangerous error — the decomposition is.

17. **Add explicit compound pathways as first-class events.** Model "hazard A degrades critical system S; hazard B, survivable in an intact world, is unsurvivable in the degraded one." These pathways are in no marginal p_i, and Kemp et al. name their omission directly: "compound hazard analyses of interacting climate hazards and drivers are underused. Yet this is how risk unfolds in the real world."

18. **Index hazards by shared mechanism, not only by cause.** Follow Avin et al.'s axes — critical system affected, global spread mechanism, prevention/mitigation failure — so two hazards that fail through the same system are automatically correlated in the model rather than independently sampled. (Citation verified; text not read this session — confirm before implementing the taxonomy in detail.)

19. **Preserve the rounding of your inputs.** Ord states his figures "are all rounded off (usually to the nearest factor of 10)". Store them with a declared precision and refuse to display derived quantities to more significant figures than the inputs support.

20. **Keep (a), (b) and (c) as three separate fields for every hazard, and never let a computation silently collapse them.** The XPT's two groups differ on conditional lethality — experts 6%/20% = 0.30, superforecasters 1%/9% = 0.11 — not merely on magnitude. A simulator with a single "risk" number per hazard cannot represent that disagreement and will therefore conceal it.

**On expert inputs and calibration**

21. **Treat every expert-elicitation input as a distribution across camps, never as a consensus.** Store `{superforecaster_median, expert_median}` as a pair — 1% vs. 6% for extinction, 9% vs. 20% for catastrophe — and run both. Averaging them is the error the XPT was designed to expose.

22. **Do not model debate as convergence.** The XPT's own finding is "large-scale disagreement and minimal convergence of beliefs". If the simulator has an update-over-time or deliberation mechanic, its default must be persistent disagreement, and any convergence must be a user-set assumption that is flagged in the output.

23. **Do not weight forecasters by demonstrated skill on long-horizon claims — there is no such demonstration.** "there was no statistically significant correlation between near-term accuracy and long-term existential risk forecasts" (Kučinskas et al. 2025). Any credibility weighting in the simulator is an assumption, and must be labelled as one.

24. **Prefer aggregates to individuals, and benchmark against triviality.** Median aggregation bought ~1 standard deviation of accuracy; the median individual expert or superforecaster "performed statistically indistinguishably from simple extrapolation algorithms". Ship a no-change and a trend-extrapolation baseline alongside every forecast the simulator produces, and show the reader when the sophisticated machinery is not beating them.

25. **Apply the one measured, signed correction — and only that one.** Elicited forecasts were systematically **too slow on AI capability** (superforecasters assigned 9.7% average probability to realised AI-benchmark outcomes; experts 24.6%; IMO gold got 2.3% and 8.6%) and **too fast on green technology** (hydrogen $7.50/kg realised vs. $4.50/$3.50 forecast; DAC 0.01 MtCO₂/yr realised vs. 0.32/0.60 forecast). These are directional priors for capability-timeline inputs. Do not extrapolate them into a general "experts are overconfident" adjustment — that is not what was measured.

26. **Record the provenance and selection of every elicited number.** "42% of experts participating in the XPT reported having attended an EA meetup"; the expert pool was 32 AI / 12 biorisk / 12 nuclear / 9 climate / 15 generalist. A simulator that presents these as "expert opinion" without the composition is laundering a sample.

**On the model's own honesty**

27. **Every number carries a `basis` field: `published`, `derived`, or `author-estimate`.** Anything not traceable to a document someone actually opened is `author-estimate` and renders visibly as such. In this brief, the Laplace arithmetic of §2.1 and the union arithmetic of §4.1 are `derived`; Ord's unretrieved Table 6.1 rows and the 2008 FHI survey would be `author-estimate` if used, and so are omitted entirely.

28. **Instrument the direction of every methodological choice.** Log, for each correction and each modelling decision, whether it raised or lowered estimated risk. If the log shows every discretionary choice pushing one way, the model is a doom-generator regardless of how well-sourced its individual parameters are. Thomas's Tegmark–Bostrom result — the "debiasing" step producing a *less* safe bound than the full evidence — is the canonical instance of a correction that fails this audit.

---

### Sources

- [Ćirković, Sandberg & Bostrom 2010, *Risk Analysis* 30(10):1495–1506](https://nickbostrom.com/papers/anthropicshadow.pdf) — DOI [10.1111/j.1539-6924.2010.01460.x](https://doi.org/10.1111/j.1539-6924.2010.01460.x)
- [Thomas 2024, *Dispelling the Anthropic Shadow*, GPI Working Paper 20-2024](https://globalprioritiesinstitute.org/wp-content/uploads/Dispelling-the-Anthropic-Shadow-Teruji-Thomas.pdf)
- [Thomas 2021, *Doomsday and Objective Chance*, GPI Working Paper 2-2021](https://globalprioritiesinstitute.org/wp-content/uploads/Teruji-Thomas_Doomsday-and-objective-chance.pdf)
- [Snyder-Beattie, Ord & Bonsall 2019, *Scientific Reports* 9:11054](https://pmc.ncbi.nlm.nih.gov/articles/PMC6667434/) — DOI [10.1038/s41598-019-47540-7](https://doi.org/10.1038/s41598-019-47540-7)
- [Cirillo & Taleb 2020, "Tail Risk of Contagious Diseases", arXiv:2004.08658 / *Nature Physics* 16:606–613](https://arxiv.org/pdf/2004.08658)
- [Corral 2020, "Scientific comment on 'Tail risk of contagious diseases'", arXiv:2007.06876](https://arxiv.org/abs/2007.06876)
- [Clauset 2018, *Science Advances* 4:eaao3580](https://pmc.ncbi.nlm.nih.gov/articles/PMC5834001/)
- [Olum 2000, "The doomsday argument and the number of possible observers", arXiv:gr-qc/0009081](https://arxiv.org/pdf/gr-qc/0009081)
- [Caves 2000, *Contemporary Physics* 41:143–153, arXiv:astro-ph/0001414](https://arxiv.org/abs/astro-ph/0001414)
- [Karger et al. 2023, *Forecasting Existential Risks*, FRI Working Paper #1](https://forecastingresearch.org/research/existential-risk-persuasion-tournament)
- [Kučinskas et al. 2025, *Assessing Near-Term Accuracy in the XPT*, FRI](https://forecastingresearch.org/pdf/near-term-xpt-accuracy.pdf)
- [Kemp et al. 2022, "Climate Endgame", *PNAS* 119(34):e2108146119](https://pmc.ncbi.nlm.nih.gov/articles/PMC9407216/)
- [Ord, "The Precipice Revisited"](https://www.tobyord.com/writing/the-precipice-revisited)
- [Gott 1993, *Nature* 363:315–319 — citation via Crossref](https://doi.org/10.1038/363315a0)
- [Avin et al. 2018, "Classifying global catastrophic risks", *Futures* — citation only, text not retrieved](https://doi.org/10.1016/j.futures.2018.02.001)
- [Beard, Rowe & Fox 2024, in *An Anthology of Global Risk* — NOT retrieved, HTTP 429](https://doi.org/10.11647/obp.0360.06)