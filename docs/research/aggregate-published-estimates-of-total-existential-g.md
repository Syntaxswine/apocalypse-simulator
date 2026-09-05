# Aggregate published estimates of total existential / global-catastrophic risk

**Method note (read first).** This session's `WebSearch` budget was already exhausted (200/200) before my first call, and the two searches I attempted were refused. Search engines reachable by fetch (DuckDuckGo, Mojeek, Ecosia) served CAPTCHAs or 403s, and `web.archive.org`, `theguardian.com`, `economist.com` and `vox.com` are blocked to the fetch tool. I therefore worked by **direct retrieval of primary documents** (downloading and text-extracting the PDFs locally) plus the OpenAlex API. Every number below was pulled from a document I actually retrieved in this session; where a figure rests on a secondary reproduction I say so. Local copies: `C:\Users\baals\AppData\Local\Temp\claude\C--Users-baals-Local-Storage-AI\ef934be5-8b53-4f09-9dea-a7564d83f583\scratchpad\xpt.pdf`, `gcr2008.pdf`, `grace2024.pdf`.

---

## 1. The three quantities that must never be merged

Almost every apparent disagreement in this literature is partly a definition mismatch. The retrieved sources use **four** distinct target events:

| Label | Definition | Who uses it |
|---|---|---|
| (a) Event occurs | The hazard happens at all (a nuclear exchange, an engineered outbreak) | Sandberg & Bostrom's "≥1 million dead" column is the nearest proxy |
| (b) Global catastrophe | Death of **>10% of humans alive at the start of a 5-year period** | XPT (2023), FRI LEAP Wave 9 (2026). Sandberg & Bostrom's "≥1 billion dead" column is a close analogue |
| (c) Extinction | Global population falls **below 5,000** | XPT; Sandberg & Bostrom's "human extinction" column |
| (d) Existential catastrophe | "The destruction of humanity's long-term potential" — **broader than (c)**; includes unrecoverable collapse and permanent dystopia | Ord, *The Precipice* |

The XPT is explicit that it rejected (d) as unresolvable: *"Ord's definition of an existential risk as 'the destruction of humanity's long-term potential' may be qualitatively useful but it does not pass that test. For that reason, we chose two categories of events…"* (XPT p.22). **Ord's 1-in-6 and the XPT's 6%/1% are therefore not measuring the same thing**, and Ord's number is measuring a strictly larger event set. Any simulator that compares its headline against both must model (c) and (d) as separate outputs.

The size of the (b)→(c) step is itself a first-class finding. XPT superforecasters: 9.05% catastrophe vs 1% extinction (~9×). XPT experts: 20% vs 6% (~3.3×). For nuclear specifically the step is ~50–100× (see below) — nuclear war is the clearest case in the whole literature of a high-(b), low-(c) hazard.

---

## 2. Toby Ord, *The Precipice* (2020), Table 6.1 — every row

Reproduced from 80,000 Hours' article, which prints the table in full. The book itself is not online; I could not retrieve a scan, so this is a **secondary reproduction** — see uncertainty notes.

| Existential catastrophe via | Chance within next 100 years |
|---|---|
| Asteroid or comet impact | ~ 1 in 1,000,000 |
| Supervolcanic eruption | ~ 1 in 10,000 |
| Stellar explosion | ~ 1 in 1,000,000,000 |
| **Total natural risk** | **~ 1 in 10,000** |
| Nuclear war | ~ 1 in 1,000 |
| Climate change | ~ 1 in 1,000 |
| Other environmental damage | ~ 1 in 1,000 |
| 'Naturally' arising pandemics | ~ 1 in 10,000 |
| Engineered pandemics | ~ 1 in 30 |
| Unaligned artificial intelligence | ~ 1 in 10 |
| Unforeseen anthropogenic risks | ~ 1 in 30 |
| Other anthropogenic risks | ~ 1 in 50 |
| **Total anthropogenic risk** | **~ 1 in 6** |
| **Total existential risk** | **~ 1 in 6** |

