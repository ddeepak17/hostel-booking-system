# HostelHub frontend

The React frontend for HostelHub. It provides public property discovery plus role-aware customer, property-owner, and platform-admin experiences.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

Copy `.env.example` to `.env` and set `VITE_API_URL` to the Express API base URL, including `/api`. Cloudinary values are optional unless browser-based image uploads are required.

Project-wide setup, features, and architecture are documented in the [root README](../README.md) and [architecture guide](../docs/architecture.md).
