## Project Overview

This project involved designing and prototyping a complete analog
signal processing chain to measure heart rate using
Photoplethysmography (PPG) as part of ENGR 352 — Microelectronics II
at UBC Okanagan. PPG is a non-invasive optical measurement technique
that detects volumetric changes in blood circulation by shining
infrared light into a fingertip and measuring the reflected intensity.
The resulting signal pulses at heartbeat frequency, enabling real-time
cardiovascular monitoring without any electrodes.

The objective was to take that faint biological signal and turn it
into a clean digital pulse — a visible LED flash for every heartbeat.
The system was built and validated across five progressive lab stages:
sensor assembly and characterisation, transimpedance amplification,
bandpass filtering and gain, comparator with hysteresis, and finally
edge triggering with a monostable multivibrator driving an LED output.
Each stage was first simulated in LTSpice, then prototyped on a
breadboard and verified with oscilloscope measurements.

::image[/projects/ppg-monitor/images/handwritten-planning.webp]{caption="Early planning notes and simulation sketches for the PPG signal chain" fit=contain maxHeight=420}

## Sensor Design & Signal Acquisition

The first challenge was capturing the biological signal. I assembled
an optical sensor by soldering a 940 nm OSRAM SFH 4546 infrared
emitter diode and a matched photodiode onto a PCB protoboard,
paying careful attention to component orientation, solder joint
strength, and emitter-detector alignment. The emitter was driven
at approximately 45.7 mA through an 82 Ω series resistor (assuming
a 1.25 V forward drop from the 5 V supply), and the optimal
emitter-to-photodiode spacing was measured at 4.375 mm ± 0.005 mm.

When placed on the pad of the middle finger with light pressure,
the photodiode detects changes in reflected IR light caused by
pulsatile blood flow. This produces a tiny photocurrent — a DC
component of approximately 5.7 μA from ambient tissue absorption,
with a superimposed AC component of only ~54 nA riding on top,
oscillating at heart rate.

To make this usable, I implemented a Transimpedance Amplifier (TIA)
using an LTC6078 op-amp with a feedback resistance of 0.7 MΩ. The
TIA converts the weak photocurrent into a measurable voltage output:
a 4 V DC offset carrying a ~38 mV peak-to-peak AC heartbeat signal
at just above 1 Hz. Oscilloscope settings of AC coupling at
20 mV/div and 250 ms/div were needed to isolate and view the
heartbeat waveform buried beneath the dominant DC level.

During initial testing the circuit appeared non-functional. After
replacing the op-amp and potentiometer without success, I discovered
that the photodiode had been connected with reversed polarity —
once corrected, the circuit immediately produced the expected PPG
waveform.

::image[/projects/ppg-monitor/images/prototype-circuit-diagram.webp]{caption="Circuit diagram of the PPG prototype — from photodiode through TIA to output" fit=contain maxHeight=400}

::image[/projects/ppg-monitor/images/scope-ppg-raw.webp]{caption="Raw unprocessed PPG pulse signal captured on the oscilloscope — 38 mV pk-pk on a 4 V DC offset" alt="Oscilloscope screen: raw PPG, a small ripple on a large DC level" cut=A readout="CH1 20.0 mV · M 500 ms · 27-Jan-24" fit=contain maxHeight=380}

## Signal Conditioning

The raw TIA output — 38 mV of heartbeat riding on a 4 V DC
pedestal — was completely unusable for digital detection. The
signal conditioning stage needed to strip away the DC component,
reject high-frequency noise, and boost the AC heartbeat to a level
the comparator could reliably threshold.

I designed a two-stage bandpass filter combined with a gain amplifier.
**Stage 1** added a shunt feedback capacitor (Cf1) across the TIA's
0.7 MΩ feedback resistor to create an integrated low-pass filter
with a target corner frequency of 12 Hz, rejecting high-frequency
noise while passing the ~1 Hz heartbeat. The initial calculated
capacitor value of 18.9 nF was too aggressive in practice — after
experimentation on the breadboard, a 1 nF capacitor produced the
cleanest output, a lesson in how parasitic breadboard capacitance
shifts theoretical corner frequencies.

