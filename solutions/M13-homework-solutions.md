Model solutions for the Section 25 problem set. Numeric answers are recomputed by
`build/checks/M13-homework-check.js` and enforced by verify-solutions.js. Inputs tagged
[VERIFY@PUB] use an illustrative parameter set consistent with Section 7.

**1. Fidelity sensitivity.** Each decision stabilizes at the lowest rung where further
fidelity stops changing it. *Reach/workspace* stabilizes at the kinematic rung: geometry
alone settles whether a fruit is reachable, and adding contact physics does not move the
answer. *Drive-speed vs cycle time* stabilizes at the dynamic/timing rung: it needs stage
timing and shared-resource effects but not deformable contact. *Grasp-bruise*, however, is
fidelity-sensitive all the way to the contact/fluid rung (CR-03): its outcome keeps changing
as pad compliance and fruit deformation are modeled, so it does not stabilize until contact
fidelity is present. The grasp-bruise decision is the one sensitive to the contact rung.

**2. Composed budget.** Assembling placement over all real contributors (mm, 1-sigma:
perception 3, calibration 3, sync 2, estimation 2, mechanism 5, navigation 3) [VERIFY@PUB]
gives $\sigma_\text{place}=\sqrt{\sum_i\sigma_i^2}=$ 7.7 mm, so $3\sigma_\text{place}=$
23.2 mm, inside the 30 mm capture tolerance (CEC-02): placement passes. For timing, the
stage times sum to 5.8 s, but the arm and place stages share the hydraulic pump, adding a
0.6 s serialization that the per-subsystem budgets did not show, so the composed cycle time
is 6.4 s against a $d/v=$ 6.25 s budget (CEC-01): an emergent overrun of 0.15 s. Placement
composes cleanly; timing does not, and the overrun is only visible once the shared resource
is modeled at the system level.

**3. Rung validation.** For each rung compute the reality gap $g_f=|\text{twin}_f-\text{real}|$
and accept if $g_f\le\text{tol}_f$ (CEC-06). The kinematic rung predicts reach 0.640 m
against a measured 0.652 m, a gap of 12 mm within a 15 mm tolerance, so accept. The contact
rung predicts a grasp bound of 159 N against a measured 178 N, a gap of 19 N exceeding the
15 N tolerance, so retune: widen the contact randomization or recalibrate the pad model
until the gap closes, because an unvalidated contact rung cannot back a bruise claim.

**4. Integration strategy.** Incremental integration adds one subsystem (one interface) at a
time, so if a metric breaks when subsystem $k$ is added, the fault is localized to $k$'s
interfaces, an $O(n)$ debug path. Big-bang integration turns on everything at once, so a
break could originate in any of the $O(n^2)$ pairwise interactions with no localization. A
SIM2FIELD example of an emergent coupling is the hydraulic pump shared between the arm and
the placement stage (problem 2): each subsystem meets its own timing in isolation, yet
composing them serializes on the pump and blows the cycle-time budget, a surprise that only
appears at the interface and is caught cheaply when that interface is added incrementally.

**5. (Grad) Interaction analysis.** With $n=6$ subsystems, big-bang integration must reason
about $n(n-1)/2=$ 15 pairwise interactions at once, whereas incremental integration exposes
them $n-1=$ 5 interface additions at a time, isolating each. But incremental *interface*
testing still hides *dynamic* couplings that appear only under simultaneous operation:
shared-resource contention (the pump), thermal/power coupling under coincident peak load,
and timing/jitter interactions that need all producers running at rate. Surface these with
system-level stress tests, coincident worst-case load runs, and long-duration soak on the
twin, not just pairwise interface checks.

**6. (Grad) Evidence argument.** A validated twin can serve as verification evidence for a
requirement only under strict conditions. The evidence is admissible when: the requirement's
deciding physics is captured at or below the twin's fidelity rung (the decision has
stabilized there, problem 1); that rung has been validated against real data with a reality
gap inside tolerance (problem 3); and the requirement's margin exceeds the residual gap so
the twin's error cannot flip the verdict. Stated precisely, the twin verifies a requirement
$R$ iff $R$ is not fidelity-sensitive above the validated rung $f$, $g_f\le\text{tol}_f$, and
the requirement margin $>g_f$. Absent any of these, the twin is illustrative, not evidence,
and M14/M15 must fall back to physical validation for that requirement.