**Cross-checks I was able to run on this table.** Ord himself, in *The Precipice Revisited* (12 July 2024), writes: *"In The Precipice, I gave my best guess probabilities for the existential risk over the next 100 years in each of these areas. These were 1 in 1,000 for Climate and for Nuclear, 1 in 30 for Pandemics and 1 in 10 for Unaligned AI."* That independently confirms four rows. The XPT independently cites *Precipice* p.167 for: total **16.7%** (i.e. 1 in 6), AI **10%**, biorisk **3.3%**, nuclear **0.1%** — confirming four rows again. The remaining rows (asteroid, supervolcano, stellar explosion, natural pandemics, other environmental, unforeseen/other anthropogenic, total natural) rest on the 80,000 Hours reproduction alone.

**Two things a simulator builder must notice.**

1. **The horizon is 2021–2120, not "by 2100."** The XPT tabulates Ord as *"16.7% — By 2120"*, and repeatedly as *"1 in 6 total existential risk by 2120 (Precipice, 167)"*. Comparing Ord's 1-in-6 directly against by-2100 figures silently adds 20 years of hazard.
2. **The rows do not sum to the total.** Adding the anthropogenic rows naively gives ≈0.189 (≈1 in 5.3) against a stated total of 1 in 6 ≈ 0.167. Ord notes the figures are *"all rounded off (usually to the nearest factor of 10)"*. *(This arithmetic is my own — **author-estimate**, not a claim made in the book.)* Do not build an independent-hazard model that reproduces the total by multiplying survival probabilities across rows; it will overshoot.

**Ord's 2024 update:** no revised numbers. *"in my view, Climate risk is down, Nuclear is up, and the story on Pandemics and AI is mixed — lots of changes, but no clear direction for the overall risk."* He explicitly declines to move the point estimates: *"none of them have moved that far."*

---

## 3. Sandberg & Bostrom (2008), FHI Technical Report #2008-1 — the full table

Retrieved from the live FHI archive mirror (the canonical `fhi.ox.ac.uk` URL in every citation is now **dead** — the domain does not resolve). Cite as the report itself instructs: *Sandberg, A. & Bostrom, N. (2008): "Global Catastrophic Risks Survey", Technical Report #2008-1, Future of Humanity Institute, Oxford University: pp. 1-5.*

All figures are **medians**, all **before 2100**:

| Risk | ≥1 million dead | ≥1 billion dead | Human extinction |
|---|---|---|---|
| Number killed by molecular nanotech weapons | 25% | 10% | **5%** |
| Total killed by superintelligent AI | 10% | 5% | **5%** |
| Total killed in all wars (including civil wars) | 98% | 30% | **4%** |
| Number killed in the single biggest engineered pandemic | 30% | 10% | **2%** |
| Total killed in all nuclear wars | 30% | 10% | **1%** |
| Number killed in the single biggest nanotech accident | 5% | 1% | **0.5%** |
| Number killed in the single biggest natural pandemic | 60% | 5% | **0.05%** |
| Total killed in all acts of nuclear terrorism | 15% | 1% | **0.03%** |
| **Overall risk of extinction prior to 2100** | n/a | n/a | **19%** |

**The informality caveat, verbatim.** Opening sentence: *"At the Global Catastrophic Risk Conference in Oxford (17-20 July, 2008) an **informal** survey was circulated among participants, asking them to make their best guess at the chance that there will be disasters of different types before 2100."* And immediately under the table: *"These results should be taken with a grain of salt. Non-responses have been omitted, although some might represent a statement of zero probability rather than no opinion. … There are likely to be many cognitive biases that affect the result, such as unpacking bias and the availability heuristic-well as old-fashioned optimism and pessimism."*

**The report never states its sample size.** I grepped the full text for "respond", "particip", "n =", "sample": the only hits are narrative. Secondary sources conflict — the *Bulletin* (2016) says *"an informal survey of 19 experts"*; the EA Forum's estimate-database post says 13 participants. Both are plausibly contaminated by the 19% headline figure. **Treat N as unknown.** This is the single weakest evidential base of any source in this compilation, and it is also the source with the *highest* headline number.

---

## 4. Existential Risk Persuasion Tournament (Karger, Rosenberg, Jacobs, Hickman, Hadshar, Gamin, Smith, Williams, McCaslin, Thomas & Tetlock), FRI Working Paper #1

