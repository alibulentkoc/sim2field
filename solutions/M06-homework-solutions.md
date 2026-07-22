Model solutions for the Section 25 problem set. Numeric answers are recomputed by
`build/checks/M06-homework-check.js` and enforced by verify-solutions.js. Inputs tagged
[VERIFY@PUB] use an illustrative parameter set consistent with Section 7.

**1. Latency budget.** With measured per-stage latencies $t_\text{detect}=12$,
$t_\text{localize}=6$, $t_\text{decide}=2$, $t_\text{control}=3$ ms and a cycle-time
compute share of 25 ms (from CEC-01) [VERIFY@PUB], the budget assembles to
$T_\text{compute}=t_\text{detect}+t_\text{localize}+t_\text{decide}+t_\text{control}=$
23 ms, which is inside the share with a 2 ms margin, so it closes. The stage to optimize
first is detect at 12 ms: it is the dominant term, and by EI-05 you attack the bottleneck,
not a stage whose entire cost is smaller than the savings you seek elsewhere.

**2. Amdahl's law.** A stage that is $f=0.30$ of runtime, accelerated by $s$, gives overall
speedup $S=1/((1-f)+f/s)$. At $s=4$ the speedup is only 1.29; at $s\to\infty$ (the stage
made free) it saturates at 1.43. Interpretation: because 70% of the runtime is untouched,
even infinite acceleration of this stage buys at most a 1.43x overall gain, the quantitative
warning against pouring effort into a minority of the runtime (EI-06).

**3. Roofline.** With device peak 2000 GFLOP/s and memory bandwidth 100 GB/s, the ridge
point is $\text{peak}/\text{BW}=$ 20 FLOP/byte. A kernel with arithmetic intensity 8
FLOP/byte [VERIFY@PUB] sits left of the ridge ($8<20$), so it is memory-bound: its
attainable rate is $\text{AI}\times\text{BW}=$ 800 GFLOP/s, far below peak. The helpful
optimization is therefore to raise arithmetic intensity and cut memory traffic (operator
fusion, data-layout and cache reuse), not to add raw FLOPs, which the memory wall would
waste.

**4. Optimization tradeoff.** Given FP32 (45 ms, recall 0.92), INT8 (18 ms, recall 0.90),
and pruned (12 ms, recall 0.86), against a latency budget of 20 ms and a recall floor of
0.88 [VERIFY@PUB]: FP32 violates latency, pruned violates the recall floor, and only INT8
satisfies both, so INT8 is the operating point at 18 ms and recall 0.90. This is EI-04 on
the edge: pick the point that meets the hard latency constraint while holding recall above
the yield-driven threshold, rather than the most accurate or the fastest in isolation.

**5. (Grad) Mixed precision.** Treat precision as a budget to allocate across layers by
their quantization sensitivity: keep the few high-sensitivity layers (typically the first
and last, and any with wide dynamic range) at higher precision, and push the many
low-sensitivity layers to INT8, so total latency meets the budget at the maximum achievable
recall. This is structurally CEC-03: spend the scarce resource (here, bits/latency) where
its marginal return on the mission metric (recall) is largest, not uniformly.

**6. (Grad) Energy per harvest.** With compute power $P=15$ W and inference latency
$T_\text{latency}=18$ ms, each inference costs $E_\text{inference}=P\times T=$ 0.27 J. Over
a harvest run of 2000 inferences [VERIFY@PUB] the compute energy is about 540 J,
i.e. 0.15 Wh. Compared against the vehicle power/thermal budget this is small per run but
scales with
run length and inference rate, and it must be carried as a real line item into the M12
energy budget rather than assumed negligible, especially once cooling overhead is added.
