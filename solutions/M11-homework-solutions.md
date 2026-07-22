Model solutions for the Section 25 problem set. Numeric answers are recomputed by
`build/checks/M11-homework-check.js` and enforced by verify-solutions.js. Inputs tagged
[VERIFY@PUB] use an illustrative parameter set consistent with Section 7.

**1. Node graph.** The graph follows the fixed interfaces: a camera/stereo node publishes to
a perception (detect/ripeness) node; perception publishes fruit poses to the decision node;
decision commands the arm controller; a force-sensor node feeds the grasp-force controller;
the drive node consumes localization. Label the grasp-force sensor to controller to driver
links and the drive-control links **real-time** (reliable, low-depth, deadline-bound QoS:
reliability RELIABLE, history KEEP_LAST depth 1, deadline set); label perception image and
detection streams **best-effort** (BEST_EFFORT, KEEP_LAST small depth) since a dropped frame
is recoverable but must never stall the control plane.

**2. Worst-case latency.** For the grasp-force loop across sensor, estimator, controller,
and driver with per-node $(C_i,S_i,D_i)$ in ms [VERIFY@PUB], the worst case is
$L_\text{wc}=\sum_i(C_i+S_i+D_i)=$ 4.8 ms, against a 10 ms deadline (100 Hz loop), so it
meets the deadline with 5.2 ms of margin. The dominant node is the estimator at 1.6 ms
(compute-heavy), so by EI-05 that is the node to optimize first if the margin ever tightens,
not a node whose entire cost is smaller than the savings sought.

**3. Plane separation.** If a slow perception inference (tens of ms) shared a thread with the
grasp-force loop, a long inference call would block the force controller past its 10 ms
period: the loop would miss updates, hold a stale force command, and overshoot the
Grip-Force Window, bruising the fruit before the next correction. Plane separation puts
perception (best-effort, lower priority, separate executor/thread) and the control plane
(real-time, high priority, isolated executor) on independent scheduling, so perception load
cannot preempt or delay the force loop, and the loop keeps its period regardless of what
perception is doing.

**4. Safety monitor.** For the over-force hazard, specify an independent monitor: *inputs*, a
dedicated force/pressure channel (separate sensor path from the control loop); *logic*, trip
if measured force exceeds the window's bruise bound for more than one confirmation sample;
*safe-state command*, open the relief/vent to release grip and hold; *reaction-time
requirement*, $L_\text{detect}+L_\text{react}\le T_\text{harm}$. At a 500 Hz monitor rate
$L_\text{detect}=$ 2 ms and a valve-release $L_\text{react}=$ 5 ms give a total of 7 ms,
well inside a $T_\text{harm}=$ 20 ms bruise-onset time [VERIFY@PUB], leaving 13 ms of
margin. Its independence rests on a separate sensor, separate compute, and a hardware-level
safe-state path, so a fault in the control plane cannot disable it.

**5. (Grad) Schedulability.** Apply a rate-monotonic response-time test with blocking,
$R_i=C_i+B_i+\sum_{j\in hp(i)}\lceil R_i/T_j\rceil C_j$, to the control plane: the force task
$(T{=}10, C{=}2, B{=}1)$ ms and the drive task $(T{=}20, C{=}3, B{=}1)$ ms [VERIFY@PUB]. The
force task's response time is 3 ms $\le 10$ ms, and the drive task's converges to 6 ms
$\le 20$ ms, so both meet their deadlines. Because perception runs at lower priority and
enters only through the bounded blocking term $B_i$ (priority inheritance), these bounds hold
independent of perception load, which is the formal statement of plane separation.

**6. (Grad) Defense in depth.** The grasp is protected by layers: the learned policy's bound
(M7) keeps proposals inside the safe set; the force controller (M9) regulates within the
window; mechanical compliance/relief (EI-09) limits force at physics speed; and the
independent monitor (EI-11) trips on over-force. Residual risk if a single layer fails: if
the learned bound is mis-modeled, the controller and relief still cap force; if the
controller mistunes, compliance and the monitor catch it; if compliance degrades, the
monitor trips; if the monitor fails silently, the physical relief still bounds peak force.
The residual that no single layer closes is a *common-cause* failure (e.g., a wrong force
calibration corrupting both controller and monitor), which is exactly what the M15 safety
case must close, by showing the layers are diverse and independent, not sharing that cause.
