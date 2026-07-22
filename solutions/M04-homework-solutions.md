Model solutions for the Section 25 problem set. Numeric answers are recomputed by
`build/checks/M04-homework-check.js` and enforced by verify-solutions.js. Inputs tagged
[VERIFY@PUB] use an illustrative prediction table and PR curve consistent with Section 7.

**1. Metrics.** Take ten predictions whose best-match IoU values are
$\{0.85, 0.72, 0.68, 0.55, 0.52, 0.48, 0.40, 0.30, 0.20, 0.10\}$ against 8 ground-truth
fruit [VERIFY@PUB]. A prediction is a true positive when its IoU clears the match
threshold. At IoU $\ge 0.5$ five predictions match, giving TP=5, FP=5, FN=3, hence
$\text{Precision}=TP/(TP+FP)=$ 0.50, $\text{Recall}=TP/(TP+FN)=$ 0.625, and
$F_1=2PR/(P+R)=$ 0.56. Raising the match bar to IoU $\ge 0.7$ keeps only two matches, so
precision falls to 0.20, recall to 0.25, and $F_1$ to 0.22. The lesson: a "good" detection
count is meaningless without stating the IoU threshold it was scored at.

**2. Operating point.** Tabulate the PR curve over confidence thresholds
$\tau\in\{0.3, 0.5, 0.7, 0.9\}$ with recall $R=\{0.95, 0.85, 0.65, 0.40\}$ and
false-positive rate $\{0.40, 0.20, 0.08, 0.02\}$ [VERIFY@PUB]. With a cost ratio
$v_H/c_F=5$ (a missed ripe melon costs five wasted cycles), the mission value
$U(\tau)\propto (v_H/c_F)\,R(\tau)-\text{FPrate}(\tau)$ evaluates to
$\{4.35, 4.05, 3.17, 1.98\}$. The maximum is 4.35, so the optimum sits at the lowest
threshold, tau* = 0.3, and the recall you would deploy is 0.95. You accept the extra false
positives because their wasted cycles fit the cycle-time margin (CEC-01) while a missed
melon is lost yield: the operating point biases toward high recall by consequence, not
convention (EI-04).

**3. Data coverage.** A defensible plan pairs real field capture with targeted synthetic
data along the M2/M3 variability axes. Real imagery must cover the field's dominant and
tail conditions: full-sun and overcast illumination, occlusion by leaves and neighboring
fruit, the ripeness gradient (the actual decision boundary), and the stereo pick standoff.
Synthetic data is used where real capture is scarce, unsafe, or unlabelable at scale: rare
ripeness and defect classes, extreme occlusion geometries, and controlled lighting sweeps
where pixel-perfect masks are free. Each source is justified by what it must cover and why
the other cannot supply it; synthetic never substitutes for the on-distribution real tail
that defines deployment.

**4. Architecture choice.** A single-stage detector is justified here because the edge
budget (M6) rewards one forward pass at high recall over the pick standoff, the object
class count is small, and latency against the cycle-time budget is a hard constraint. The
one condition that flips the choice is a shift toward many fine-grained classes or
long-range relational reasoning (dense clusters where global context resolves identity),
where a transformer's attention earns its extra cost.

**5. (Grad) Class imbalance.** Fruit pixels are rare relative to background, so a naive
cross-entropy loss is dominated by the majority term: the gradient is overwhelmingly the
easy-background signal, the model minimizes loss by predicting background, and recall on
the minority (fruit) class collapses. Re-weighting by inverse class frequency, or a
focal-style loss that down-weights easy well-classified examples, restores gradient mass to
hard fruit pixels and lifts the achievable recall at a fixed threshold, shifting the whole
PR curve up where the operating point lives. The fix is thus not cosmetic: it is what makes
the high-recall operating point of problem 2 reachable at all.

**6. (Grad) Sensitivity of the operating point.** Re-optimize $U(\tau)$ as the cost ratio
$v_H/c_F$ varies over the same table. At a low ratio of 1 (a false positive nearly as
costly as a miss) the values become $\{0.55, 0.65, 0.57, 0.38\}$; the maximum is 0.65, so
tau* = 0.5, a stricter, precision-leaning point. As the ratio rises to 5 (and above) the
optimum moves down to $\tau=0.3$ and recall $\to 0.95$. So $\tau^\ast$ shifts lower, toward
higher recall, as ripe fruit grows more valuable relative to a wasted cycle. Because the
operating point rides on $v_H/c_F$, estimating that ratio is an M16 economics input, not a
free parameter, which is why perception engineering must reach into the mission economics
to set its own threshold.
