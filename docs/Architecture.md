# Architecture

Overview

Edge Proctor is structured as a small React application. Core responsibilities are split across components, hooks, and utility modules for easy testing and replacement.

Layers

- Components: UI and presentation (`src/components/`)
- Hooks: side-effectful logic and integrations (`src/hooks/`)
- Utils: pure functions and estimators (`src/utils/`)

Runtime

- Camera access is requested via `navigator.mediaDevices.getUserMedia`.
- Frames are passed to MediaPipe FaceMesh for landmark extraction.
- Landmark arrays are fed into `estimateGaze()` producing normalized gaze coordinates.
- `useAttention` consumes gaze updates and emits alerts when policy thresholds are exceeded.

Deployment

- Development: run `npm run dev` (Vite)
- Production: build with `npm run build` and serve the `dist/` folder over HTTPS.

Security & Privacy

All processing is client-side. If adding server-side features, ensure explicit consent and secure transmission/storage.

See `docs/Flowchart.md` for a process diagram and `docs/Project_Report.md` for a summary and next steps.
