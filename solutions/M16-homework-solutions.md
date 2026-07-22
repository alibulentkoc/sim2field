Model solutions for the Section 25 problem set. Numeric answers are recomputed by
`build/checks/M16-homework-check.js` and enforced by verify-solutions.js. Inputs tagged
[VERIFY@PUB] use an illustrative parameter set consistent with Section 7.

**1. Cost model.** From a BOM of manipulator $12{,}000, chassis $10{,}000, compute $8{,}000,
battery $6{,}000, and frame $4{,}000 (build $40{,}000) over a 5-season life, plus operating
cost of energy $1{,}500 + maintenance $3{,}000 + supervision $4{,}000 [VERIFY@PUB], the
$\text{TCO/season}=\text{build}/\text{life}+\text{operating}=$ $16,500. The dominant cost
driver is the manipulator ($12{,}000). A 25% reduction there saves $600 per season, versus
only $200 per season from the same 25% off a cheap part (the frame), roughly 3x the leverage
for equal effort, so cost-reduction work belongs on the dominant line item (EI-05 in the cost
domain).

**2. Cost-per-acre.** With 480 operating hours/season, a coverage rate of 0.5 acres/h, and
0.85 uptime (M14) [VERIFY@PUB], the machine covers $480\times0.5\times0.85=$ 204 acres/season,
so $\text{cost/acre}=\text{TCO}/\text{acres}=$ $81. Revenue/acre is
$\text{yield}\times(1-\text{loss})\times\text{price}=40{,}000\text{ lb}\times(1-0.08)\times\$0.15=$
$5,520, where the 8% loss is bruise (5%, M9/CEC-02) plus missed fruit (3% recall, M4). Net
value/acre is revenue minus cost $=$ $5,439. Against a manual-harvest cost of about $600/acre,
the machine's $81/acre harvest cost is far lower, and every point of bruise rate is a direct
revenue loss of about $60/acre, so quality *is* economics.

**3. Deployment envelope.** Break-even is where the machine's roughly fixed TCO equals the
manual cost: $\text{TCO}/\text{manual per acre}=16{,}500/600=$ 27.5 acres/season. For three
profiles [VERIFY@PUB]: a 15-acre small farm sits below break-even, so manual still wins; a
50-acre medium farm and a 200-acre large farm both clear it, so the machine wins, more
decisively as acreage grows. The deployment envelope (EI-10) is therefore farms above about
28 acres/season of watermelon whose terrain stays inside the slope/field envelope (M10) and
whose manual labor cost is at or above the assumed $600/acre; outside that envelope the honest
answer is "not yet" or "deploy as a shared service" (problem 6).

**4. Manufacturability/sustainability.** Two DFM/DFA improvements: consolidate the frame into
fewer cast/formed parts to cut fastener count and assembly time, and standardize on a single
actuator/interface family so the arm and drive share spares and mounting. One serviceability
improvement: make the gripper and its force sensor a tool-less quick-swap module, since it is
the highest-wear, highest-failure-rate subsystem (M14) and field downtime is lost acres. A
lifecycle-footprint concern is the battery (embodied energy and end-of-life toxicity); mitigate
with a design for second-life/recycling and right-sizing the pack to the validated shift energy
(M12) rather than oversizing "to be safe."

**5. (Grad) Volume economics.** Model unit cost with a learning curve $C(n)=C_1 n^{-b}$,
$b=-\log_2(\text{LR})$. At a 90% learning rate, cumulative production of 100 units brings the
build cost from $40{,}000 to $19,863 [VERIFY@PUB]. The effect is differential: the dominant
driver falls most in absolute terms, the manipulator dropping from $12{,}000 to about $5,959,
so volume attacks exactly the line item design leverage also targets. Cheaper build lowers TCO
and thus the break-even acreage, widening the deployment envelope of problem 3, which is why
the price a program can hit depends on cumulative volume, not just per-unit engineering.

**6. (Grad) Business-model economics.** Cost/acre is $\text{TCO}/(\text{acres used})$, so
utilization dominates. A single small grower owning the machine but using it on only 20 acres
pays $825/acre, worse than manual, whereas a service/contractor model spreading the same TCO
over 200 acres pays $82.50/acre [VERIFY@PUB], a 10x difference driven entirely by amortization,
not by any change to the machine. Sell suits high-utilization large farms; service and lease
convert the fixed cost into a per-acre charge that small growers can afford, which is why the
business model, not just the hardware, decides small-grower access (the M15 equity question):
under-utilized ownership is the expensive way in, shared utilization is the affordable one.