Ran **June–October 2022**; report first released **10 July 2023**, current version 8 August 2023. 80 domain experts + 89 superforecasters (169 forecasters), 59 questions, plus a parallel public survey of college-educated respondents.

Definitions, verbatim from footnote 2: *"We define a catastrophic event as one causing the death of at least 10% of humans alive at the beginning of a five-year period and define extinction as reduction of the global population to less than 5000."* Also flagged there: the median forecaster on the extinction question is not necessarily the same person as the median on the catastrophe question.

### Table 2 — catastrophic risk (>10% dead in 5 years) by 2100, medians [95% CI]

| Forecast | Superforecasters | Domain experts | General x-risk experts | Public survey |
|---|---|---|---|---|
| AI catastrophe | 2.13% [1.83, 3.00]% | 12% [4.0, 18.5]% | 10% [6.16, 16.12]% | 5% [5, 5]% |
| Engineered pathogen catastrophe | 0.8% [0.5, 1.0]% | 3% [1, 5]% | 5% [3.03, 10.00]% | – |
| Natural pathogen catastrophe | 1% [0.7, 1.3]% | 0.85% [0.5, 2.0]% | 1.9% [0.2, 2.5]% | – |
| Nuclear catastrophe | 4% [3, 5]% | 8% [5, 11]% | 7.24% [4.9, 10]% | 10% [10, 11]% |
| Non-anthropogenic catastrophe | 0.05% [0.033, 0.081]% | 0.09% [0.05, 0.11]% | 0.045% [0.01, 1.00]% | 2% [1, 3]% |
| **Total catastrophic risk** | **9.05% [6.13, 10.25]%** | **20% [15.44, 27.60]%** | **28.95% [18.70, 50.63]%** | **11.56% [10, 13]%** |

(N=88 superforecasters, N=59 domain experts, N=15 general x-risk experts. The pathogen rows come from a separate post-tournament survey — withheld from the main tournament over information-hazard concerns — with N=78/45/13. Non-domain-expert column omitted here: see uncertainty notes.)

### Table 3 — extinction risk (population <5,000) by 2100, medians [95% CI]

| Forecast | Superforecasters | Domain experts | General x-risk experts |
|---|---|---|---|
| AI extinction | 0.38% [0.10, 0.75]% | 3% [0.49, 10.00]% | 4.75% [1.9, 14.0]% |
| Engineered pathogen extinction | 0.01% [0.005, 0.052]% | 1% [0.12, 1.09]% | 1% [0.12, 1.09]% |
| Natural pathogen extinction | 0.0018% [0.001, 0.030]% | 0.01% [0.0005, 0.0200]% | 0.001% [0.0001, 0.2000]% |
| Nuclear extinction | 0.074% [0.025, 0.100]% | 0.55% [0.075, 1.400]% | 0.7% [0.016, 1.000]% |
| Non-anthropogenic extinction | 0.0043% [0.0020, 0.0067]% | 0.004% [0.0017, 0.0072]% | 0.0059% [0.0010, 0.0095]% |
| **Total extinction risk** | **1% [0.55, 1.23]%** | **6% [3.41, 10.00]%** | **6.6% [3.001, 13.670]%** |

Public survey totals (Figures 2–3): extinction **5%**, catastrophe **11.56%**. Public AI extinction **2%**.

**Headline, verbatim:** *"The median expert predicted a 20% chance of catastrophe and a 6% chance of human extinction by 2100. … The median superforecaster predicted a 9% chance of catastrophe and a 1% chance of extinction."*

**Two findings the report itself flags that matter for a simulator.**

- **Aggregation choice moves the answer by up to 3 orders of magnitude.** Table 4: for total extinction risk, experts give arithmetic mean **12.92%**, trimmed mean **7.78%**, median **6%**, geometric mean of odds **2.78%**, extremized aggregate **0.22%**. Superforecasters: **3.73% / 1.68% / 1% / 0.31% / 0.0050%**. *"the mean was always the highest, often two or more times as large as the median."* A headline number is not well-defined until you name the aggregator.
- **Almost no convergence.** *"Few minds were changed during the XPT, even among the most active participants, despite monetary incentives for persuading others."* Within-group SD fell by <10% of its initial value over the tournament. Disagreement here is a stable property, not a transient.