**AC coupling** was achieved with a 4.7 μF series capacitor that
blocked the entire 4 V DC offset, re-centring the signal around a
new 2.5 V common-mode bias established by a 10 kΩ resistor divider
network. **Stage 2** used a second op-amp with a 10 MΩ feedback
resistor and 1 nF feedback capacitor (Cf2) to provide substantial
gain and additional low-pass filtering. The resulting output swung
to approximately 0.6 V peak around a 2.2 V DC operating point —
over 15× amplification of the original 38 mV heartbeat.

::image[/projects/ppg-monitor/images/ltspice-stage-2-schematic.webp]{caption="LTSpice schematic — full signal conditioning chain including the second filter and gain stage" fit=contain maxHeight=420}

::image[/projects/ppg-monitor/images/scope-ppg-processed.webp]{caption="Processed PPG signal after bandpass filtering and amplification — dramatically improved SNR" alt="Oscilloscope screen: processed PPG on two channels" cut=B readout="CH1 20.0 mV · CH2 2.00 V · M 250 ms · 10-Feb-24" fit=contain maxHeight=380}

::image[/projects/ppg-monitor/images/breadboard-filter-stages.webp]{caption="Breadboard prototype of the gain and filtering stages" fit=contain maxHeight=420}

## Comparator Design

With the conditioned signal in hand, the system needed to decide
precisely when each heartbeat occurred — converting the smooth
analog waveform into a crisp digital HIGH/LOW output. This is
essentially a 1-bit analog-to-digital converter.

A key challenge was the cardiac signal's **dicrotic notch** — a
secondary pressure wave that appears during the diastolic phase of
each cardiac cycle. A naïve threshold comparator would false-trigger
on this notch, producing spurious extra pulses.

I first implemented a **buffer amplifier** (LTC6078 in unity-gain
configuration) with a pair of 220 kΩ resistors to supply a stable
2.5 V reference voltage from a single isolated source, replacing
the need for multiple voltage divider networks and preventing loading
effects from distorting the conditioned signal upstream.

::image[/projects/ppg-monitor/images/buffer-amplifier-schematic.webp]{caption="Buffer amplifier circuit diagram — providing an isolated 2.5 V reference" fit=contain maxHeight=380}

The comparator itself uses an LTC6078 configured as a **Schmitt
trigger** with positive feedback through hysteresis resistors R8
(220 kΩ) and R9 (680 kΩ). The hysteresis band creates a voltage
dead zone: the output only switches HIGH when the input rises above
an upper threshold, and only returns LOW when it falls below a lower
threshold. This dead zone was sized to sit above the dicrotic notch
amplitude, eliminating false triggers entirely.

The hysteresis resistor values were derived from KCL at the inverting
terminal with a reference voltage of 2.5 V and target feedback current
of 1 μA — yielding the design equations R8 = V_HB / (2 × I_f) and
R9 = V_ref / I_f. During testing, the Stage 2 output proved highly
sensitive to finger pressure — small changes shifted the DC operating
point enough to push the signal outside the hysteresis window.
Adding additional gain to the preceding stage stabilised the
comparator behaviour.

::image[/projects/ppg-monitor/images/comparator-schematic.webp]{caption="Comparator circuit diagram with hysteresis resistor network (R8 = 220 kΩ, R9 = 680 kΩ)" fit=contain maxHeight=380}

::image[/projects/ppg-monitor/images/comparator-ltspice.webp]{caption="Full comparator design in LTSpice simulation" fit=contain maxHeight=420}

::image[/projects/ppg-monitor/images/scope-hysteresis-annotated.webp]{caption="Annotated hysteresis band of the Schmitt trigger — the dead zone prevents dicrotic notch false triggers" alt="Oscilloscope capture with the Schmitt-trigger hysteresis band marked in red" cut=C fit=contain maxHeight=400}

The oscilloscope capture below validates the design at 2 V/div,
250 ms/div in DC coupling mode. The yellow trace shows the cleaned
analog heartbeat waveform (systole → dicrotic notch → diastole),
while the blue trace shows the comparator output switching cleanly
on each beat with zero false edges from the notch.

