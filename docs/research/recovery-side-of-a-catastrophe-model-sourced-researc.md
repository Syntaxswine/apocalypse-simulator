# RECOVERY SIDE OF A CATASTROPHE MODEL — sourced research brief + proposed recovery function

**Method note for the auditor:** `WebSearch` was unavailable this session (the 200-call budget was already exhausted before my first call). I substituted open scholarly search APIs — Crossref, OpenAlex, Semantic Scholar Graph, Europe PMC, Unpaywall — as the discovery layer, and then fetched and *read* the primary documents themselves (several as PDFs, rendered page-by-page). Every number below was retrieved in this session. Where I could not retrieve something, I say so explicitly rather than filling it from memory. Two DuckDuckGo endpoints returned CAPTCHAs; I did not attempt to bypass them.

---

## 1. Minimum viable population — what the floor actually is

**The headline meta-analysis.** Traill, Bradshaw & Brook (2007), *Biological Conservation* 139(1–2):159–166, DOI [10.1016/j.biocon.2007.06.011](https://doi.org/10.1016/j.biocon.2007.06.011), synthesised 30 years of MVP estimates across **212 species from 141 sources** and found "**the MVP for most species will exceed a few thousand individuals**", with a **median of approximately 4,169 individuals**. Critically, they found **no reliable life-history or ecological shortcut** for predicting a species' MVP.
> *Uncertainty note:* the widely-quoted 95% CI on 4,169 (often given as 3,577–5,129) is in the paper body; I retrieved the median from the Semantic Scholar abstract record but **could not retrieve the CI verbatim** in this session (the ScienceDirect page 403s and the OpenAlex `abstract_inverted_index` is null). Do not print a CI you cannot source.

**The companion number.** Brook et al. (2006), *Ecology Letters*, DOI [10.1111/j.1461-0248.2006.00883.x](https://doi.org/10.1111/j.1461-0248.2006.00883.x): "**The median MVP estimate was 1377 individuals (90% probability of persistence over 100 years) but the overall distribution was wide and strongly positively skewed.**" Note the two medians (1,377 vs 4,169) differ because the persistence *criterion* differs — this is exactly the kind of definitional slippage a simulator must pin down.

**Traill et al. (2010)**, *Biological Conservation* 143:28–34, DOI [10.1016/j.biocon.2009.09.001](https://doi.org/10.1016/j.biocon.2009.09.001), state the policy version: "**thousands (not hundreds) of individuals are required** for a population to have an acceptable probability of riding-out environmental fluctuation and catastrophic events, and ensuring the continuation of evolutionary processes."

**The 50/500 rule and its fight.** The revision is Frankham, Bradshaw & Brook (2014), *Biological Conservation* 170:56–63, DOI [10.1016/j.biocon.2013.12.036](https://doi.org/10.1016/j.biocon.2013.12.036): "**Ne = 50 is inadequate for preventing inbreeding depression over five generations in the wild**", with **Ne ≥ 100 needed to restrict fitness loss to ≤10%**; and **Ne = 500 "is too low for retaining evolutionary potential for fitness in perpetuity; a better approximation is Ne ≥ 1000.**" They also flag the operational killer for any simulator: converting census N to effective Ne "requires Ne/N ratios, typically unavailable for most wild populations."

The dispute is a real, traceable exchange, and you should model it as unresolved:
- Jamieson & Allendorf (2012), "How does the 50/500 rule apply to MVPs?", *TREE* 27:578–584, DOI [10.1016/j.tree.2012.07.001](https://doi.org/10.1016/j.tree.2012.07.001)
- Frankham, Brook, Bradshaw, Traill & Spielman (2013), response, *TREE* 28:187–188, DOI [10.1016/j.tree.2013.01.002](https://doi.org/10.1016/j.tree.2013.01.002)
- Franklin, Allendorf & Jamieson (2014), "The 50/500 rule is still valid – Reply to Frankham et al.", *Biological Conservation* 176:284–285, DOI [10.1016/j.biocon.2014.05.004](https://doi.org/10.1016/j.biocon.2014.05.004)

**The empirical existence proof.** Hu et al. (2023), *Science* 381:979–984, DOI [10.1126/science.abq7487](https://doi.org/10.1126/science.abq7487), using FitCoal on 3,154 present-day genomes: "human ancestors went through a severe population bottleneck with **about 1280 breeding individuals** between around **930,000 and 813,000 years ago**. The bottleneck **lasted for about 117,000 years** and brought human ancestors close to extinction."
> *Uncertainty note:* this is one method's estimate. I found no retrieved rebuttal in this session (a Europe PMC search for a technical comment returned zero hits), so treat 1,280 as a single-method result, not a settled constant.

**What this implies for a population floor.** The honest reading is a *band*, not a number:
| Level | Census N | Basis |
|---|---|---|
| Hard extinction floor | ~10² | Hanson 2008 working assumption (below) |
| Persistence possible but diversity bleeds | ~1.3 × 10³ breeding | Hu et al. 2023, empirically survived 117 kyr |
| Median wild-vertebrate MVP | 4,169 | Traill et al. 2007 |
| Evolutionary potential secured | Ne ≥ 1,000 → census ~7×10³–10⁴ at Ne/N ≈ 0.1–0.15 | Frankham et al. 2014 (Ne/N ratio is my extrapolation — they explicitly say the ratio is usually unavailable) |

**Extrapolation flag:** Traill's 4,169 is a median over *wild vertebrate populations under natural selection*. Applying it to a planning, tool-using, medically-capable species is an extrapolation the authors did not make. Mark it in the sim as `basis: extrapolated`.

---

## 2. Historical recovery precedents — the empirical spine

### Black Death (the best-measured mass-mortality event in history)

Alfani & Murphy (2017), "Plague and Lethal Epidemics in the Pre-Industrial World", *Journal of Economic History* 77(1):314–343, DOI [10.1017/S0022050717000092](https://doi.org/10.1017/S0022050717000092) (open access; I read the PDF):
- "The Black Death, which hit Europe in 1347–1352 … **killed between one- and two-thirds of the European population** (Del Panta 1980; Benedictow 2004)".
- Their Table 1 gives **35–60 percent mortality in Europe and the Mediterranean**, **up to 50 million victims**, making it "the second-worst pandemic in human history in absolute terms, behind the 1917–1919 Spanish Influenza … **It remains first in terms of mortality rates.**"

Jedwab, Johnson & Koyama, "The Economic Impact of the Black Death", *Journal of Economic Literature* 60(1):132–178, DOI [10.1257/jel.20201639](https://doi.org/10.1257/jel.20201639) (I read the open GWU IIEP working-paper version, WP-2020-14):
- "**The Black Death killed 40% of Europe's population.**"
- **Recovery was glacial and locally often absent.** From a sample of 165 cities: "on average, a **city facing a 10% mortality rate was still 8.7% smaller by 1400**, implying a slow rate of recovery in the short-run." Worse at regional scale: "a region facing a 10% mortality rate had **between 13% and 15% percent lower population by 1400**, consistent with negative general equilibrium effects."
- Specific cities: "in Winchester the pre-plague population was somewhere between **5000 to 8000** inhabitants but by 1377, it counted only **3000 and it did not recover thereafter**. **Florence did not recover the pre-plague populations for many centuries.**"
- Population decline "**continued until 1450 in many parts of Europe**, partly due to frequent reoccurrences of the plague."

**Implied regrowth rate — this is the single most useful number for the simulator.** A 10% mortality shock leaving population at 0.900 of baseline, standing at 0.913 fifty years later, implies an intrinsic post-shock growth rate of **ln(0.913/0.900)/50 ≈ 2.9 × 10⁻⁴ yr⁻¹ (~0.03%/yr)** over the first half-century. Preindustrial populations do **not** snap back. (This derivation is mine from Jedwab et al.'s two stated figures; mark as `derived`.)

**The "it raised wages / accelerated development" argument — real, but heavily conditional.**
- Alfani & Murphy: "there is evidence of a **long-lasting improvement in European and Mediterranean real wages immediately after the Black Death** (Pamuk 2007; Campbell 2010b)"; and the divergence claim, "the shock of the plague was so great … it would have needed many generations of population growth to reverse its positive impact on real wages. This long-lasting high-income economy in turn created a favorable environment for a series of political and structural reforms, and *this* is what eventually opened the doors for the Great Divergence (Voigtländer and Voth 2013)."
- Jedwab et al.'s framing: "The initial effect of the plague was highly disruptive. **Wages and per capita income rose. But, in the long run, this rise was only sustained in some parts of Europe.**"
- **The counter-cases matter more for a simulator than the headline.** Alfani & Murphy: in Spain, "[Plague] destroyed the equilibrium between scarce population and abundant resources. **Pre-Black Death per capita income levels were temporarily recovered by the late sixteenth century, but were only exceeded after 1820**" (Álvarez Nogal and Prados de la Escosura 2013, p. 3). In Egypt "the rural depopulation caused by the epidemic led to the collapse of the irrigation system, which remained in a **centuries-long condition of decay**" — their Figure 3 shows Egyptian agrarian output still at roughly **0.45 of its 1315 level in 1600**, i.e. **250 years with no recovery**. In Eastern Europe the plague plausibly fostered the "second serfdom".
- And even the wage gain was *delayed and politically mediated*: "while in the medium- and long-run real wages rose across Europe after the Black Death, **in the short run the labor market did not seem to react as if exclusively driven by economic logic** … in many places, in the aftermath of the Black Death **real wages *declined* in the short run rather than increasing** (Cohn 2007)."

Pamuk (2007), *European Review of Economic History* 11:289–317, DOI [10.1017/S1361491607002031](https://doi.org/10.1017/S1361491607002031) is the canonical wage paper; it is **not open access and I could not retrieve its numbers**. Cite it as the source of the wage-series claim via Alfani & Murphy, not for a figure you haven't seen.

### 1918 influenza

- Johnson & Mueller (2002), *Bulletin of the History of Medicine* 76:105–115: earlier estimates were 21.5 million (1920s) then 24.7–39.3 million (1991); "**This paper suggests that it was of the order of 50 million.** However … even this vast figure may be substantially lower than the real toll, perhaps as much as **100 percent understated**."
- Barro, Ursúa & Weng (2020), NBER WP 26866: "Data for 48 countries imply flu-related deaths in 1918–1920 of **40 million, 2.1 percent of world population**, implying 150 million deaths when applied to current population. Regressions … imply flu-generated economic declines for **GDP and consumption in the typical country of 6 and 8 percent**, respectively."
- **Recovery signal: essentially total.** A ~2% global kill left no persistent trajectory break in the historical record.

### Post-WWII reconstruction — the cleanest natural experiment

Davis & Weinstein, "Bones, Bombs and Break Points: The Geography of Economic Activity", NBER WP 8517 (2001) / *AER* 92:1269–1289, DOI [10.1257/000282802762024502](https://doi.org/10.1257/000282802762024502). I read the working-paper PDF:
- "The coefficient on 40-47 growth is –1.0 … This means that **the typical city completely recovered its former relative size within 15 years** following the end of World War II."
- Extending the endpoint to 1965: "by 1965 cities have entirely reversed the damage due to the war … **the effect of the temporary shocks vanishes completely in less than twenty years**."
- Hiroshima and Nagasaki specifically: "our data suggest that the nuclear bombs immediately killed **8.5 percent of Nagasaki's population and 20.8 percent of Hiroshima's population**" and yet "there is a clear indication that they **returned to their prewar growth trends**. This process seems to have taken a little longer in Hiroshima."
- Reconstruction subsidies were nearly irrelevant: for Tokyo, Hiroshima, Nagasaki and Osaka, "government reconstruction expenses accounted for **less than one percentage point of their cumulative growth between 1947 and 1960**", where that cumulative growth "was between 55 and 96 percent."

Corroborating case: Miguel & Roland, "The Long Run Impact of Bombing Vietnam", NBER WP 11954 (2006): "The Vietnam War featured **the most intense bombing campaign in military history** … **U.S. bombing does not have a robust negative impact on poverty rates, consumption levels, infrastructure, literacy or population density through 2002.** This finding suggests that local recovery from war damage can be rapid under certain conditions."

**The lesson for the model:** *localised* destruction with an intact surrounding system recovers in ~15–20 years and leaves no permanent mark. This is the opposite of the Black Death regime, where the *system itself* was the thing damaged. Infrastructure destruction is only slowly-recoverable when it is **global**, not when it is severe-but-local.

### Toba — the claim, and its collapse

- **The claim:** Ambrose (1998), *Journal of Human Evolution* 34:623–651, DOI [10.1006/jhev.1998.0219](https://doi.org/10.1006/jhev.1998.0219): "**Toba's volcanic winter could have decimated most modern human populations**, especially outside of isolated tropical refugia … Volcanic winter may have reduced populations to levels low enough for founder effects, genetic drift and local adaptations to produce rapid population differentiation." *(The frequently-quoted "3,000–10,000 survivors" figure is in the body, not the abstract; I did not retrieve it, so do not print it as a sourced number.)*
- **The contestation, from two independent primary sources:**
  - Lane, Chorn & Johnson (2013), *PNAS*, DOI [10.1073/pnas.1301474110](https://doi.org/10.1073/pnas.1301474110): the Youngest Toba Tuff cryptotephra in Lake Malawi "is not accompanied by a major change in sediment composition or evidence for substantial temperature change, implying that **the eruption did not significantly impact the climate of East Africa and was not the cause of a human genetic bottleneck at that time**."
  - Smith et al. (2018), *Nature*, DOI [10.1038/nature25967](https://doi.org/10.1038/nature25967): YTT glass shards at two South African coastal sites; "**Humans in this region thrived through the Toba event and the ensuing full glacial conditions.**"

**Model implication:** delete "supervolcano → near-extinction bottleneck" as a default mechanism. The best-attested severe human bottleneck is Hu et al.'s ~930–813 kya event, ~800,000 years before Toba, and it lasted 117,000 years without ending the lineage.

---

## 3. Could industrial civilisation restart? The coal argument

**The pessimist case, stated by the person who wrote the book.** Lewis Dartnell (author of *The Knowledge: How to Rebuild Our World from Scratch*, 2014), "Out of the ashes", *Aeon*, 13 April 2015 ([link](https://aeon.co/essays/could-we-reboot-a-modern-civilisation-without-fossil-fuels)). His thought experiment assumes the survivors inherit a world where "we have already consumed the most easily drainable crude oil" and the "shallowest, most readily mined deposits of coal". His conclusion: "**It is this limitation in the supply of thermal energy that would pose the biggest problem to a society trying to industrialise without easy access to fossil fuels**", and "**an industrial revolution without coal would be, at a minimum, very difficult**". His restart geography is specific: "areas of Scandinavia or Canada that combine fast-flowing streams for hydroelectric power and large areas of forest that can be harvested sustainably for thermal energy."

**The hard counter-datum.** U.S. Energy Information Administration, *Coal explained — Mining and transportation*: "**About two-thirds of U.S. coal production is from surface mines** because surface mining is less expensive than underground mining." Shallow, near-surface coal is *not* globally exhausted; what is exhausted is the specific outcrop-and-shallow-adit British coal that happened to bootstrap the first industrial revolution. The argument is therefore about *the particular seams at the particular place*, not about global geology — and a simulator should treat "accessible coal remaining" as a **regional** variable, not a global one.

**The economist's counter.** Robin Hanson, "Catastrophe, Social Collapse, and Human Extinction" (2007/2008, in *Global Catastrophic Risks*, Bostrom & Ćirković eds.), [hanson.gmu.edu/collapse.pdf](https://mason.gmu.edu/~rhanson/collapse.pdf): "(The fact that we have used up some natural resources this time around **would probably matter little, as growth rates do not seem to depend much on natural resource availability**.)"

**Honest verdict:** this is a genuine live disagreement with no quantitative resolution in the literature. Model it as a *parameter with a wide prior*, not as a settled mechanic.

---

## 4. Resilient foods — what ALLFED actually claims, and what it concedes

**Founding paper.** Denkenberger & Pearce (2015), "Feeding everyone: Solving the food crisis in event of global catastrophes that kill crops or obscure the sun", *Futures* 72:57–68, DOI [10.1016/j.futures.2014.11.008](https://doi.org/10.1016/j.futures.2014.11.008). Compares five years of caloric requirements against conversion of existing vegetation and fossil fuels into edible food (natural-gas-digesting bacteria, leaf protein extraction, fibre conversion via enzymes/fungi/bacteria). Conclusion: "**careful planning and global cooperation could maintain humanity and the bulk of biodiversity.**"

**The best quantified scale-up estimate I retrieved.** Seaweed (Jehn et al., *Earth's Future* 2024, DOI [10.1029/2023EF003710](https://doi.org/10.1029/2023EF003710)): production could be scaled to reach "**an equivalent of 45% of the global human food demand** (spread among food, animal feed, and biofuels) **in around 9–14 months**", "only using a small fraction of the global ocean area."

**The integrated model.** Rivers, Hinge, Rassool, Blouin, Jehn, García Martínez, Amaral Grilo, Jaeck, Tieman, Mulhall, Butt & Denkenberger (2024), "Food system adaptation and maintaining trade could mitigate global famine in abrupt sunlight reduction scenarios", *Global Food Security*, DOI [10.1016/j.gfs.2024.100807](https://doi.org/10.1016/j.gfs.2024.100807); I read the open preprint at [Zenodo 11484350](https://doi.org/10.5281/zenodo.11484350). Scenario: 150 Tg stratospheric soot from a Russia–US nuclear war (4,400 non-overlapping 100 kT detonations over cities, starting in May), nuclear winter prolonged "**up to 10-15 years**"; by end of year two, "average global reductions over croplands would be **16 °C**, solar radiation by **85%**, and precipitation by **68%**". Result: "**In the worst case of no global trade and no adaptations, the model predicts a global famine.** However, scaling up resilient foods quickly could mitigate this for many countries. Maintaining global trade would further alleviate pressure on local food systems, unlocking the potential to feed the entire global population."

**The critiques — including ALLFED's own.** The paper states its own exclusions plainly: the model "does not account for other possible effects of a nuclear war like breakdown of international financial systems, loss of non-food trade (including agricultural inputs such as **fertilizer and seeds**), loss of solar dependent energy (photovoltaics, wind power, etc), freezing of infrastructure (e.g. water and sewer pipes), or political effects". And: "**insufficient preparation, post-disaster conflict, or economic collapse would worsen outcomes and hinder adaptation.**" Their own summary sentence is conditional: "producing enough food to prevent global famine is **unlikely if food trade breaks down** but plausible if it remains, **as long as resilient food adaptations are deployed en masse**."

The independent peer-reviewed counterweight is Xia, Robock, Scherrer, Harrison, Bodirsky, Weindl, Jägermeyr, Bardeen, Toon & Heneghan (2022), *Nature Food* 3:586–596, DOI [10.1038/s43016-022-00573-0](https://doi.org/10.1038/s43016-022-00573-0): "soot injections **larger than 5 Tg** would lead to mass food shortages, and livestock and aquatic food production would be unable to compensate for reduced crop output, in almost all countries. **Adaptation measures such as food waste reduction would have limited impact on increasing available calories.** We estimate **more than 2 billion people could die** from nuclear war between India and Pakistan, and **more than 5 billion could die** from a war between the United States and Russia." Rivers et al. themselves cite Xia's 150 Tg result as "an **89% reduction in global crop production and a global fatality rate of 75%** due to starvation".

Also useful for a refuge module: Boyd & Wilson (2022), "Island refuges for surviving nuclear winter and other abrupt sunlight-reducing catastrophes", *Risk Analysis*, DOI [10.1111/risa.14072](https://doi.org/10.1111/risa.14072): "**Australia, New Zealand, Iceland, the Solomon Islands, and Vanuatu appear most resilient to ASRS.**" But their case study warns that New Zealand "is threatened in scenarios of no/low trade, has precarious aspects of its energy supply, and shortcomings in manufacturing of essential components. Therefore, inadequate preparations and critical failures in these systems could see **rapid societal breakdown**." Refuges are not automatically safe.

Review synthesis: García Martínez, Behr, Pearce & Denkenberger (2025), *Critical Reviews in Food Science and Nutrition*, DOI [10.1080/10408398.2024.2431207](https://doi.org/10.1080/10408398.2024.2431207).

---

## 5. Seed banks and knowledge preservation

**Svalbard Global Seed Vault, as of retrieval on 2026-09-04** ([seedvault.no](https://www.seedvault.no/)): **1,401,285 seed samples**, **6,539 species**, **134 depositors**. Crop Trust ([croptrust.org](https://www.croptrust.org/work/svalbard-global-seed-vault/)): "The Seed Vault has the **capacity to store 4.5 million varieties of crops**"; "A temperature of **−18 °C** is required for optimal storage of the seeds."

**Modelling caveat (mine, flagged):** Svalbard holds *crop germplasm duplicates* — it is a backup for other genebanks, not a civilisational restart kit. It contains no tools, no livestock, no knowledge of how to grow any of it, and its −18 °C depends on active refrigeration backstopped by permafrost. A sim should treat it as reducing *agricultural-diversity loss*, not as raising P(recovery) directly.

**Knowledge preservation, the concrete case.** GitHub Arctic Code Vault ([archiveprogram.github.com](https://archiveprogram.github.com/arctic-vault/)): a **02 February 2020** snapshot of every active public GitHub repository, "**21TB of data … archived to 186 reels of film**", stored in the Arctic World Archive in a decommissioned Svalbard coal mine, **250 metres deep in permafrost**, in a facility "devoted to archival storage in perpetuity" with infrastructure intended to preserve materials for **~1,000 years**.

**Hanson's warning about all of this, which I think is the most important line in the recovery literature:**
> "Stocking a sanctuary full of the sorts of capital that we find valuable today could be even less useful than the inappropriate medicine, books, or computers often given by first world charities to the third world poor today. Machines would quickly fall into disrepair, and **books would impart knowledge that had little practical application** … **one hundred people cannot support an industrial society today, and perhaps not even a farming society.** They might have to start with hunting and gathering."

The academic refuge literature is Beckstead (2015), "How much could refuges help us recover from a global catastrophe?", *Futures* 72:36–44, DOI [10.1016/j.futures.2014.11.003](https://doi.org/10.1016/j.futures.2014.11.003). **I could not retrieve its abstract or figures** — paywalled, no OA copy, and both Semantic Scholar and OpenAlex have the abstract elided. Cite it as existing; do not attribute numbers to it.

---

## 6. What fraction must die before recovery is in doubt? (badly studied — here is everything I could actually retrieve)

**Be explicit in the sim that these are three different quantities:** (a) P(event occurs), (b) P(event kills a large fraction | it occurs), (c) P(humanity never recovers | it occurs). Almost every popular number conflates (b) and (c).

**The only paper that models the threshold structurally.** Hanson (2007/2008), retrieved and read in full:
- Threshold assumption: "let us assume, as a reference point for analysis, that **the survival of humanity requires that one hundred humans remain, relatively close to one another**, after a disruption and its resulting social collapse." Below that, "we assume humanity would become extinct within a few generations." His justification: "groups of about **seventy** people colonized both Polynesia and the New World (Murray-McIntosh et al. 1998; Hey 2005)."
- The co-location condition is load-bearing: "if the remaining survivors were **not all in one place, but distributed widely across the Earth and unable to move to come together, it might take many thousands of survivors** to save humanity."
- The collapse multiplier: in his reference parameterisation, "**of every fifty people left alive directly after the disruption, only one remains alive after the ensuing social collapse**."
- His severity-to-deaths mapping, which is directly implementable — hard cutoff `D = max(T, S)`, soft cutoff **`1/D = 1/S + 1/T`** where S is disaster severity, T is pre-disaster population, D the number killed. In the soft case the survivor count obeys a mirrored power law `P(L < s) = k's^α`.
- Retrieved power-law exponents (severity distribution, `P(S>s) = k·s^-α`): **wars, death power 0.41; earthquakes, death power 0.41 (energy power 1); hurricanes, death power 0.58; forest fires, area power 0.66; plagues, death power 0.26 (whooping cough and measles); floods/tornadoes/terrorist attacks 1.35–1.4; windstorms, energy power 12.** Low exponent = most expected deaths sit in the largest events. Plagues have the lowest exponent of all — the fat-tailed case.
- Recovery time from the floor: "Once they could communicate to share innovations and grow at the rate that our farming ancestors grew, **humanity should return to our population and productivity level within twenty thousand years.**"
- Growth-mode doubling times, all four from Hanson and all usable directly: **hunter-gatherer population doubled every ~250,000 years; farming population doubled every ~1,000 years; industrial-era world product has doubled roughly every 15 years**; and across each mode transition "growth was over a hundred times faster than before".

**The only published probability I could find for "fails to fully recover."** Denkenberger, Sandberg, Tieman & Pearce (2021), "Long-term cost-effectiveness of interventions for loss of electricity/industry compared to artificial general intelligence safety", *European Journal of Futures Research* 9(1), DOI [10.1186/s40309-021-00178-z](https://doi.org/10.1186/s40309-021-00178-z), PMC8451736. Conditional on *global loss of electricity/industry*, their two models give a **mean 16% (Model 1) and 7% (Model 2) reduction in long-term human potential** with current preparation. Their annual probability of global industrial loss is **0.01%–1% (Model 1)** and **0.05%–0.15% (Model 2)**. They also note that even at pre-industrial agricultural productivity (~1.3 dry tons per hectare per year) "this could feed everyone globally."
> This 7–16% is, as far as I can retrieve, **the closest thing in print to a published P(non-recovery)** — and note it is conditioned on *loss of industry*, not on a death fraction.

**Aggregate risk anchors I could verify.** Toby Ord, official book site [theprecipice.com/faq](https://theprecipice.com/faq): "My best guess is that humanity faces a **one-in-six chance of existential catastrophe over the next century**," with natural risks "about a **1 in 10,000 chance of existential catastrophe per century**", anthropogenic risks from nuclear weapons, climate change and environmental damage "each higher than all natural risks combined", and engineered pandemics and unaligned AI higher still.
> **Could not retrieve:** the per-risk figures of Ord's Table 6.1 (Open Book Publishers' open-access chapter reproducing them rate-limited me repeatedly; Wikipedia's article does not carry the table). **Could not retrieve:** the 2023 Existential Risk Persuasion Tournament medians — the paper is Karger, Rosenberg, Jacobs, Hickman & Tetlock (2025), "Subjective-probability forecasts of existential risk: Initial results from a hybrid persuasion-forecasting tournament", *International Journal of Forecasting* 41(2):499–516, DOI [10.1016/j.ijforecast.2024.11.008](https://doi.org/10.1016/j.ijforecast.2024.11.008), which is **not open access**, and the FRI report PDF exceeds the fetch size limit. **Could not retrieve:** Sandberg & Bostrom's 2008 GCR conference survey — `fhi.ox.ac.uk` no longer resolves (FHI is dissolved) and `web.archive.org` is blocked for me. Do not print numbers for any of these three without an independent retrieval.

**My honest synthesis of the threshold question:** *nobody has estimated it properly.* What the literature collectively implies is that **the death fraction is the wrong variable**. A 40% kill (Black Death) with institutions intact produced centuries of stagnation but never doubt about recovery. A ~75% kill (Xia et al.'s 150 Tg case) is modelled by its own authors without any claim of non-recovery. The published doubt starts not at a mortality percentage but at two other conditions: **loss of the industrial base globally and simultaneously** (Denkenberger et al.: 7–16% permanent loss) and **survivors falling below ~10² and being unable to reach each other** (Hanson). I would put the doubt zone at **f ≳ 0.99 combined with I ≳ 0.9 and D ≳ 5 years** — and I am flagging that number as **author-estimate, not citation**.

---

## 7. THE DELIVERABLE — proposed recovery function

**Inputs**
| Symbol | Meaning | Range |
|---|---|---|
| `f_d` | fraction of humanity killed *directly* by the event | 0–1 |
| `I` | fraction of industrial/energy/trade capacity destroyed or made inoperable | 0–1 |
| `D` | duration of the stress in years (nuclear winter length, pandemic wave, famine years) | 0–∞ |
| `N₀` | pre-event population | ~8.2 × 10⁹ (author-supplied; not sourced this session) |

### Stage 1 — collapse amplification (the deaths the event doesn't cause directly)

```
c(I, D) = 1 − exp( −λ · I · min(D, D_sat) / D_sat )      λ = 4.0,  D_sat = 5 yr
f_total = 1 − (1 − f_d)·(1 − c)
```
**Calibration, and why λ = 4 is not arbitrary.** Two independent published points pin it:
- Hanson's reference scenario at the extreme (I→1, long D) implies 49 of every 50 direct survivors die in the ensuing collapse → c = 0.98. `1 − exp(−4) = 0.982`. ✓
- Xia et al.'s 150 Tg case (essentially no direct global kill, agriculture+trade impaired at I ≈ 0.35, D ≈ 10 > D_sat) → `c = 1 − exp(−1.4) = 0.753`, against their stated **75% global fatality rate from starvation**. ✓

`λ` and `D_sat` are **fitted by me to those two anchors**; the functional form is my choice. `basis: derived/author-estimate`.

### Stage 2 — how many survivors are *reachable* by each other

Hanson's explicit warning is that scattered survivors don't count. Introduce a connectivity factor:
```
φ(I, D) = 1 / (1 + 999 · I · min(D, 5)/5)          φ ∈ [0.001, 1]
N_eff = N₀ · (1 − f_total) · φ
```
`basis: author-estimate` — the *need* for this term is Hanson's ("it might take many thousands of survivors"); the functional form and the 999 are mine.

### Stage 3 — P(species persists)

```
P_persist = Φ( ( log₁₀ N_eff − log₁₀ N₅₀ ) / σ )      N₅₀ = 500,  σ = 0.72
```
Calibrated so that:
- `P_persist(4,169) = 0.90` — Traill et al. 2007's median MVP, at Brook et al. 2006's own 90%-persistence-over-100-years criterion. **Sourced.**
- `P_persist(100) = 0.17` — soft reading of Hanson's hard floor. **Sourced anchor, soft mapping.**
- `P_persist(10⁴) = 0.965` — matches Frankham et al. 2014's Ne ≥ 1000 requirement at Ne/N ≈ 0.1–0.15. **Sourced anchor, extrapolated ratio.**
- `P_persist(1,280) ≈ 0.66` — the Hu et al. 2023 bottleneck, which *did* in fact persist. A value below 1 here is the right shape: it survived, but it was not safe.

`N₅₀ = 500` and `σ = 0.72` are **author-estimates fitted to the three anchors above**. Add a hard `P_persist = 0` for `N_eff < 50`.

### Stage 4 — P(re-industrialises | persists)

```
P_reind = 1 − p_fail(I, region_coal, knowledge)
```
- `I < 0.5`, institutions surviving somewhere: `p_fail ≈ 0` — **sourced**: Davis & Weinstein (severe local destruction, complete recovery in 15–20 yr) and Miguel & Roland (the most intense bombing in history, no detectable effect after 30 yr).
- `I ≈ 1`, population still ≥ 10⁷: `p_fail = 0.07–0.16` — **sourced**: Denkenberger, Sandberg, Tieman & Pearce (2021), reduction in long-term human potential from global industrial loss.
- `N_eff < 10⁵`: `p_fail` unknown. **This is the genuine hole in the literature.** Dartnell says an industrial revolution without coal would be "at a minimum, very difficult"; Hanson says resource depletion "would probably matter little"; the EIA datum (two-thirds of US coal is surface-mined) says shallow coal is regionally, not globally, exhausted. **Ship this as a user-facing slider with a wide prior (0.1–0.6), not a constant.** `basis: unresolved published disagreement`.

### Stage 5 — expected recovery time

Split it: `T_rec = T_dem + T_tech`.

**T_dem** — time to regain `N₀`, using regime-appropriate growth, all four rates from Hanson (2008) except the Black-Death rate, which I derived from Jedwab et al.:
```
T_dem = ln(N₀ / N_eff) / r
```
| Regime | r (yr⁻¹) | Doubling | Source |
|---|---|---|---|
| Hunter-gatherer | 2.8 × 10⁻⁶ | ~250,000 yr | Hanson 2008 |
| Preindustrial farming | 6.9 × 10⁻⁴ | ~1,000 yr | Hanson 2008 |
| Post-mass-mortality preindustrial, first ~50 yr | **2.9 × 10⁻⁴** | ~2,400 yr | **derived** from Jedwab et al. (10% mortality → still 8.7% down at 50 yr) |
| Industrial (product, not population) | 4.6 × 10⁻² | ~15 yr | Hanson 2008 |

**Sanity check:** from Hanson's 100 survivors, mixing hunter-gatherer → farming → industry, he states the answer directly: "**humanity should return to our population and productivity level within twenty thousand years**." Any implementation should reproduce ~2 × 10⁴ yr for `N_eff = 100`. Use that as your regression test.

**T_tech** — time to regain the *pre-event technological level*:
| Condition | T_tech | Basis |
|---|---|---|
| `I < 0.3`, localised | **15–20 yr** | Davis & Weinstein 2002 (Japanese cities, incl. Hiroshima/Nagasaki), **sourced** |
| Preindustrial-analogue, `f_total ≈ 0.4`, system-wide | **100–250 yr, sometimes never locally** | Black Death: decline continued to 1450; Spain's per-capita income "only exceeded after 1820"; Egypt's agrarian output still ~0.45 of 1315 in 1600; Winchester and Florence never recovered. **Sourced** |
| `I ≈ 1`, `N_eff` ≥ 10⁷, records survive | **100–500 yr**, `p_fail` 7–16% | `p_fail` **sourced** (Denkenberger et al. 2021); the time range is **author-estimate — no published figure exists** |
| `N_eff` < 10³ | **~2 × 10⁴ yr** | Hanson 2008, **sourced** |

### Worked outputs (for regression testing)

| Scenario | f_d | I | D | c | f_total | N_eff | P_persist | P_recovery | T_rec |
|---|---|---|---|---|---|---|---|---|---|
| 1918-flu analogue | 0.021 | 0.02 | 2 | 0.03 | 0.05 | 7.8e9 | 1.00 | ~1.00 | <20 yr (Barro: −6% GDP, transient) |
| WWII city bombing (local) | 0.21 local | 0.6 local | 4 | — | local | — | 1.00 | ~1.00 | **15–20 yr** (D&W) |
| Black Death, Europe | 0.40 | 0.15 | 5 | 0.45 | 0.67 regional | large | 1.00 | ~1.00 | **100–250 yr**, some places never |
| India–Pakistan, 5 Tg | 0.005 | 0.10 | 6 | 0.33 | 0.33 | 5.5e9 | 1.00 | ~1.00 | decades |
| US–Russia, 150 Tg | 0.02 | 0.35 | 12 | **0.75** | **0.76** ✓ *(Xia: 75%)* | 2.0e9 | 1.00 | 0.93 | 100–500 yr |
| Extreme: 99% direct kill + total industrial loss | 0.99 | 0.98 | 12 | 0.98 | 0.9998 | 1.6e6·φ(0.001) ≈ **1.6e3** | **0.72** | ~0.4 | **~2 × 10⁴ yr** |

Note what the last row does: it is the connectivity factor φ, not the death fraction, that drives P(recovery) below 1. That is the model's central claim, and it is Hanson's claim, not mine.

### Three things I would refuse to let the simulator assert

1. **That population "bounces back."** The single hardest empirical number here is Jedwab et al.'s: fifty years after a 10% mortality shock, cities were still 8.7% below baseline and regions were 13–15% below. Post-catastrophe demographic recovery in a preindustrial regime is ~0.03%/yr, not 1%/yr.
2. **That the Black Death "made Europe richer" as a general law.** It did in England and the Low Countries. In Spain, per-capita income was only exceeded after 1820. In Egypt, agrarian output was still at 45% of pre-plague level 250 years later. In Eastern Europe it plausibly produced the second serfdom. The wage gain was medium-run, not immediate — real wages *fell* first in many places.
3. **That Toba nearly killed us.** Two independent primary lines (Lake Malawi tephra; South African coastal sites) now say it did not.

---

### Sources actually retrieved this session

[Traill, Bradshaw & Brook 2007, *Biol. Conserv.* 139:159–166](https://doi.org/10.1016/j.biocon.2007.06.011) · [Brook et al. 2006, *Ecol. Lett.*](https://doi.org/10.1111/j.1461-0248.2006.00883.x) · [Traill et al. 2010, *Biol. Conserv.* 143:28–34](https://doi.org/10.1016/j.biocon.2009.09.001) · [Frankham, Bradshaw & Brook 2014, *Biol. Conserv.* 170:56–63](https://doi.org/10.1016/j.biocon.2013.12.036) · [Jamieson & Allendorf 2012, *TREE* 27:578–584](https://doi.org/10.1016/j.tree.2012.07.001) · [Frankham et al. 2013, *TREE* 28:187–188](https://doi.org/10.1016/j.tree.2013.01.002) · [Franklin, Allendorf & Jamieson 2014, *Biol. Conserv.* 176:284–285](https://doi.org/10.1016/j.biocon.2014.05.004) · [Hu et al. 2023, *Science* 381:979–984](https://doi.org/10.1126/science.abq7487) · [Alfani & Murphy 2017, *J. Econ. Hist.* 77:314–343](https://doi.org/10.1017/S0022050717000092) · [Jedwab, Johnson & Koyama 2022, *JEL* 60:132–178](https://doi.org/10.1257/jel.20201639) (read via [GWU IIEP WP-2020-14](http://www2.gwu.edu/~iiep/assets/docs/papers/2020WP/JedwabIIEP2020-14.pdf)) · [Alfani 2022, *JEL*](http://www2.gwu.edu/~iiep/assets/docs/papers/2020WP/JedwabIIEP2020-16.pdf) · [Johnson & Mueller 2002, *Bull. Hist. Med.* 76:105–115](https://europepmc.org/article/MED/11875246) · [Barro, Ursúa & Weng 2020, NBER WP 26866](https://www.nber.org/system/files/working_papers/w26866/w26866.pdf) · [Davis & Weinstein 2001, NBER WP 8517](https://www.nber.org/system/files/working_papers/w8517/w8517.pdf) · [Miguel & Roland 2006, NBER WP 11954](https://www.nber.org/system/files/working_papers/w11954/w11954.pdf) · [Ambrose 1998, *J. Hum. Evol.* 34:623–651](https://doi.org/10.1006/jhev.1998.0219) · [Lane, Chorn & Johnson 2013, *PNAS*](https://doi.org/10.1073/pnas.1301474110) · [Smith et al. 2018, *Nature*](https://doi.org/10.1038/nature25967) · [Dartnell 2015, *Aeon*](https://aeon.co/essays/could-we-reboot-a-modern-civilisation-without-fossil-fuels) · [EIA, Coal mining and transportation](https://www.eia.gov/energyexplained/coal/mining-and-transportation.php) · [Hanson 2008, "Catastrophe, Social Collapse, and Human Extinction"](https://mason.gmu.edu/~rhanson/collapse.pdf) · [Denkenberger & Pearce 2015, *Futures* 72:57–68](https://doi.org/10.1016/j.futures.2014.11.008) · [Denkenberger, Sandberg, Tieman & Pearce 2021, *Eur. J. Futures Res.* 9(1)](https://doi.org/10.1186/s40309-021-00178-z) · [Xia et al. 2022, *Nature Food* 3:586–596](https://doi.org/10.1038/s43016-022-00573-0) · [Rivers et al. 2024, *Global Food Security*](https://doi.org/10.1016/j.gfs.2024.100807) / [Zenodo preprint](https://doi.org/10.5281/zenodo.11484350) · [Jehn et al. 2024, *Earth's Future*](https://doi.org/10.1029/2023EF003710) · [Boyd & Wilson 2022, *Risk Analysis*](https://doi.org/10.1111/risa.14072) · [García Martínez et al. 2025, *Crit. Rev. Food Sci. Nutr.*](https://doi.org/10.1080/10408398.2024.2431207) · [Svalbard Global Seed Vault](https://www.seedvault.no/) · [Crop Trust](https://www.croptrust.org/work/svalbard-global-seed-vault/) · [GitHub Arctic Code Vault](https://archiveprogram.github.com/arctic-vault/) · [Ord, theprecipice.com FAQ](https://theprecipice.com/faq)

**Cited but NOT retrieved (do not attach figures to these without independent retrieval):** Pamuk 2007 *Eur. Rev. Econ. Hist.* 11:289–317 (paywalled); Beckstead 2015 *Futures* 72:36–44 (paywalled, abstract elided); Karger et al. 2025 *IJF* 41:499–516 / the 2023 XPT medians (not OA; FRI report PDF exceeds fetch limit); Ord's *Precipice* Table 6.1 per-risk figures; Sandberg & Bostrom 2008 GCR survey (fhi.ox.ac.uk no longer resolves, web.archive.org blocked).