Also worth encoding: among AI experts, those self-reporting >1,000 hours previously spent thinking about x-risk put AI-driven extinction at **30%**; those with 10–100 hours put it at **2%** — a 15× swing on exposure alone.

---

## 5. Martin Rees, *Our Final Century* (2003)

**The figure is routinely misquoted, and the misquote is the exact error the brief warns about.** Wikipedia's Martin Rees article states he *"estimated a 50% chance of human extinction during the 21st century"* — citing a Vox headline. That is quantity (c). The *Bulletin of the Atomic Scientists* (2016), by contrast, renders it as quantity (d)/civilisational: *"Sir Martin Rees … argues that civilization has no better than a 50-50 chance of making it through the 21st century intact."* The book is titled, in the UK, *Our Final Century?: Will the Human Race Survive the Twenty-first Century?* (US: *Our Final Hour*, Basic Books, 2003).

**Use the civilisational reading.** It is the one that matches the book's own framing and it is the one that makes the number coherent against every other source in this table — a 50% *extinction* estimate would be 2.6× the highest extinction figure anyone else has published (Sandberg & Bostrom's 19%) and ~50× the XPT superforecaster median. Read as "50% chance of a severe civilisational setback," it is roughly 3× Ord's 1-in-6 for a broader event class, which is a normal-sized disagreement.

**Restatements.** I could not retrieve the primary book text or the 2003 Guardian and 2019 Economist pieces (blocked domains), so I have **no verbatim first-person quote of the original sentence** — see uncertainty notes. Two retrieved restatements:
- **Long Bets #9** (bet placed with Steven Pinker, $400 to GiveWell): *"A bioterror or bioerror will lead to one million casualties in a single event within a six month period starting no later than Dec 31 02020."* Rees's argument: *"biotechnology is plainly advancing rapidly, and by 2020 there will be thousands-even millions-of people with the capability."* Resolution was still contested as of the May 2022 adjudication terms, tied to a Metaculus question on COVID-19 lab origin. **This is a >50% claim about a 1-million-casualty event that did not clearly occur** — a rare, scorable data point on a named forecaster in this space.
- **Bulletin interview, 22 December 2022:** noticeably softer, and no number. *"I'm optimistic that the world can escape the worst catastrophes which science fiction can speculate about. But I do think that we are going to have a rather bumpy ride through the century."* He argues for action on tiny margins: *"even if we could only reduce the probability by one part in 1,000, the stakes are so high, that we will have more than earned our keep."*

---

## 6. The Doomsday Clock — **not a probability**

**Current setting: 85 seconds to midnight**, announced 27 January 2026. Confirmed on both the current-time page and the Bulletin's own timeline (2023: 90 seconds; 2025: 89 seconds; 2026: 85 seconds — *"the closest it has ever been to catastrophe"*).

**The Bulletin says outright that it is not a forecast.** From the Doomsday Clock FAQ: *"The Doomsday Clock is not a forecasting tool, and we are not predicting the future."* It is set by the Science and Security Board (separated from the Governing Board in 2008), which meets twice yearly and *"stud[ies] events that have already occurred and existing trends"* — the FAQ likens the method to medical diagnosis across multiple indicators, not to probability elicitation.

**Do not map seconds-to-midnight onto a hazard rate.** There is no published conversion, the scale has changed units historically (minutes → seconds), and it is bounded below by zero in a way a probability is not. If a simulator displays it at all, display it as a labelled qualitative indicator beside the probabilistic output, never as an input to it.

Stated 2026 reasoning: *"Russia, China, the United States, and other major countries have become increasingly aggressive, adversarial, and nationalistic"*; collapsing global understandings and *"winner-takes-all great power competition"*; atmospheric CO₂ *"rising to 150 percent of preindustrial levels"*; laboratory-created **"mirror life"** that *"could plausibly evade normal controls on growth, spread throughout all ecosystems"*; and AI systems' *"tendency to 'hallucinate'"* in critical applications. Note that mirror life is a **new named hazard** absent from all the elicitations above — relevant if the simulator wants a hazard list current to 2026.

---

## 7. Recent systematic elicitations (2024–2026)

