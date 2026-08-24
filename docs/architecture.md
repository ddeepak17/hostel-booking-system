# HostelHub architecture

## System context

HostelHub is a three-role MERN application. A React single-page application calls an Express REST API, which persists users, property inventory, bookings, and reviews in MongoDB.

```text
Browser
  │
  │ React Router + Axios
  ▼
Express REST API
  │
  ├── JWT authentication and role checks
  ├── ownership and workflow validation
  └── Mongoose models and indexes
        │
        ▼
      MongoDB
```

Cloudinary is used directly by the owner media workflow when upload configuration is present. Google Maps embeds use a property's coordinates when available and fall back to its formatted address.

## Frontend boundaries

The frontend is organized by responsibility rather than by development milestone:

- `api/` centralizes Axios configuration and endpoint calls.
- `context/` owns the authenticated user and persisted JWT session.
- `routes/ProtectedRoute.jsx` blocks unauthenticated users and enforces allowed roles.
- `pages/customer/` covers discovery, bookings, profile management, and reviews.
- `pages/owner/` covers inventory, media, bookings, tenants, and owner metrics.
- `pages/admin/` covers platform metrics and administrative views.
- `components/AppHeader.jsx` provides shared, role-aware navigation.

Client-side guards improve navigation, but they are not trusted as a security boundary. Every protected API route performs its own authentication and authorization.

## API boundaries

All endpoints are mounted below `/api`.

| Module | Access | Responsibility |
| --- | --- | --- |
| `/auth` | Public and authenticated | Register, sign in, read/update the current profile |
| `/properties` | Public | Search published properties and read property detail |
| `/rooms` | Public | Read bookable rooms for a property |
| `/beds` | Public | Read bed availability for a room |
| `/reviews` | Public read, customer write | Read property reviews and save an eligible customer's review |
| `/customer` | Customer | Create, view, and cancel the current user's bookings |
| `/owner` | Owner | Manage owned inventory, bookings, and current tenants |
| `/admin` | Super admin | Read platform data and manage user status/owner accounts |

The API applies security headers, JSON size limits, a global API rate limit, and a stricter authentication rate limit before requests reach route handlers.

## Data model

Property inventory forms a strict hierarchy:

```text
User (owner)
  └── Property
        └── Building
              └── Floor
                    └── Room
                          └── Bed
```

Each level stores its parent reference. Owner mutations resolve the full chain before changing a nested resource, preventing one owner from editing another owner's inventory.

Supporting models:

- `Booking` links a customer, owner, property, room, and bed. It stores monthly rent and deposit snapshots so historical amounts remain stable if room pricing later changes.
- `Review` links one customer to one property and is unique for that pair. The customer must have a completed stay before writing it.
- `User` contains account status and one of the `customer`, `owner`, or `superAdmin` roles.

Compound indexes prevent duplicate bed/room/floor identifiers within their parent scope. A partial unique booking index prevents more than one active booking for a bed.

## Authentication and authorization

```text
Register or sign in
  → API returns a signed JWT
  → browser stores the token
  → Axios sends Authorization: Bearer <token>
  → protect middleware verifies the token and active user
  → role middleware checks the route's allowed role
  → controller validates ownership or record membership
```

Important server-side rules include:

- Disabled users cannot continue using protected routes.
- Expired or rejected sessions are removed by the frontend so stale authentication does not linger in the interface.
- Owners can only access resources beneath their own properties.
- Customers can only read or cancel their own bookings.
- Owners can only transition bookings attached to their properties.
- Administrative endpoints require the `superAdmin` role.
- Public nested inventory is returned only when every ancestor is active and the property is published.

## Booking lifecycle and availability

```text
available bed
  │ customer requests booking
  ▼
reserved bed + pending booking
  ├── owner approves   → occupied bed + approved booking
  ├── owner rejects    → available bed + rejected booking
  └── customer cancels → available bed + cancelled booking

approved booking
  └── owner completes  → available bed + completed booking
```

The initial reservation uses a conditional atomic update: only an active bed whose current status is `available` can move to `reserved`. Database uniqueness provides an additional guard against two active bookings for the same bed.

Each transition checks both the expected booking state and expected bed state. When a multi-document transition cannot finish, compensation logic restores the earlier state so a partial update is not presented as successful. This keeps the workflow compatible with both local standalone MongoDB and hosted replica-set deployments without making transactions a local-development requirement.

## Deployment

```text
Vercel
  └── React static build
        │ HTTPS REST calls
        ▼
Render
  └── Express API
        │ encrypted database connection
        ▼
MongoDB Atlas
```

Vercel rewrites client routes to `index.html` so direct navigation works with React Router. The API's `CLIENT_URL` setting must exactly match the deployed frontend origin.

The API validates required database, client-origin, and signing-secret configuration at startup. Production startup also rejects a JWT signing secret shorter than 32 characters.

## Current trade-offs

- JWTs are stored in local storage; an HTTP-only cookie session would reduce token exposure in a higher-security deployment.
- Booking/bed state changes use conditional updates and compensation logic rather than multi-document MongoDB transactions.
- The repository currently relies on linting, production builds, and syntax checks; focused API integration tests would be the next engineering-quality improvement.
- Payments, notifications, email verification, and password recovery are intentionally out of scope for this portfolio version.
