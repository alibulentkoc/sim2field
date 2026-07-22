Model solutions for the Section 25 problem set. Numeric answers are recomputed by
`build/checks/M01-homework-check.js` and enforced by verify-solutions.js. Inputs
tagged [VERIFY@PUB] use the module's Section 7 illustrative values.

**1. Requirements rewriting.** Each rewrite names a quantity, a threshold, and a
verification method, and maps to a Section 9 requirement type:

- "gentle" -> *The gripper shall hold peak contact pressure below the bruise threshold [VERIFY@PUB]* (Functional; verify by Test). Maps to the Grip-Force Window requirement.
- "fast" -> *The pick cycle shall satisfy $T_\text{cycle} \le d/v$ at the target drive speed* (Performance; verify by Test/Analysis).
- "no internet" -> *No control-loop function shall depend on a network* (Constraint; verify by Inspection). Maps to the no-cloud requirement (SR-C-01).

Grading: each rewrite must be measurable and paired with a verification method; vague, unverifiable answers score low (see rubric).

**2. Cycle-time budget.** With the Section 7.1 allocation $T_\text{cycle} = 6.6$ s and
along-row spacing $d \approx 1.2$ m [VERIFY@PUB]:

- Maximum drive speed for a single end-effector: $v \le d/T_\text{cycle} = 1.2/6.6 \approx 0.18$ m/s, which is below walking pace ($0.4$ m/s).
- End-effectors to sustain walking pace: require $T_\text{cycle}/N \le T_\text{arrival} = d/v_\text{walk} = 1.2/0.4 = 3.0$ s, so $N \ge T_\text{cycle}/T_\text{arrival} = 6.6/3.0 = 2.2$, i.e. $N = 3$ end-effectors.

**3. Error budget.** Capture tolerance $c \approx 30$ mm [VERIFY@PUB], so
$\sigma_\text{total} \le c/3 = 10$ mm. Given $\sigma_\text{loc}=6$, $\sigma_\text{he}=3$,
$\sigma_\text{dyn}=4$ mm, solve for the mechanism term:

$\sigma_\text{mech} = \sqrt{(c/3)^2 - (\sigma_\text{loc}^2 + \sigma_\text{he}^2 + \sigma_\text{dyn}^2)} = \sqrt{100 - 61} = \sqrt{39} \approx 6.2$ mm.

This is the mechanism-positioning source, owned by M8 (manipulator kinematics and mechanism tolerance).

**4. Functional decomposition.** Canopy management decomposes into *detect occluding
foliage* (Perceive), *plan a clearing motion* (Decide), and *move foliage aside* (Act),
each placed on the signal-to-action spine. The interface it presents to perception is an
unobstructed line of sight and reach corridor to the fruit. Grading rewards a clean
function-to-spine mapping and a named interface.

**5. (Grad) Margin and sensitivity.** At $v = 0.15$ m/s, $T_\text{arrival} = d/v = 1.2/0.15 = 8.0$ s,
so the cycle-time margin is $T_\text{arrival} - T_\text{cycle} = 8.0 - 6.6 = 1.4$ s. The
sensitivity is $\partial v_\text{max}/\partial T_\text{cycle} = -d/T_\text{cycle}^2 = -1.2/6.6^2 \approx -0.028$ (m/s)/s.
The highest-leverage term is the largest single allocation, $t_\text{transfer} = 1.5$ s;
attacking it moves the budget most (the dominant-term reasoning formalized later as EI-05).

**6. (Grad) Trade-study construction.** A defensible weighted matrix for the autonomy-level
trade (TS-2) names 4 to 6 criteria (e.g., safety, cost, field robustness, development risk),
assigns weights summing to 1, scores each option, and defends the winner in one paragraph
with the strongest counter-argument stated. Graded on criterion relevance, weight
justification, and honest treatment of the objection (see rubric).