**Grace, Stewart, Sandkühler, Thomas, Weinstein-Raun, Brauner & Korzekwa, "Thousands of AI Authors on the Future of AI"** (AI Impacts; arXiv:2401.02843, January 2024, v3 dated 8 Oct 2025). **N = 2,778** researchers published at top-tier AI venues — the largest elicitation of its kind. Question wording drives the answer, which is why they asked three variants (Table 2, 2023 results):

| Question wording | N | Mean (SD) | Median (IQR) |
|---|---|---|---|
| "future AI advances causing human extinction or similarly permanent and severe disempowerment of the human species" | 1,321 | 16.2% (23%) | **5% (19%)** |
| "**human inability to control** future advanced AI systems causing human extinction or similarly permanent and severe disempowerment" | 661 | 19.4% (26%) | **10% (29%)** |
| "future AI advances causing human extinction … **within the next 100 years**" | 655 | 14.4% (22.2%) | **5% (19.9%)** |

Separately, on the "how good or bad will HLMI be" question, *"The median prediction for extremely bad outcomes, such as human extinction, was 5% (mean 9%)"*; **38%** put ≥10% on that; *"Depending on how we asked, between 41.2% and 51.4% of respondents estimated a greater than 10% chance of human extinction or severe disempowerment."* Note the **2× swing from wording alone** (5% → 10%) — an elicitation artefact larger than most cross-source disagreements about physical hazards.

**FRI, Longitudinal Expert AI Panel (LEAP) Wave 9: "Risks"** — fielded **19 May – 10 June 2026**; **194 experts** (44 computer scientists, 37 industry, 45 economists, 68 policy think-tank staff), **53 superforecasters**, **612 public**. This is the most recent systematic elicitation I could retrieve, and it is structurally the most useful for a simulator because it is **conditional on an AI-progress scenario**. Global catastrophe from any cause, defined as *"the death of more than 10% of the people alive at the start of a five-year period"* — expert medians:

| Scenario | by 2030 | by 2050 | by 2100 |
|---|---|---|---|
| Slow AI progress | 0.08% | 1% | **2%** |
| Rapid AI progress | 1% | 5% | **10%** |

The report also states the median superforecaster's figure *"more than doubled from 2% to 5%"* between scenarios, and the public's rapid-progress 2100 median is 15%. Other Wave 9 medians: AI-driven harm event (≥50 deaths or $100B damages) by 2050 — experts 62%, superforecasters 70%, public 35%.

**The 2026 expert catastrophe number (2%–10% by 2100) sits below the XPT's 2022 expert 20%** for the same event definition — but note it is conditioned on scenario and its respondent pool is AI-panel-weighted, not x-risk-weighted. Not a clean time series.

---

## 8. The comparison table — and the spread, which is the finding

Extinction / existential catastrophe unless noted. Horizon 2100 except Ord (2120). Sandberg & Bostrom, XPT and LEAP figures are **medians**; Ord and Rees are **single-author best guesses**; Grace et al. are survey medians.

