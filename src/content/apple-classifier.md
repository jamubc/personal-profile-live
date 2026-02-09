## Project Overview

This was my senior Engineering Capstone for an apple sorting facility, 
part of a commercial grower in the Okanagan Valley. 
The problem: manual apple grading is labour-intensive,
inconsistent, and doesn't scale. Our six-person team designed and
built an automated apple classification system that uses a
Convolutional Neural Network and affordable off-the-shelf hardware
to grade apples in real time, targeting small-to-medium orchards
that can't justify the cost of industrial sorting lines.

The system captures an image when an apple breaks an infrared beam,
runs it through a TensorFlow Lite model on a Raspberry Pi, and
displays the result  "Good Apple" or "Bad Apple"  on an LCD screen,
all in under five seconds. The prototype achieved 96% accuracy in
controlled tests on a total build cost of $187, well within the
$500 capstone budget.

::image[/projects/apple-classifier/images/State%20Diagram%20for%20the%20system.webp]{caption="State diagram  the full detection-to-classification pipeline" fit=contain maxHeight=400}

## My Role & Contributions

My focus was the physical prototype  drafting, modelling, and
constructing the machine, configuring the Raspberry Pi and all
hardware, and bridging the gap between our ML team and the real
world. The project split into two tracks: machine learning and
physical design. I owned the latter and acted as the integrator
between both.

After meeting the client and our faculty advisors during the
information-gathering phase, I began brainstorming with teammates.
I drafted an initial concept sketch with particular attention to
hardware orientation  where to mount the camera, IR sensors, and
compute module to keep the apple centred in frame and the cable
runs manageable.

::image[/projects/apple-classifier/images/apple%20classifier%20creative%20sketch%20(thinking%20about%20the%20system).webp]{caption="Early concept sketch  working out camera placement, IR sensor orientation, and structural layout" fit=contain maxHeight=420}

That sketch revealed the critical components we still needed to
source. The client provided a Raspberry Pi CM4 Compute Module, but
we still needed a way to trigger the model and capture images. After
constraining discussions with the design team, we settled on at
least an 8 MP camera and an IR break-beam that would reliably
work at a foot apart  so I purchased a Raspberry Pi Camera
Module V2 and an Adafruit IR break-beam sensor.

It quickly became clear that a flat sketch wasn't enough to plan
the build. I turned to **SolidWorks** to create a detailed 3D model
of the machine based on my initial concept. This was a complete
game-changer: it made the design easy to visualise, helped the ML
team understand the physical constraints, and immediately revealed
issues like the camera's placement limitations due to its short
ribbon cable.

::image[/projects/apple-classifier/images/solidworks%20render%20and%20vision%20for%20the%20apple%20classifier.webp]{caption="SolidWorks render  visualising the full machine assembly before cutting any material" fit=contain maxHeight=450}

## Prototyping & Construction

The design team hit a roadblock early on: limited apple datasets
and hardware dependencies were stalling the ML side. Researching
public sources proved insufficient, so I pushed for an early working
prototype to capture a custom dataset. This decision paid off 
it provided the data the ML model needed and reinforced the
iterative nature of the design process.

For the model to succeed, the prototype needed a **rigid structure**
to ensure consistent apple photos matching the dataset's image
orientation. I initially considered aluminium T-slot extrusion for
its flexibility, but its high cost prompted a redesign using square
aluminium tubing instead. I purchased the tubing and fasteners, then
measured, cut, and assembled the frame with a power drill and metric
fasteners. This solution was sturdy, cost-effective, and faster to
build.

Mounting the camera, IR break-beam, and electrical wiring to the
frame was tricky  any electrical fault would manifest
unpredictably on the RPi. I wired the Raspberry Pi and worked
closely with my team to integrate the system, a task complicated
by the RPi platform's sensitivity: small hardware or software
changes could disrupt everything.

::image[/projects/apple-classifier/images/the%20physical%20circuit.webp]{caption="The breadboard circuit  IR sensor, pull-up resistor, and RPi GPIO wiring" fit=contain maxHeight=400}

To manage costs within our $500 budget, I researched suppliers
online and locally, creating a spreadsheet to track component
options and pricing. Through collaboration and persistent
problem-solving, we kept the total hardware bill to $187.11.

Through rounds of sketching, modelling, and rethinking materials,
we delivered a practical prototype that met every project
requirement. The iterative process  from rough concepts to a
working machine  taught me to balance functionality with real-world
constraints like cost, time, and material availability.

::image[/projects/apple-classifier/images/example%20working%20setup%20(showing%20the%20machine%20and%20an%20apple%20in%20position%20for%20scanning).webp]{caption="The finished prototype in a ready-to-scan state  apple positioned under the camera with IR beam active" fit=contain maxHeight=450}

