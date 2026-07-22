Model solutions for the Section 25 problem set. Numeric answers are recomputed by
`build/checks/M10-homework-check.js` and enforced by verify-solutions.js. Inputs tagged
[VERIFY@PUB] use an illustrative parameter set consistent with Section 7.

**1. Drive speed and throughput.** With fruit spacing $d=0.5$ m, pick cycle
$T_\text{cycle}=8$ s, and reposition time $T_\text{move}=2$ s [VERIFY@PUB]: continuous
no-miss drive is bounded by $v\le d/T_\text{cycle}=$ 0.063 m/s (CEC-01). Stop-and-pick
(index) has effective rate $1/(T_\text{cycle}+T_\text{move})=$ 0.10 fruit/s, an effective
advance of $d\times\text{rate}=$ 0.050 m/s. Continuous is faster (0.063 vs 0.050 m/s), so
recommend continuous drive *if* perception and the arm can acquire and pick on the move;
otherwise index, trading throughput for a static, easier pick.

**2. Slope stability.** With track width $w=0.7$ m and CoG height $h=0.4$ m [VERIFY@PUB],
tip-over occurs at $\tan\theta_\text{tip}=(w/2)/h$, i.e. $\theta_\text{tip}=$ 41 deg. On a
15 deg side slope the stability margin is
$(w/2)\cos\theta-h\sin\theta=$ 0.235 m, comfortably positive. Lowering the CoG to
$h=0.3$ m raises the tip-over angle to 49 deg and increases the margin at every slope:
because $\theta_\text{tip}=\arctan((w/2)/h)$, reducing $h$ helps more than widening $w$ per
unit of packaging cost, which is why minimizing CoG height is the primary stability lever.

**3. Arm-swing stability.** Swinging a payload shifts the CoG laterally by
$\Delta=m_\text{fruit}\,r_\text{swing}/m_\text{total}=9\cdot0.5/150=$ 0.030 m (toward the
downhill edge, worst case). Requiring the dynamic margin
$(w/2)\cos\theta-h\sin\theta-\Delta\ge 0.05$ m safety [VERIFY@PUB] gives a maximum safe
working slope of 33 deg, below the 41 deg static tip-over: the swing eats real slope
headroom. One mitigation is to constrain the swing trajectory to keep the payload on the
uphill side (or reduce $r_\text{swing}$) when operating on a slope, restoring margin without
redesigning the base.

**4. Track-width interval.** The feasible interval is
$[w_\text{reach}, w_\text{maneuver}]=[0.55, 0.90]$ m (reach lower bound from M8,
maneuverability upper bound). Checking stability at $h=0.4$ m: the narrow end $w=0.55$ m
tips at 35 deg and the wide end $w=0.90$ m tips at 48 deg, both well above the envelope's
working slopes, so the whole interval is stable. A defensible pick is $w=$ 0.75 m: it sits
high in the interval for stability headroom and arm-swing margin (problem 3) while staying
below the maneuverability limit, so it covers the bed, stays stable with payload swing, and
still turns within the headland.

**5. (Grad) Lateral budget.** The workspace constrains lateral navigation by
$3\sigma_\text{lat}\le W_\text{ws}/2-\text{margin}$. With reachable span
$W_\text{ws}=0.55$ m and a 0.05 m margin [VERIFY@PUB], $\sigma_\text{lat}\le$ 75 mm. Since
$\sigma_\text{lat}=\sqrt{\sigma_\text{center}^2+\sigma_\text{loc}^2}$, an equal split sets
each of bed-centering and localization to a target of 53 mm ($=75/\sqrt2$). These become the
concrete per-subsystem accuracy specs (CEC-03): the row-follow/bed-centering controller and
the localization estimator each must hold $1\sigma\le$ 53 mm for the arm to reach every
fruit inside its workspace.

**6. (Grad) Envelope design.** Define the operating envelope for a stated field as the joint
bounds on side slope, row spacing, terrain roughness, fruit density, and lighting. The
binding edge case differs per axis: for stability it is the steepest side slope taken with
the arm swung downhill under max payload (problem 3); for navigation it is the narrowest,
most curved row where lateral error (problem 5) is tightest against the workspace; for
throughput it is the densest fruit spacing that forces the shortest cycle against CEC-01.
Validate each at its edge: instrumented tilt-table and slope trials for stability, tracked
row-follow error against the workspace budget for navigation, and timed pick runs at peak
density for throughput, so each envelope edge is measured, not assumed.
