Model solutions for the Section 25 problem set. Numeric answers are recomputed by
`build/checks/M02-homework-check.js` and enforced by verify-solutions.js. Inputs tagged
[VERIFY@PUB] use an illustrative parameter set consistent with Section 7.

**1. Mass and payload.** With $m = \rho\,\tfrac{4}{3}\pi abc$ and $\rho \approx 1000$
kg/m^3 [VERIFY@PUB], three fruit with semi-axes (m) $(0.13,0.12,0.12)$,
$(0.15,0.12,0.12)$, and $(0.12,0.10,0.10)$ have masses of about 7.8 kg, 9.0 kg, and
5.0 kg. For a supplied distribution (mean 6.0 kg, sd 1.5 kg), the 95th-percentile
payload the structure must carry is $6.0 + 1.645(1.5) \approx$ 8.5 kg.

**2. Contact pressure and the anti-bruise bound.** From Section 7.2,
$F_\text{bruise} = \pi^3 R_\text{eff}^2 p_\text{br}^3 / (6 (E^\ast)^2)$. With
$R_\text{eff}=0.08$ m, $E^\ast=0.6$ MPa, and $p_\text{br}=120$ kPa [VERIFY@PUB], the
upper bound is about 159 N. Halving the pad stiffness ($E^\ast \to 0.3$ MPa) raises it
to about 635 N, a +300% change, because $F_\text{bruise}\propto (E^\ast)^{-2}$ (halving
$E^\ast$ quadruples the bound). Compliance widens the window from the top.

**3. Anti-slip bound and the window.** From Section 7.3,
$F_\text{slip}=m(g+a_\text{dyn})/(2\mu)$. For the high-mass percentile $m=8$ kg,
$\mu=0.7$, and $a_\text{dyn}=3$ m/s^2 [VERIFY@PUB], $F_\text{slip}\approx$ 73 N, and with
safety factor $n_s=1.5$ the required minimum is $F_\text{min}\approx$ 110 N. Combined
with problem 2, the window is $[\,110,\ 159\,]$ N: narrow but feasible, since
$F_\text{min} \le F_\text{bruise}$.

**4. Placement height.** Equating impact energy $mgh$ to a bruise-energy threshold
$E_\text{br}\approx 1.0$ J [VERIFY@PUB] for the heaviest design fruit ($m=10$ kg) gives
$h_\text{max}=E_\text{br}/(mg)\approx$ 10 mm. Mission implication: the machine must
*place*, not drop; essentially zero free fall is tolerable, which motivates controlled
lowering and compliant contact at set-down.

**5. (Grad) Empty-window design.** A stiff pad ($E^\ast=3$ MPa) collapses the upper
bound to $F_\text{bruise}\approx$ 6.4 N, far below $F_\text{min}=110$ N, so the window is
empty and no force succeeds. Reopen it with physically justifiable levers: lowering
$E^\ast$ (compliance) raises $F_\text{bruise}$ back to 159 N and is the dominant lever,
the one **fluid power provides**; enlarging $R_\text{eff}$ (conformance) also raises the
upper bound; raising $\mu$ (pad material) and reducing $a_\text{dyn}$ (gentler motion)
lower $F_\text{slip}$. Compliance carries the largest single contribution.

**6. (Grad) Distribution and residual risk.** A fixed-force gripper set to one value
cannot track the per-fruit window across the joint mass and $p_\text{br}$ variability,
so a tail fraction (illustratively a few percent) falls outside, either slipping on the
heavy, high-$F_\text{slip}$ tail or bruising on the stiff-contact, low-$F_\text{bruise}$
tail. A regulated-force gripper (DD-7) measures and holds inside each fruit's window,
driving the outside fraction toward the SR-P-02 target. Graded on a correct tail argument
and the fixed-versus-regulated comparison.