::image[/projects/ppg-monitor/images/scope-comparator-vs-ppg.webp]{caption="Comparator trigger signal alongside the time-varying PPG waveform — clean digital pulse on every heartbeat" alt="Oscilloscope screen: PPG waveform in yellow and the comparator's square-wave output in cyan" cut=C readout="CH1 2.00 V · CH2 2.00 V · M 250 ms · 3-Mar-24" fit=contain maxHeight=400}

## Monostable Multivibrator & Final Output

The comparator produced a variable-width pulse that tracked each
heartbeat, but a consistent, fixed-duration output was needed to
drive the LED indicator. The final stage comprises three sub-circuits:

**Edge Triggering Circuit** — A differentiator (series capacitor
with a shunt resistor, RC time constant of 0.01 s using R = 10 kΩ
and C = 1 μF) converts the comparator's digital step into a brief
voltage spike on each low-to-high transition. A rectifier diode
strips the negative-going spike so only the positive edge propagates,
and a current-limiting resistor (RB4) protects the diode. The
resulting node B voltage during discharge follows
V_B(t) = −4 × e^(−t/0.01).

**Monostable Multivibrator (One-Shot)** — The edge-triggered spike
turns on transistor Q1, which charges a timing capacitor and
consequently turns off Q2. With Q2 off, the voltage at node C
rises above Q3's saturation threshold, enabling the LED driver.
After the RC time constant expires, the capacitor discharges,
Q2 re-enables, Q3 cuts off, and the circuit returns to its stable
state — ready for the next heartbeat. This guarantees that every
detected pulse produces a uniform-duration output regardless of
input amplitude or waveform shape.

**LED Driver** — Transistor Q3 (NPN) switches current through a
green LED. The base resistor RB3 was calculated from the transistor's
β (≈ 50) and a target collector current of 20 mA (the LED's rated
forward current): RB3 = β × (V_CC − V_BE) / I_C = 50 × (5 − 0.7) /
0.02 = 10.75 kΩ. The LED series resistor RD was set to approximately
135 Ω based on the LED's V-I performance curve.

The result is a visible green flash for every single heartbeat — a
tangible, real-time confirmation that the entire four-stage analog
chain is working end to end, from photon to pulse.

::image[/projects/ppg-monitor/images/final-stage-ltspice.webp]{caption="LTSpice simulation of the complete final stage — edge trigger, monostable multivibrator, and LED driver" fit=contain maxHeight=420}

::image[/projects/ppg-monitor/images/breadboard-final.webp]{caption="Final breadboard — the complete PPG signal processing chain from sensor to LED output" fit=contain maxHeight=450}

## Key Engineering Challenges

- **Extreme Signal-to-Noise Ratio:** The DC offset (~4 V) dwarfed the biological signal (~38 mV pk-pk) by a factor of over 100×. Multi-stage AC coupling and active bandpass filtering were essential to amplify only the dynamic component and achieve a usable ~0.6 V output swing.
- **Sensor Mechanical Stability:** Finger placement pressure directly affected the DC operating point and signal quality. I analysed the impact and proposed a mechanical brace or strap with alignment features to ensure consistent emitter-detector spacing (4.375 mm) and contact pressure.
- **Simulation vs. Reality:** Parasitic capacitance on the breadboard shifted corner frequencies from their LTSpice predictions — a calculated 18.9 nF feedback capacitor had to be replaced with 1 nF to recover the desired filter response. I systematically troubleshot discrepancies and recalculated component values to reconcile the physical circuit with simulation.
- **Probe Loading Effects:** Characterised probe equivalent circuits and quantified source loading errors (4.76% for 1× vs. 0.5% for 10× attenuation), informing measurement strategy throughout the project to minimise observation artefacts.
- **Dicrotic Notch Rejection:** The secondary cardiac pressure wave could easily fool a simple threshold detector. Careful hysteresis band sizing on the Schmitt trigger comparator eliminated false triggers without masking genuine heartbeat edges.
- **Future Work:** Proposed adding USB output for microcontroller-based digital processing and BPM calculation, as well as a purpose-built finger sensor housing to replace the bare breadboard emitter-photodiode assembly.