## Software Integration & Operator Interface

Software implementation brought its own hurdles. I customised the
RPi to function as a standalone automated machine  flashing the OS,
configuring boot order, and adding an NVMe SSD for the storage that
Python and TensorFlow demanded. I wrote and adapted libraries to
integrate hardware from multiple vendors (Adafruit IR sensor,
RPi Camera Module, LCD display) into a single cohesive pipeline.
Python dependencies and hardware limitations tested our resolve,
but day by day we ticked off issues through relentless
problem-solving.

A key personal goal was developing a **simple-to-use graphical
interface** so that anyone could operate the machine  not just
engineers. I wrote a Python-based operator display that shows
the captured image and the model's classification result side by
side. The design philosophy was deliberate: one cable to power,
connect a display over the network, and scan.

::image[/projects/apple-classifier/images/sample_operator_output_goodApple.webp]{caption="Operator output  a 'Good Apple' classification result displayed in real time" fit=contain maxHeight=380}

::image[/projects/apple-classifier/images/sample_operator_output_badApple.webp]{caption="Operator output  a 'Bad Apple' classification flagging visible surface defects" fit=contain maxHeight=380}

## What I Learned

Capstone allowed me to engage with a longterm design project, driven by client requirements.
Prior coursework gave me practice in project timelines and
professional communication, but ENGR 499 required sustained
interaction with a real client and multiple advisors through
meetings, agendas, and long-term planning. I experienced
listening to stakeholder needs and constraints and working
collaboratively to solve the problem  considering the inherent
use of the machine and its broader impact throughout.

I grew technically through hardware prototyping  sourcing
components, cutting and assembling the frame, wiring circuits,
debugging GPIO edge detection, and configuring embedded Linux.
I also grew professionally through team and client collaboration:
running meetings, writing agendas, managing timelines, and
facilitating purchasing logistics. The experience reinforced that
**project management, communication, and ethical responsibility**
are the most important attributes of an engineer  the ability
to bridge interdisciplinary knowledge gaps, orchestrate a team
toward a goal, and consider the broader impact of the work on
communities and the environment.

## Problem & Scope

Our client needed to automate their quality classification to
reduce labour costs and improve consistency. We scoped the project
to **binary classification**  Good vs. Bad  based on the visual
grading criteria defined by BC Tree Fruits: surface defects such
as bruises, punctures, cuts, and rot, along with overall colour
uniformity. Internal defects, sugar content, and firmness were
explicitly out of scope as they require destructive testing or
advanced imaging (hyperspectral, NIR spectroscopy) beyond the
project's budget.

Key constraints included a minimum accuracy target of 80%, per-apple
processing time under 5 seconds, a $500 budget ceiling, and a modular
design that could scale from a tabletop prototype to a production
line without architectural changes.

## Machine Learning Pipeline

The ML model went through several iterations before arriving at the
final architecture. We initially explored traditional handcrafted
feature extraction but pivoted to a CNN approach  its ability to
automatically learn colour, texture, and shape features made it far
better suited to apple defect detection given our limited dataset.

**Dataset ** Built from a combination of publicly available Kaggle
apple images and photos we captured ourselves from local grocery
stores under controlled conditions. Images were split into two
classes (Good / Bad) following BC Tree Fruits standards.

**Preprocessing ** A custom OpenCV masking function removed white
and bright backgrounds to isolate the apple from irrelevant visual
information. All images were then resized to 64×64 pixels and
normalised to [0, 1] pixel range.

**Augmentation ** To compensate for dataset size limitations, we
applied real-time augmentation via Keras ImageDataGenerator: random
rotations up to 40°, horizontal flips, width/height shifts, zoom,
and shear transformations  simulating the natural variability of
apples on a sorting line.

**Architecture ** The finalized CNN consisted of two convolutional
layers (64 filters each, ReLU activation), max-pooling layers for
dimensionality reduction, a 128-neuron dense layer for deeper
feature learning, and a sigmoid output for binary classification.
Batch normalisation and dropout were explored early on but removed
for cleaner TFLite conversion. The model was compiled with Adam
optimizer (lr = 0.001) and binary cross-entropy loss, trained for
18 epochs at batch size 32.

**Evaluation ** Validation testing showed over 90% accuracy on
unseen images. A confusion matrix confirmed strong discrimination
between healthy and defective apples based on surface features. The
trained model was saved in .h5 format, then converted to TensorFlow
Lite (.tflite) for lightweight edge deployment.

## Hardware & System Architecture

The physical system was designed for modularity  every component
can be swapped or upgraded independently.

