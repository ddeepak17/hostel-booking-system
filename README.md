# HostelHub

HostelHub is a full-stack student accommodation platform built with the MERN stack. Students can compare properties and request an available bed, property owners can manage inventory and the booking lifecycle, and platform administrators can oversee users and activity from role-specific dashboards.

The project focuses on the operational details behind accommodation booking: nested property inventory, ownership boundaries, bed-level availability, price snapshots, booking state transitions, and review eligibility.

## Highlights

### Students

- Search by name, location, amenity, room type, price, and availability
- View property media, location, rooms, pricing, deposits, and individual beds
- Request an available bed for a selected check-in date
- Track pending, approved, rejected, cancelled, and completed bookings
- Maintain a profile and review a property after a completed stay

### Property owners

- Create and manage properties, buildings, floors, rooms, and beds
- Publish or deactivate inventory while retaining booking history
- Add property images and map coordinates
- Approve, reject, and complete booking requests
- View current tenants and active monthly rent

### Platform administrators

- Monitor platform totals and booking activity
- Create property-owner accounts
- Enable or disable customer and owner accounts
- Review properties and bookings across the platform

## Technical overview

| Area | Technology |
| --- | --- |
| Frontend | React 19, React Router, Vite, Tailwind CSS, Axios, Formik, Yup |
| Backend | Node.js, Express 5, Mongoose |
| Data | MongoDB Atlas |
| Authentication | JWT, bcrypt, protected role-based routes |
| Media and maps | Cloudinary uploads, Google Maps embeds |
| Security | Helmet, CORS allow-list, request size limits, API and authentication rate limits |
| Deployment | Vercel frontend, Render API, MongoDB Atlas |

See [docs/architecture.md](docs/architecture.md) for the data model, authorization boundaries, API modules, and booking transitions.

## Repository structure

```text
hostel-booking-system/
├── client/                  # React application
│   └── src/
│       ├── api/             # Axios client and endpoint wrappers
│       ├── components/      # Shared navigation
│       ├── context/         # Authentication state
│       ├── pages/           # Customer, owner, admin, and auth pages
│       └── routes/          # Client-side route guards
├── server/                  # Express API
│   └── src/
│       ├── controllers/     # Request and workflow logic
│       ├── middleware/      # Authentication and role checks
│       ├── models/          # Mongoose schemas and indexes
│       ├── routes/          # REST route modules
│       └── utils/           # Ownership and booking helpers
└── docs/architecture.md
```

## Run locally

### Requirements

- Node.js 20.19 or newer
- A MongoDB database
- Optional Cloudinary unsigned upload preset for browser uploads

### 1. Configure the API

```bash
cd server
cp .env.example .env
npm install
```

Set the following values in `server/.env`:

| Variable | Purpose |
| --- | --- |
| `PORT` | API port, typically `5001` |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Exact frontend origin allowed by CORS |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Private token-signing secret (at least 32 characters in production) |
| `JWT_EXPIRES_IN` | Token lifetime, for example `7d` |
| `SUPER_ADMIN_NAME` | Name used by the optional admin seed |
| `SUPER_ADMIN_EMAIL` | Email used by the optional admin seed |
| `SUPER_ADMIN_PASSWORD` | Password used by the optional admin seed |

Start the API:

```bash
npm run dev
```

To create or update the configured super-admin account:

```bash
npm run seed:admin
```

This is the repository's only seed command; properties, rooms, bookings, and reviews are managed through the application rather than committed demo fixtures.

### 2. Configure the frontend

In another terminal:

```bash
cd client
cp .env.example .env
npm install
```

Set the following values in `client/.env`:

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | API base URL including `/api`, such as `http://localhost:5001/api` |
| `VITE_CLOUDINARY_CLOUD_NAME` | Optional Cloudinary cloud name |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Optional unsigned upload preset |

Only the Cloudinary cloud name and an unsigned upload preset belong in the browser configuration. Never place a Cloudinary API secret in a `VITE_` variable.

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite. `CLIENT_URL` must use the same origin, including whether the hostname is `localhost` or `127.0.0.1`.

## Quality checks

```bash
cd client
npm run lint
npm run build

cd ../server
node --check server.js
find src -name '*.js' -exec node --check {} \;
```

## Intentional scope

The current portfolio version demonstrates the complete booking and management workflow without introducing payment or messaging complexity. Payments, notifications, email verification, and password recovery are sensible production extensions, but are intentionally outside the present feature set.
