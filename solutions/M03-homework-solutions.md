Model solutions for the Section 25 problem set. Numeric answers are recomputed by
`build/checks/M03-homework-check.js` and enforced by verify-solutions.js. Inputs tagged
[VERIFY@PUB] use an illustrative parameter set consistent with Section 7.

**1. FoV and GSD.** With sensor width $s=6$ mm, focal length $f=8$ mm, and $N=1920$ px
[VERIFY@PUB], $\text{FoV}=2\arctan(s/2f)=$ 41 deg. The imaged width is $W=Z\,s/f$, so the
ground sampling distance $\text{GSD}=W/N$ is 0.20 mm/px at $Z=0.5$ m (pick station) and
0.59 mm/px at $Z=1.5$ m. A 250 mm fruit therefore spans about 1280 px up close and 430 px
at the far distance, both far above the ~100 px a detector needs (an M4 requirement).

**2. Depth error and baseline sizing.** From Section 7.3, $\delta Z\approx Z^2\delta d/(f\,b)$,
so $b_\text{min}=Z_\text{pick}^2\,\delta d/(f\,\delta Z_\text{req})$. With $f=2500$ px,
$\delta d=0.25$ px, $Z_\text{pick}=0.5$ m, and $\delta Z_\text{req}=2$ mm [VERIFY@PUB], the
minimum baseline is 12.5 mm. Imaging the fruit at twice the range (1.0 m) quadruples the
depth error to 8 mm for the same disparity noise, since $\delta Z\propto Z^2$. This is why
the architecture stages each fruit close (DD-2).

**3. Sensing error budget.** With capture tolerance $c=30$ mm and sensing terms
$\sigma_Z=2$, $\sigma_\text{cal}=3$, $\sigma_\text{he}=4$, $\sigma_\text{sync}=2$ mm, the
$3\sigma\le c$ rule requires $\sigma_\text{total}\le c/3=10$ mm, so the maximum tolerable
mechanism error handed to M8 is
$\sigma_\text{mech}=\sqrt{(c/3)^2-(\sigma_Z^2+\sigma_\text{cal}^2+\sigma_\text{he}^2+\sigma_\text{sync}^2)}=\sqrt{67}\approx$ 8.2 mm.

**4. Modality choice.** Passive stereo beats structured light outdoors because projected
patterns wash out in full sun (the field's dominant condition), while passive stereo uses
ambient light and degrades gracefully; criteria: sunlight robustness, range at the pick
standoff, cost, and no active emitter. The answer flips only where ambient texture vanishes
and lighting is controllable, e.g. low-light indoor or night operation, where structured
light regains the advantage.

**5. (Grad) Full-chain propagation.** Propagating disparity, calibration, and extrinsic
uncertainty through pixel -> camera -> robot, the roughly constant calibration and extrinsic
terms combine to $\sqrt{\sigma_\text{cal}^2+\sigma_\text{he}^2+\sigma_\text{sync}^2}\approx 5.4$
mm, while the depth term grows as $Z^2$. Depth noise dominates beyond $Z\approx$ 0.82 m
(with these parameters); past that range no downstream filter recovers the lost accuracy,
because the sensor never captured the information (a $Z^2$ loss lives in the measurement,
not the estimator).

**6. (Grad) Force-sensing design.** Taking the Module-2 window upper bound $F\approx 159$ N
over a pad area $A\approx 20$ cm^2, the line pressure is $P=F/A\approx$ 79.5 kPa, so a
fluid-pressure sensor needs a range of roughly 0 to 100 kPa. To resolve inside the window,
resolution should be a small fraction of the window width (a few kPa). To keep the grasp
loop stable within the $t_\text{grasp}\approx 1$ s share of the cycle-time budget (CEC-01),
sample at least ~100 Hz (about ten times the loop bandwidth).
