Model solutions for the Section 25 problem set. Numeric answers are recomputed by
`build/checks/M08-homework-check.js` and enforced by verify-solutions.js. Inputs tagged
[VERIFY@PUB] use an illustrative parameter set consistent with Section 7.

**1. IK/FK.** With anchors $B_1=(-0.3,0)$ and $B_2=(0.3,0)$ m (track width $w=0.6$ m) and
target $G=(0.1,0.5)$ m [VERIFY@PUB], inverse kinematics gives the actuator lengths
$L_i=\lVert G-B_i\rVert$: $L_1=$ 0.640 m and $L_2=$ 0.539 m. Forward kinematics intersects
the two circles $\lVert G-B_1\rVert=L_1$, $\lVert G-B_2\rVert=L_2$, yielding two mirror
solutions at $z=+0.5$ and $z=-0.5$; the physical assembly branch is the upper one ($z>0$,
arm above the track), since the lower branch is below ground and unreachable.

**2. Workspace and track width.** At working height $z_0=0.4$ m with stroke upper limit
$L_\text{max}=0.7$ m, the outer reach is $a=\sqrt{L_\text{max}^2-z_0^2}=0.574$ m, and in the
$w\le a$ regime the reachable transverse span equals the track width $w$. To cover a bed of
width $W_\text{bed}=0.5$ m with a 0.05 m margin [VERIFY@PUB], the minimum anchor separation
is $w_\text{min}=W_\text{bed}+\text{margin}=$ 0.55 m (feasible, since $0.55\le a=0.574$),
giving a coverage margin of 0.05 m over the bed. This is the reach *lower* bound on track
width; stability sets the upper bound (problem 6).

**3. Jacobian and singularity.** Building the Jacobian from the actuator unit vectors
$\hat u_i=(G-B_i)/L_i$, the transmission angle $\gamma$ between them sets
$\det J\propto\sin\gamma$, so manipulability $\mu=|\sin\gamma|$ is the distance from
singularity. At the well-placed config $G=(0.1,0.5)$ the actuators are well spread:
$\gamma\approx$ 60 deg and $\mu=$ 0.87. At the high, reached-out config $G=(0,2.0)$ the two
actuators become nearly parallel: $\gamma\approx$ 17 deg and $\mu=$ 0.29. The second is much
nearer a singularity (smaller $\mu$): near-parallel actuators transmit force poorly, so by
$\tau=J^\top F$ a bounded payload demands large, ill-conditioned joint forces, which is
unsafe and motivates the $\gamma$ keep-out.

**4. sigma_mech to specs.** Decomposing the allocated
$\sigma_\text{mech}=\sqrt{\sigma_\text{rep}^2+\sigma_\text{bl}^2+\sigma_\text{defl}^2}\le 6$
mm with $\sigma_\text{rep}=2$ mm, $\sigma_\text{bl}=1.5$ mm, and payload
$F_\text{load}=90$ N (from M2) [VERIFY@PUB], the deflection budget is
$\sigma_\text{defl}=\sqrt{6^2-2^2-1.5^2}=$ 5.45 mm, so the required effective stiffness is
$k_\text{eff}\ge F_\text{load}/\sigma_\text{defl}=$ 16.5 kN/m and the joint repeatability
must hold to $\sigma_\text{rep}=2$ mm. The dominant term is deflection (5.45 mm, versus 2
and 1.5 mm), so by EI-05 stiffness is the lever to attack first.

**5. (Grad) Error propagation.** Propagating a joint covariance to the task via
$\Sigma_x=J\Sigma_q J^\top$, the task-space error scales with the Jacobian, so as
$\mu\to 0$ (config B above) the mapping stretches a fixed joint uncertainty into a large,
highly anisotropic task-error ellipse: the error blows up along the direction the mechanism
can no longer stiffly resist. This is the same phenomenon as the force blow-up in problem 3,
seen through covariance: near a singularity, neither force nor precision is controllable,
and no downstream filter recovers it because the mechanism itself lost the ability to
constrain that direction.

**6. (Grad) Reach/stability co-design.** Cast the track width as a constrained choice: reach
(this module) sets the lower bound $w\ge$ 0.55 m, and stability/maneuverability (M10) sets
an upper bound, illustratively $w\le$ 0.90 m [VERIFY@PUB]. The feasible interval is
therefore $[0.55, 0.90]$ m, non-empty with 0.35 m of slack, so a track width exists that
both covers the bed and keeps the vehicle stable. Were the interval empty, the architecture
would have to change (taller stroke to lower the reach bound, or a wider wheelbase/lower CG
to raise the stability bound), per EI-08.