| Hazard | Ord 2020 (existential, by 2120) | Sandberg & Bostrom 2008 (extinction) | XPT 2023 superforecasters | XPT 2023 domain experts | Other retrieved | **Spread (max ÷ min)** |
|---|---|---|---|---|---|---|
| **TOTAL** | **16.7% (1 in 6)** | **19%** | **1%** | **6%** | XPT general x-risk 6.6%; public 5%; Metaculus 2021 2%; Hempsell 2004 5–10% | **19×** |
| Total, catastrophe (>10% dead) | — (not given) | ≈30% "≥1bn dead, all wars" | 9.05% | 20% | XPT general x-risk 28.95%; public 11.56%; LEAP 2026 experts 2% (slow) / 10% (rapid) | **~14×** |
| **Unaligned AI** | **10% (1 in 10)** | **5%** | **0.38%** | **3%** (AI experts) | XPT general x-risk 4.75%; Grace 2024 median 5% (10% on control wording); Müller & Bostrom 2016 18%; Baum et al. 2017 25%; Metaculus 1.9% | **66×** (26× excluding pre-2020) |
| **Engineered pandemics / biorisk** | **3.3% (1 in 30)** | **2%** (engineered pandemic) | **0.012%** (combined) | **1.01%** (biorisk experts) | Metaculus 0.2%; Pamlin & Armstrong 2015 0.0001–5% | **275×** |
| **Nuclear war** | **0.1% (1 in 1,000)** | **1%** | **0.074%** | **0.55%** (nuclear experts) | Metaculus 0.3%; Pamlin & Armstrong 0.005–5% | **13.5×** |
| Natural / non-anthropogenic | 0.01% total natural (1 in 10,000) | 0.05% natural pandemic | 0.0043% | 0.004% | XPT general x-risk 0.0059% | **~12×**, but see below |
| Climate change | 0.1% (1 in 1,000) | not asked | not asked as an extinction row | not asked as an extinction row | — | **no comparison possible** |
| Asteroid / comet | 0.0001% (1 in 1,000,000) | not asked | folded into non-anthropogenic | folded into non-anthropogenic | — | **no comparison possible** |
| Supervolcano | 0.01% (1 in 10,000) | not asked | folded into non-anthropogenic | folded into non-anthropogenic | — | **no comparison possible** |
| Stellar explosion | 0.0000001% (1 in 1e9) | not asked | folded into non-anthropogenic | folded into non-anthropogenic | — | **no comparison possible** |
| *Rees 2003 (different quantity)* | *50% — civilisation not surviving the century **intact**, not extinction* | | | | | |

*(Spread column is my own arithmetic over the retrieved figures — **author-estimate**.)*

### Where the disagreement exceeds an order of magnitude, and where it doesn't

**Biorisk is the worst-calibrated hazard in the literature — ~275× spread.** XPT superforecasters put engineered-plus-natural pathogen extinction at **0.012%**; Ord puts engineered pandemics at **3.3%**. That is a factor of 275 on the hazard the field most often describes as tractable and near-term. Note the internal structure: superforecasters put engineered *catastrophe* (10% dead) at 0.8% but engineered *extinction* at 0.01% — an 80× (b)→(c) step, versus experts' 3% → 1%, a 3× step. **The disagreement is not really about whether an engineered pandemic happens; it is about whether one can finish the job.** That is a modellable crux: it lives in the tail of the kill-fraction distribution, not in the event rate. A simulator should expose it as a parameter.

**AI is the widest *live* disagreement and the one the field knows it cannot resolve — 26× within post-2020 sources, 66× including the older AI-specific surveys.** The XPT names this as its central puzzle: *"the largest disagreement about risks from artificial intelligence,"* and *"why were superforecasters so unmoved by experts' much higher estimates of AI extinction risk?"* Superforecasters 0.38% vs AI experts 3% vs general x-risk experts 4.75% vs Ord 10% vs the >1,000-hours AI-expert subgroup at 30%. Crucially, months of incentivised persuasion moved none of it.

**Nuclear is the best-agreed hazard — 13.5×, and the (b) numbers agree far better than the (c) numbers.** Nuclear *catastrophe*: superforecasters 4%, experts 8%, general x-risk 7.24%, public 10% — a factor of 2.5 across four very different populations, the tightest cluster anywhere in this compilation. Nuclear *extinction*: 0.074% to 1% — a factor of 13.5. **Everyone broadly agrees nuclear war can kill hundreds of millions and broadly agrees it probably cannot finish humanity; they disagree only about the residual.** This is the row to calibrate a simulator's kill-fraction machinery against, because it is the row where the underlying physics is best characterised.

**Non-anthropogenic risk is the one place the two XPT groups genuinely converge**: 0.0043% (superforecasters) vs 0.004% (experts) — a 1.075× ratio, essentially identical. The report flags this explicitly: *"There are two exceptions: non-anthropogenic risks, where the two groups provide virtually identical forecasts; and catastrophic risk from natural pathogens."* Convergence here is expected — natural risk is the only hazard class with an empirical anchor (the survival of the species for 200,000 years bounds it from above), and Ord's total natural risk of 1 in 10,000 is within ~2.5× of both XPT groups. **This is the sanity check for a simulator's natural-hazard module: if your asteroid/supervolcano/stellar module disagrees with these by more than ~10×, your module is wrong, not the literature.**

