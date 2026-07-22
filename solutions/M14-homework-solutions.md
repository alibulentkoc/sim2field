Model solutions for the Section 25 problem set. Numeric answers are recomputed by
`build/checks/M14-homework-check.js` and enforced by verify-solutions.js. Inputs tagged
[VERIFY@PUB] use an illustrative parameter set consistent with Section 7.

**1. Evidence matrix.** Assign each requirement the weakest sufficient evidence and its
fidelity rung: geometry/reach requirements accept kinematic-twin evidence; timing/budget
requirements accept a validated dynamic twin; but any requirement whose deciding physics is
contact/safety (grasp-bruise, over-force release, tip-over on slope) is *field-mandatory*
(CEC-06), because the twin cannot be trusted at the rung that decides them until confirmed
against real hardware. The rule: a requirement is field-mandatory when it is
fidelity-sensitive above the highest *validated* rung, or when its failure is unsafe and
irreversible, so no simulated evidence is admissible on its own.

**2. Sample size.** To demonstrate reliability $R=0.99$ at confidence $1-\alpha=0.95$ with
zero allowed failures, $n\ge\ln(\alpha)/\ln(R)=\ln(0.05)/\ln(0.99)=$ 299 trials
[VERIFY@PUB]. A demo of $n=1$ proves almost nothing about high reliability: with zero
failures in one trial the most you can claim at 95% confidence is $R\ge\alpha^{1/n}=$ 5%,
i.e. the machine is at least 5% reliable. That is why "it worked in the demo" is not a
reliability claim, demonstrating 99% reliability takes hundreds of representative trials,
not one success.

**3. FMEA and the dominant mode.** With per-1000-hour failure rates [VERIFY@PUB] perception
0.5, hydraulic 1.2, drive 0.8, compute 0.3, sensors 0.2, the series-system rate is
$\lambda_\text{sys}=\sum_i\lambda_i=3.0$ per 1000 h, so MTBF $=1/\lambda_\text{sys}=$ 333 h.
The dominant failure mode is hydraulic (1.2, the largest $\lambda_i$). Halving the dominant
mode raises MTBF to 417 h (a 25% gain), whereas halving a minor mode (sensors) raises it
only to 345 h (a 3.4% gain). Because $\partial\lambda_\text{sys}/\partial\lambda_i$ is
largest for the dominant mode, reliability effort belongs on the hydraulic grasp path, this
is EI-05 in the reliability domain.

**4. Adversarial plan (EI-14).** Design validation to attack the envelope edges, not its
comfortable center: stratify by slope, light, fruit size, and dust, and allocate trials to
the corners (steepest slope with payload swing, harshest backlight, smallest/largest fruit,
dustiest optics). State pass/fail up front, e.g. grasp success rate meets its lower
confidence bound *within each hard stratum*, not just on the pooled average. A failure at an
edge is informative: it localizes the binding condition (which stratum broke) and tells you
whether the limit is perception, mechanism, or control, converting a vague "sometimes fails"
into a specific, reproducible envelope boundary to fix or to document as out-of-envelope.

**5. (Grad) Wear-out.** Distinguish random from wear-out modes: the compute/electronics
failures are approximately random (constant hazard, memoryless, well modeled by a fixed
$\lambda$), whereas the hydraulic seal is a wear-out mode (increasing hazard, Weibull shape
$\beta>1$) as abrasion accumulates. Modeling the seal with an increasing hazard
$h(t)=(\beta/\eta)(t/\eta)^{\beta-1}$ means a constant-$\lambda$ MTBF estimate *overpredicts*
end-of-season reliability: failures cluster late as parts wear, so the season-long estimate
must integrate the rising hazard (or schedule preventive replacement before the hazard knee)
rather than assume the flat rate that fits the electronics.

**6. (Grad) Evidence admissibility.** A validated-twin result is *not* admissible for the
grasp-bruise requirement on its own, because grasp-bruise is fidelity-sensitive to the
contact/fluid rung (M13) and the consequence (crop damage) is the machine's core quality
metric. It becomes admissible only when three conditions hold (CEC-06): the twin models the
contact rung that decides bruising; that rung is validated against real grasp data with a
reality gap inside tolerance; and a field confirmation on real fruit reproduces the twin's
bruise-rate within the requirement's margin. With rung, tolerance, and field confirmation in
place, the twin can carry the bulk of the evidence and the field trial confirms it;
lacking any one, the requirement reverts to direct physical validation.
