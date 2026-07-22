Model solutions for the Section 25 problem set. Numeric answers are recomputed by
`build/checks/M07-homework-check.js` and enforced by verify-solutions.js. Inputs tagged
[VERIFY@PUB] use an illustrative parameter set consistent with Section 7.

**1. Decision gating.** Admit a candidate only if ripeness confidence clears a floor
($r\ge 0.6$) and pose uncertainty is inside the gate ($u\le 0.4$), then sequence admitted
fruit by descending value $V_i=w_r\,r_i(1-u_i)/c_i$ (Section 7.1, $w_r=1$) [VERIFY@PUB].
For candidates A$(0.90,0.20,1.0)$, B$(0.75,0.10,1.2)$, C$(0.55,0.30,1.0)$,
D$(0.85,0.50,0.8)$, E$(0.80,0.35,1.5)$ as $(r,u,c)$: C fails the ripeness floor and D fails
the uncertainty gate, so defer C and D. The admitted values are $V_A=$ 0.72, $V_B=$ 0.56,
$V_E=$ 0.35, giving the pick order A, B, E. Justification in yield/risk terms: the value
function rewards ripe, low-uncertainty fruit (protecting yield and avoiding wasted or
damaging picks) and penalizes cycle cost (protecting throughput, CEC-01), so the ordering
harvests the most mission value per unit time while the gates keep low-confidence or unripe
targets out of the queue.

**2. Reward design.** A window-tied reward is
$R=+R_\text{success}\,\mathbb{1}[\text{grasp inside Grip-Force Window}]
-\lambda_\text{slip}\mathbb{1}[\text{slip}]-\lambda_\text{bruise}\mathbb{1}[\text{bruise}]
-\lambda_\text{miss}\mathbb{1}[\text{miss}]$, crediting success only when contact force
lands inside the window (CEC-02). A naive alternative that rewards "any contact" or
"maximal grip" is reward-hackable: the policy learns to crush every fruit (guaranteed
contact, high grip) and scores well while bruising the crop. Tying the success indicator to
window membership removes the exploit, because forces above the bruise bound score no
reward and incur the bruise penalty, so the only way to earn reward is to land inside the
physically safe window.

**3. Bounding and fallback.** The executed action is the projection onto the safe set
$\mathcal S$ (Grip-Force Window intersect reach), $a_\text{exec}=\Pi_{\mathcal S}(a_\pi)$.
With the window $[110, 159]$ N (from M2) [VERIFY@PUB], a policy proposal of 185 N projects
to 159 N (clamped to the upper bound), a proposal of 95 N projects to 110 N (clamped to the
lower bound), and a proposal of 130 N passes through unchanged at 130 N. When the safe set
is empty (window and reach do not intersect) or confidence fails its gate, there is no
projection to take, so the system executes the fallback: defer the fruit, re-perceive, or
retreat to a safe pose, never a raw policy action. The worst-case executed force is bounded
by $\mathcal S$ regardless of what the policy proposes (EI-07).

**4. Sim-to-real.** Under the robust-transfer formulation
$\pi^\ast=\arg\max_\pi \mathbb E_{\xi\sim p(\xi)}[\mathbb E_\pi[G\mid\xi]]$, a policy trained
to maximize expected return across a distribution of simulator parameters $\xi$ (stiffness,
friction, mass, sensor noise, lighting) is optimal in expectation over that spread, so the
single real-world $\xi$ it later meets is just one more draw it was trained to handle: this
is why domain randomization transfers. Too-narrow randomization leaves the real $\xi$
outside the training support, so the reality gap reopens and the policy is brittle off its
narrow band; too-wide randomization forces one policy to cover parameter regimes that never
occur, degrading peak performance on the real regime (the robustness-optimality tradeoff).

**5. (Grad) Robust optimization.** Domain randomization is robust optimization over
$p(\xi)$: maximizing expected return $\mathbb E_{\xi\sim p}[\cdot]$ is the risk-neutral
form, while maximizing worst-case return $\min_{\xi\in\text{supp}\,p}[\cdot]$ is the
distributionally-robust (conservative) form. The tradeoff is that widening $p(\xi)$ buys
robustness at the cost of peak optimality, since capacity spent covering unlikely regimes
is capacity not spent perfecting the likely one. Choose $p(\xi)$ from measured field
variability: center it on the real operating point, widen it to just cover the observed
tail, and retune it using the measured sim-to-real gap (Section 7.3) rather than guessing,
so the support matches reality without wasting capacity beyond it.

**6. (Grad) Verifiable learned system.** A learned policy is generally not verifiable in
itself (high-dimensional, opaque), yet the system can still satisfy a hard safety
requirement because the requirement is enforced by the bounding layer, not the policy:
$a_\text{exec}=\Pi_{\mathcal S}(a_\pi)$ constrains every executed action to the safe set
$\mathcal S$ regardless of what $\pi$ proposes. What must be verified is therefore not the
policy but the bounds and their models: that $\mathcal S$ correctly encodes the Grip-Force
Window, reach, and keep-out; that the projection and confidence gates are implemented
correctly; and that the fallback is safe on the empty-set/low-confidence branch. Verify the
cage, then the learned bird inside it cannot violate the requirement.