**The 19% vs 1% total-extinction gap is the headline spread — 19×.** But the top of that range (Sandberg & Bostrom, 19%) is an informal, unsized 2008 conference show-of-hands with a self-declared grain-of-salt caveat, and the bottom (XPT superforecasters, 1%) is a 2022 incentivised tournament with N=89 and published confidence intervals. **The evidential quality is inversely correlated with the headline number across this whole compilation.** Any simulator that quotes "experts say 1 in 6" without saying which experts, which event, which century and which aggregator is quoting a number whose defensible range spans 0.005% (XPT extremized superforecaster aggregate) to 19%.

### Suggested calibration target for a headline output

If the simulator's headline is **P(extinction by 2100)**, the defensible published band is **1% – 19%**, with the densest cluster at **5–6%** (XPT experts 6%, XPT general x-risk 6.6%, XPT public 5%, Grace et al. median 5%). If the headline is **P(global catastrophe, >10% dead, by 2100)**, the band is **9% – 29%**, cluster around **10–20%**. If the headline is **P(existential catastrophe incl. unrecoverable collapse)**, only Ord (16.7%) and Rees (50%, civilisational) are on record, and they disagree by 3×. Report which of the three you are computing.

---

## 9. Uncertainty notes / where I could not find a published figure

- **Ord's Table 6.1 full text was not retrievable from a primary source.** The book is not online and `theprecipice.com/charts` 404s; `theprecipice.com/faq` gives only the 1-in-6 total. The full table is reproduced from 80,000 Hours. Five of the eleven rows plus the total are independently corroborated (Ord's own 2024 essay; the XPT's citations of *Precipice* p.167). **The asteroid, supervolcano, stellar-explosion, natural-pandemic, other-environmental, unforeseen-anthropogenic, other-anthropogenic and total-natural rows rest on a single secondary reproduction.** Verify against a physical copy of p.167 before shipping.
- **Sandberg & Bostrom's sample size is not stated in the report.** Sources disagree (19 vs 13) and both may be artefacts of the 19% figure. Reported as unknown.
- **Rees: no verbatim first-person quote of the 2003 sentence was retrievable.** The Guardian (2003), Economist (2019) and Vox (2018) pieces are all on domains this tool cannot fetch, and the Princeton UP page for *On the Future* carries no odds statement. The wording used above is the *Bulletin*'s 2016 rendering. **The extinction-vs-civilisation reading is disputed between Wikipedia and the Bulletin, and I have resolved it toward "civilisation … intact" on internal-consistency grounds — that resolution is an author judgement, not a retrieved citation.**
- **XPT Tables 2 and 3, non-domain-expert column:** the PDF's column alignment could not be recovered unambiguously for the non-anthropogenic rows and a few total cells. I have omitted those cells rather than guess. The columns I report (superforecaster, domain expert, general x-risk, public totals) are cross-validated against Figures 2, 3 and 4, whose plotted medians match (1 / 6 / 6.6 / 5 for extinction; 9.04 / 20 / 28.95 / 11.56 for catastrophe — note Figure 3 labels 9.04 where Table 2 gives 9.05).
- **No published extinction figure exists for climate change from the XPT** — climate was a forecasting domain but there is no climate row in the extinction table. Ord's 1-in-1,000 is the only comparable number retrieved. Similarly, **no source other than Ord gives a separate asteroid, supervolcano or stellar-explosion figure**; the XPT folds all of these into "non-anthropogenic".
- **The Spread column in §8 and the row-sum arithmetic in §2 are my own calculations** over retrieved figures, not quantities published by any source.
- **LEAP Wave 9 per-group breakdowns are partial.** Only the expert medians are given as a complete scenario × year grid in the material I retrieved; the superforecaster and public figures are quoted narratively (superforecasters "2% to 5%", public 15% by 2100 rapid). Fetch `leap.forecastingresearch.org/reports/wave9` directly for the full grid.
- **I could not run web searches**, so I cannot claim this is an exhaustive sweep of 2024–2026 elicitations. I found two (Grace et al. 2024; FRI LEAP Wave 9, 2026) by walking publisher indexes. A 2025-vintage x-risk-specific elicitation may exist that I did not surface.

---

## Sources — every URL retrieved this session

