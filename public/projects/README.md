# Project Assets

This folder is for **project-specific photos and documents**.

## Conventions

- Put each project’s assets in its own folder under `public/projects/<project-slug>/`.
- Recommended structure inside each project:
  - `cover.*` – primary cover image (e.g. `cover.jpg` or `cover.png`)
  - `images/` – additional photos/screenshots
  - `docs/` – PDFs, writeups, slide decks, etc.
- To use a local cover image on the site, update the project’s `image` field in `src/data/projects.ts` to:
  - `/projects/<project-slug>/cover.png` (or whatever extension you use)

## Current Project Folders

- `wildfire-robot` (Autonomous Wildfire Reconnaissance Robot)
- `apple-classifier` (Automated Apple Grade Classification)
- `ppg-monitor` (PPG Heart Rate Monitor)
- `okanagan-hydrail` (Okanagan Hydrail Feasibility Study)
- `photonics-optical-systems` (Photonics & Optical Systems)

