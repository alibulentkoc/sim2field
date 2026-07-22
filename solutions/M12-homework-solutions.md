Model solutions for the Section 25 problem set. Numeric answers are recomputed by
`build/checks/M12-homework-check.js` and enforced by verify-solutions.js. Inputs tagged
[VERIFY@PUB] use an illustrative parameter set consistent with Section 7.

**1. Power budget.** With subsystem draws and duty cycles [VERIFY@PUB], drive $(300$ W,
$0.6)$, arm $(250$ W, $0.5)$, compute $(60$ W, $1.0)$, sensors $(25$ W, $1.0)$, aux $(40$
W, $0.7)$, the average power is $\bar P=\sum_i P_i d_i=$ 418 W. The coincident peak, when
drive and arm actuate together with compute and sensors live, is
$P_\text{peak}=\sum_i P_i=$ 675 W (sizes the bus and C-rate). The dominant energy term is
drive at 180 W of average draw, the largest $P_i d_i$, so it governs endurance.

**2. Battery sizing.** For a $t_\text{shift}=6$ h shift, $E_\text{shift}=\bar P\,t=2508$ Wh.
Derating by depth-of-discharge $0.8$, temperature $0.9$, and sag $0.95$ with a 20% margin
[VERIFY@PUB] gives installed capacity
$E_\text{install}=E_\text{shift}/(\text{DoD}\cdot f_\text{temp}\cdot f_\text{sag})\times1.2=$
4400 Wh (4.4 kWh). The usable energy then supports an endurance of
$t=E_\text{usable}/\bar P=$ 7.2 h, i.e. the 6 h shift plus the 20% margin, at the envelope's
temperature rather than at nominal.

**3. Dominant load (EI-05).** A 10% efficiency gain on the dominant load (drive) removes
18 W of average draw, versus only 2.8 W for the same 10% on a minor load (aux). Since
endurance scales as $1/\bar P$, the drive improvement lifts endurance by 4.5% while the aux
improvement lifts it by 0.7%, roughly a 7x difference for equal engineering effort. Invest
efficiency work in the dominant load: this is EI-05 in the power domain, the sensitivity of
endurance to a load's efficiency is largest for the load that dominates the budget.

**4. Thermal balance.** Steady state gives
$T_\text{comp}=T_\text{ambient}+(Q_\text{gen}+Q_\text{solar})R_\text{thermal}$. With
$Q_\text{gen}=60$ W, $Q_\text{solar}=20$ W, $T_\text{ambient}=40$ (envelope max), and a
clean $R_\text{thermal}=0.5$ [VERIFY@PUB], $T_\text{comp}=$ 80 deg C, inside the 85 deg C
limit with 5 deg of margin. But with dust degrading $R_\text{thermal}$ to 0.6, $T_\text{comp}$
rises to 88 deg C and the part throttles (a CEC-01 throughput risk on the hottest
afternoon). To hold the limit at worst case, the required cooling is
$R_\text{thermal}\le(T_\text{limit}-T_\text{ambient})/(Q_\text{gen}+Q_\text{solar})=$
0.56 C/W, so the heatsink/airflow must be designed to that target *with* dust derating, not
clean.

**5. (Grad) Transient thermal.** The thermal-limited sustainable heat is
$Q_\text{allow}=(T_\text{limit}-T_\text{ambient})/R_\text{thermal}=$ 90 W. A load that
duty-cycles between a peak of 120 W and a base of 40 W [VERIFY@PUB] is sustainable without
steady-state throttling when its time-average stays at or below $Q_\text{allow}$:
$120\,\delta+40(1-\delta)\le90$ gives a sustainable duty cycle $\delta\le$ 0.625. Thermal
mass lets a *short* peak exceed 90 W transiently (the part heats slowly), but over a period
longer than the thermal time constant the average must obey the 0.625 bound or the
component drifts into throttling.

**6. (Grad) Accuracy/energy tradeoff.** A larger detection model (M4) raises recall, hence
yield, but also compute power and heat, which cut endurance (problem 2) and push the thermal
balance (problem 4) toward throttling on the hottest slope of the envelope. The system-level
decision is not "maximize recall" but "maximize harvested value per shift subject to
endurance and no-throttle": estimate the marginal yield from extra recall against the
marginal loss from shorter runtime and any throttling that itself slows the cycle (CEC-01).
Recommend the smallest model whose recall clears the yield threshold (EI-04) at a compute
power the thermal and energy budgets absorb at envelope max, escalating to a bigger model
only if that point underperforms and cooling/energy headroom exists to pay for it.