- [80,000 Hours — existential risks article (reproduces Ord Table 6.1)](https://80000hours.org/articles/existential-risks/)
- [The Precipice — FAQ (1-in-6 figure)](https://theprecipice.com/faq)
- [Toby Ord — "The Precipice Revisited" (12 July 2024)](https://www.tobyord.com/writing/the-precipice-revisited)
- [Toby Ord — writing index](https://www.tobyord.com/writing)
- [Sandberg & Bostrom (2008), "Global Catastrophic Risks Survey", FHI Technical Report #2008-1 — live archive mirror](https://www.futureofhumanityinstitute.org/s/2008-1.pdf) (canonical `https://www.fhi.ox.ac.uk/reports/2008-1.pdf` is dead — domain does not resolve)
- [FHI archive — papers index](https://www.futureofhumanityinstitute.org/papers)
- [FHI archive — home](https://www.futureofhumanityinstitute.org/)
- [Karger et al., "Forecasting Existential Risks: Evidence from a Long-Run Forecasting Tournament", FRI Working Paper #1 (PDF, 19.5 MB)](https://forecastingresearch.org/pdf/existential-risk-persuasion-tournament.pdf)
- [FRI — XPT project page](https://forecastingresearch.org/xpt)
- [FRI — research index](https://forecastingresearch.org/research)
- [FRI — XPT research page](https://forecastingresearch.org/research/existential-risk-persuasion-tournament)
- [FRI Substack — archive](https://forecastingresearch.substack.com/archive)
- [FRI — "Forecasting Major Risks from AI" (LEAP Wave 9, 2026)](https://forecastingresearch.substack.com/p/forecasting-major-risks-from-ai)
- [FRI LEAP — Wave 9 report](https://leap.forecastingresearch.org/reports/wave9)
- [Grace et al., "Thousands of AI Authors on the Future of AI" (arXiv:2401.02843)](https://arxiv.org/abs/2401.02843) · [PDF](https://arxiv.org/pdf/2401.02843)
- [Bulletin of the Atomic Scientists — Doomsday Clock, current time (85 seconds, 27 Jan 2026)](https://thebulletin.org/doomsday-clock/current-time/)
- [Bulletin — Doomsday Clock FAQ ("not a forecasting tool")](https://thebulletin.org/doomsday-clock/faq/)
- [Bulletin — Doomsday Clock timeline](https://thebulletin.org/doomsday-clock/timeline/)
- [Bulletin — "How likely is an existential catastrophe?" (7 Sep 2016)](https://thebulletin.org/2016/09/how-likely-is-an-existential-catastrophe/)
- [Bulletin — "Martin Rees explains how science might save us" (22 Dec 2022)](https://thebulletin.org/2022/12/martin-rees-explains-how-science-might-save-us/)
- [Long Bets #9 — Martin Rees bioterror/bioerror prediction](https://longbets.org/9/)
- [Wikipedia — Martin Rees](https://en.wikipedia.org/wiki/Martin_Rees) · [Our Final Hour](https://en.wikipedia.org/wiki/Our_Final_Hour) · [Human extinction](https://en.wikipedia.org/wiki/Human_extinction) · [Global catastrophic risk](https://en.wikipedia.org/wiki/Global_catastrophic_risk) · [The Precipice](https://en.wikipedia.org/wiki/The_Precipice:_Existential_Risk_and_the_Future_of_Humanity)
- [Existential Risk FAQ (Bostrom/FHI) — "10-20% total existential risk in this century"](https://existential-risk.com/faq.html)
- [EA Forum — "Database of existential risk estimates" (MichaelA)](https://forum.effectivealtruism.org/posts/JQQAQrunyGGhzE23a/database-of-existential-risk-estimates)
- [Astral Codex Ten — "The Extinction Tournament"](https://www.astralcodexten.com/p/the-extinction-tournament) *(retrieved as a cross-check; **its expert catastrophe figure of ~10% is wrong** — the primary XPT report gives 20%. Do not cite it for numbers.)*
- [Princeton University Press — *On the Future* (2018)](https://press.princeton.edu/books/hardcover/9780691180441/on-the-future)
- [OpenAlex API](https://api.openalex.org/works) (used for bibliographic lookup)