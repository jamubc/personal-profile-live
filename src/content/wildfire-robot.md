## Overview
This project is the culmination of solidworks design learned in my first year of engineering,
I had already experimented with software such as Sketchup growing up but the capabilities of 
solidworks were significantly more powerfull. This project was also my first experience working
as a team of engineers, we had to coordinate parts and assemblies of the parts in time to present to our cohort.

Now the designs shown here are not technical and sound, consider this more of a design project with a focus on solidworks utilization, not as a truly feasable solution to wildfire autonomous monitoring.

The inspiration for the project came from the devestating wildfires that impacted the Okanagan regions during my first year, the goal was to create 

Designed and built an autonomous robot capable of navigating
rough terrain for wildfire reconnaissance. The platform integrates
thermal cameras, LIDAR, and gas sensors for real-time environmental
monitoring in hazardous fire zones.

## Mechanical Design

The chassis was designed in SolidWorks with a rocker-bogie suspension
system for all-terrain mobility. Finite element analysis was performed
on critical load-bearing components to ensure structural integrity
under extreme heat conditions.

::image[https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80]{caption="Robot chassis CAD render with suspension system"}

## Sensor Fusion & Navigation

An Arduino-based control system fuses data from multiple sensors
including IR thermometers, gas detectors, and ultrasonic rangefinders.
The navigation stack uses MATLAB-generated waypoint paths with
real-time obstacle avoidance.

- Thermal camera for hotspot detection up to 50m range
- LIDAR-based SLAM for autonomous path planning
- Gas sensor array for CO, CO₂, and particulate monitoring
- GPS + IMU fusion for outdoor localisation

## Results & Learnings

The robot successfully completed autonomous navigation trials in
simulated wildfire environments, detecting heat sources with 94%
accuracy at distances up to 30 metres. This project taught me the
full lifecycle of mechatronic system design — from CAD to embedded
firmware to field testing.