- **Raspberry Pi Compute Module 4**  the core processing unit, selected for its processing power relative to cost, paired with a CM4 I/O board for peripheral connectivity
- **Adafruit Break-Beam IR Sensor**  detects apple presence at up to 50 cm sensing distance, operating at 3.3–5.5 V with a 2 ms response time and −25°C to 60°C operating range, deployed at 28 cm in our prototype
- **Raspberry Pi Camera Module V2**  8 MP imaging, natively compatible with the CM4 ecosystem
- **Two-line LCD Display**  provides immediate human-readable classification feedback
- **256 GB NVMe SSD**  supplied by the client to host the Bookworm OS and all ML libraries, eliminating storage bottlenecks
- **Breadboard circuit** with a physical 10 kΩ sink resistor for clean IR sensor edge detection

The entire hardware bill came to $187.11 against a $500 budget, with
the CM4 and I/O board supplied by the client.

## Software & Deployment

Getting the software stack running on the CM4 involved several
non-trivial challenges. The client-supplied CM4 had no OS configured
on its eMMC, and the default boot order prioritised eMMC over the
NVMe SSD. We first flashed Bookworm OS onto the eMMC to get basic
functionality, then reflashed the NVMe SSD with a second instance
and reconfigured the eMMC boot order via USB recovery mode to
prioritise NVMe storage.

The IR sensor's GPIO pull-up proved unreliable when configured in
software  the CM4's programmable pull-ups didn't stabilise the
signal in our circuit. We solved this with a physical 10 kΩ resistor,
confirmed clean HIGH/LOW transitions with a DMM.

Camera integration required system-wide package installation rather
than a virtual environment, because GPIO edge detection needed root
permissions that the venv couldn't provide. Once all libraries were
installed globally, the TFLite model was loaded and the full capture
→ preprocess → classify pipeline was validated end to end.

## Real-Time Classification Workflow

The deployed system operates as a four-step pipeline:

- **Step 1  Detection:** An apple breaks the IR beam, triggering the Raspberry Pi to begin the capture sequence
- **Step 2  Image Capture:** The Pi Camera Module V2 captures a photo of the apple
- **Step 3  Preprocessing & Inference:** The image is masked (background removal), resized to 64×64, normalised, and fed into the TFLite CNN model for binary classification
- **Step 4  Output:** The result ("Good Apple" or "Bad Apple") is displayed on the LCD screen within a 2-second feedback window

The entire cycle from beam-break to displayed result completes in
under 5 seconds, meeting the production-line efficiency constraint.

## Results & Performance

The system exceeded every initial design target:

- **96% classification accuracy** in controlled testing (vs. 80% target), validated with a confusion matrix on real apple subjects
- **< 5 second per-apple processing time**, enabling practical production-line throughput
- **$187.11 total build cost** against a $500 budget  demonstrating viability for small-to-medium orchards
- **Fully modular architecture**  the CM4's extensive I/O supports additional cameras, alternative sensors, and integration into conveyor systems without redesign
- **Edge computing deployment**  all inference runs locally on the Pi with no cloud dependency, preserving data privacy and eliminating latency from network round-trips

The project was presented at the UBC Okanagan Engineering Capstone
Expo and received positive evaluation from both faculty advisors
and the industry client.

## Project Poster

::image[/projects/apple-classifier/images/project_poster_page_1.webp]{caption=" Capstone Project Poster  Apple Grade Classification for client" fit=contain maxHeight=800}

## Key Challenges & Future Work

- **Dataset Limitations:** The training dataset, while diverse, was limited in volume. Expanding it to cover more apple varieties, lighting conditions, and defect severities would improve robustness.
- **Sensor Sensitivity:** The IR break-beam and camera capture were sensitive to environmental lighting. Adjustable or controlled lighting enclosures would improve consistency in production settings.
- **Boot Configuration:** The CM4's eMMC-first boot order and lack of pre-configured storage required significant OS-level troubleshooting  a useful lesson in embedded systems deployment.
- **GPIO Edge Detection:** Software-configured pull-ups failed in practice, requiring a hardware workaround  a reminder that datasheet-specified features don't always behave as expected in real circuits.
- **Future: Multi-Class Grading**  Extending from binary (Good/Bad) to multi-class classification (e.g., "Fancy", "Extra Fancy") to match full BC Tree Fruits grade tiers.
- **Future: Secondary Cameras**  Adding viewing angles to capture defects not visible from a single perspective.
- **Future: Non-Destructive Add-Ons**  Integrating NIR spectroscopy or optical sensors for internal bruise detection and sugar content estimation without damaging the fruit.
- **Future: Production UI**  A dedicated user interface with real-time logging, calibration controls, and classification statistics for operators.
