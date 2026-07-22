Model solutions for the Section 25 problem set. Numeric answers are recomputed by
`build/checks/M15-homework-check.js` and enforced by verify-solutions.js. Inputs tagged
[VERIFY@PUB] use an illustrative parameter set consistent with Section 7.

**1. Hazard/risk.** Rank each hazard by $R=S\times L$ (severity 1-10, likelihood per 1000 h
from the M14 FMEA) [VERIFY@PUB]: over-force bruise/crush $(4\times1.2)=$ 4.8; tip-over on
slope $(9\times0.3)=$ 2.7; the combined stored-energy fault, a hydraulic accumulator plus
electrical discharge together, $(10\times0.5)=$ 5.0; drive collision $(8\times0.4)=$ 3.2;
gripper pinch/entanglement $(6\times0.6)=$ 3.6. The dominant risk is the stored-energy fault
at 5.0: not the most frequent, but its severity (10) makes its risk the highest, so it leads
the mitigation queue. This is EI-05 in the safety frame, prioritize by risk, not by whichever
hazard is most familiar.

**2. Independence.** The software safety monitor depends on: its power rail, its compute
node, its sensor input (force/tilt), and its clock. A plausible common-cause failure is a
shared power rail or shared sensor with the control loop it is meant to check, so a single
brownout or a miscalibrated sensor disables *both* the controller and the monitor at once,
defeating the redundancy. Break it (EI-11) by giving the monitor an independent power source,
an independent sensor path, and an independent clock/watchdog, and by adding a physical
backstop (relief/compliance, EI-09) that needs no power at all, so no single cause takes down
detection and reaction together.

**3. Safety case.** For the over-force hazard: *claim*, "the machine will not bruise fruit by
over-force in normal operation"; *argument*, defense in depth, the learned bound (M7) plus the
regulated controller (M9) plus physical relief/compliance (EI-09) plus an independent monitor
(EI-11), each of which alone caps force; *evidence* (from M14), bench force-regulation trials
and a field grasp campaign sized for the reliability target, tagged by fidelity rung
(controller validated on hardware, relief validated physically, CEC-06); *residual risk*, a
common-cause fault (e.g. a wrong force calibration corrupting controller and monitor together,
problem 5). The residual is acceptable only if the physical relief, which does not share that
calibration, still bounds peak force, so the residual does not rest on the common-cause
assumption. If it did, it would not be acceptable.

**4. Ethics.** Take worker safety: an autonomous drive-over machine operating near field
workers creates crush and collision hazards a hand crew does not. A responsible design choice
is a certified safety-rated perception-and-stop zone around the machine (independent of the
harvest perception stack) plus a conspicuous state indicator and a hardware e-stop, so a
person entering the envelope reliably halts it. A responsible *where-not-to-operate* bound is
to prohibit autonomous operation when workers are inside the machine's braking envelope on
slope (where stopping distance grows), and on grades or visibility below the validated
envelope, deferring to supervised or manual mode there rather than assuming the field is
empty.

**5. (Grad) Common-cause residual.** For a two-layer defense with per-layer failure
probability $p=0.01$, if the layers were truly independent the residual (both fail) would be
$p^2=$ 0.0001. Introduce a beta-factor $\beta=0.1$: a fraction $\beta$ of each layer's
failures are common-cause, so the residual becomes $((1-\beta)p)^2+\beta p=$ 0.00108, and the
common-cause floor $\beta p=$ 0.001 dominates it, about 10x the independent product 0.0001.
The lesson: past a modest redundancy, the residual is set almost entirely by $\beta$, not by
adding more identical layers. Independence (small $\beta$) is what actually buys safety, which
is why Section 6.5 certifies it rather than assuming the $\prod_i p_i$ product.

**6. (Grad) Contested ethics.** On labor displacement the strongest cases genuinely conflict:
*for deployment*, mechanization can relieve dangerous, physically punishing stoop labor,
address seasonal labor shortages, and lower food cost; *against*, it can eliminate the
livelihoods of a vulnerable, often migrant workforce with few alternatives and concentrate the
gains with capital owners. A defensible engineer does not get to resolve this by fiat, but
professional responsibility is invariant to which side one favors: be honest about the
machine's real capabilities and limits (no overclaiming to buyers or regulators), design for
safety of the workers who remain, surface the displacement effect to decision-makers rather
than hiding it, and refuse to misrepresent validation evidence (CEC-06). The engineer owes
truthful competence and safety regardless of the policy outcome.
