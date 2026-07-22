Model solutions for the Section 25 capstone milestones (interim reflective exercises).
Numeric answers are recomputed by `build/checks/M17-homework-check.js`, which composes each
course budget from its originating module's formula, and are enforced by verify-solutions.js.
Inputs tagged [VERIFY@PUB] use the illustrative parameter sets carried through Modules 2-16.

**1. Compose the budgets.** Assembling the six budgets for the resolved design and checking
them simultaneously (7.1):
- *Placement (CEC-03):* RSS over all contributors gives $3\sigma_\text{place}=$ 23.2 mm,
  inside the capture tolerance $c=$ 30 mm.
- *Grip-force window (CEC-02):* the anti-slip lower bound is $F_\text{slip}=$ 110 N and the
  anti-bruise upper bound with a compliant pad is $F_\text{bruise}=$ 159 N, so the window
  $[110, 159]$ N is non-empty and the operating force sits inside it.
- *Cycle time (CEC-01):* with the hydraulic pump pipelined so the arm and place stages no
  longer serialize (resolving the M13 emergent overrun), $T_\text{cycle}=$ 5.8 s, inside the
  $d/v=$ 6.25 s budget.
- *Power/thermal (M12):* the steady-state component temperature is 80 deg C, under the
  85 deg C limit at envelope max.
- *Reliability (M14):* the series-system MTBF is 333 h.
- *Cost (M16):* cost-per-acre is $81 and net value/acre is $5,439, well above the manual
  alternative.

All six hold together, so the composed design closes. The tightest margins are cycle time
and thermal, so those are the budgets to watch, and the honest caveat is that several inputs
are twin-fidelity projections until field-validated (CEC-06), not yet field-proven.

**2. Resolve a tension.** Take compliance vs placement stiffness (7.2, EI-17). The mechanism
subsystem's *local* optimum is maximum stiffness, which minimizes deflection error and looks
best for placement, but a stiff pad ($E^\ast=3$ MPa) collapses the anti-bruise bound to
$F_\text{bruise}=$ 6.4 N, far below $F_\text{slip}=110$ N, so the grip-force window is empty
and *no* grasp succeeds. The gripper subsystem's local optimum is maximum compliance, which
widens the window but inflates $\sigma_\text{defl}$ and threatens the placement budget. The
*system* optimum is neither extreme: an intermediate pad ($E^\ast=0.6$ MPa) keeps
$F_\text{bruise}=$ 159 N (window open) while holding $\sigma_\text{defl}$ small enough that
$3\sigma_\text{place}=23.2$ mm still fits the tolerance. The deliberately "suboptimal"
(non-maximal) stiffness is the choice that serves the whole machine, the mathematical face of
EI-17.

**3. Weakest link.** The weakest load-bearing claim in the acceptance argument is the
grasp-bruise rate: it is field-mandatory (CEC-06), fidelity-sensitive to the contact/fluid
rung, and it drives both the safety case (M15) and the revenue model (a point of bruise rate
is about $60/acre, M16). Everything downstream, net value/acre, the quality claim, the yield
economics, rests on a bruise rate currently backed by twin evidence and bench trials, not a
sized field campaign. What strengthens it: a stratified field validation on real fruit across
the envelope edges (EI-14), sized for the reliability target (M14, hundreds of representative
grasps), with the twin's contact rung validated to a stated tolerance so the twin can carry
the bulk of the evidence and the field trial confirms it. Stated honestly (EI-15): until that
campaign exists, the acceptance is "deploy-with-limits," not "proven."

**4. (Grad) Multi-objective framing.** Frame the machine as maximizing harvest value minus
cost subject to hard constraints (safety, placement $3\sigma\le c$, cycle time $\le d/v$,
power/thermal). For two objectives, recall (yield) vs power/cost, the Pareto front is the set
of non-dominated operating points: a small model (low recall, low power), a medium model (the
knee, most recall per watt), and a large model (highest recall but power/heat that cuts
endurance and risks throttling). A single scalar objective, say "maximize recall," misleads
because it walks off the knee to a corner that violates the power/thermal constraint or loses
more to shortened runtime and throttling than the extra recall earns; the right choice is the
Pareto knee that respects every constraint (EI-04/EI-17), not the extremum of any one axis.

**5. (Grad) Transfer analysis.** For a variant machine (say a different crop or a gantry
instead of a rover), the CEC *bounds* change while the *framework* does not: the capture
tolerance $c$, the grip-force window edges, the cycle-time budget $d/v$, and the thermal
limit all take new numbers, and the *dominant terms* shift (a lighter fruit may make
$F_\text{slip}$ rather than $F_\text{bruise}$ binding; a slower row may move the bottleneck
from cycle time to reliability). What stays fixed is the method: RSS budget composition, the
window as an intersection of physical bounds, dominant-term (EI-05) prioritization,
propose-then-bound safety (EI-07), and evidence-weighted acceptance (CEC-06). That a change of
crop or kinematics re-numbers the bounds but leaves the tools intact is exactly the claim that
the framework is general, the budgets are the machine, the method is the discipline.
