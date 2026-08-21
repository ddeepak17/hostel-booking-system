# Application Architecture

## 1. Overview

The PG / Hostel Room Booking System is a full-stack MERN application for discovering, managing, and booking PG/hostel accommodation.

The application supports three primary user roles:

- Customer
- Property Owner
- Super Admin

The system separates:

- Authentication
- Role authorization
- Resource ownership
- Property management
- Room and bed availability
- Booking state
- Tenant state

This separation keeps security and business logic on the backend instead of trusting the frontend.

The overall production architecture is:

```text
React Frontend
      ↓
Axios HTTP Requests
      ↓
Express REST API
      ↓
Authentication / Authorization Middleware
      ↓
Controllers
      ↓
Business / Ownership Logic
      ↓
Mongoose Models
      ↓
MongoDB Atlas
```

The frontend is deployed using Vercel.

The backend API is deployed using Render.

MongoDB Atlas is used as the application database.

---

## 2. Technology Architecture

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Formik
- Yup

### Backend

- Node.js
- Express.js
- REST APIs
- JWT Authentication
- bcrypt Password Hashing
- Role-Based Authorization

### Database

- MongoDB Atlas
- Mongoose

### Deployment

```text
Vercel
   ↓
React Frontend
   ↓
Axios
   ↓
Render
   ↓
Express API
   ↓
Mongoose
   ↓
MongoDB Atlas
```

---

## 3. Application Layers

A typical backend request follows:

```text
HTTP Request
      ↓
Express Route
      ↓
Authentication Middleware
      ↓
Role Authorization
      ↓
Controller
      ↓
Ownership / Business Rules
      ↓
Mongoose Model
      ↓
MongoDB
      ↓
HTTP Response
```

### Backend Structure

```text
server/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   └── utils/
├── server.js
└── package.json
```

### Frontend Structure

```text
client/
└── src/
    ├── api/
    ├── components/
    ├── context/
    ├── hooks/
    ├── layouts/
    ├── pages/
    │   ├── auth/
    │   ├── customer/
    │   ├── owner/
    │   └── admin/
    ├── routes/
    └── utils/
```

---

## 4. User Roles

The system contains three roles:

```text
User
├── Customer
├── Property Owner
└── Super Admin
```

### Customer

Customers can register publicly.

Their role is automatically assigned as:

```text
customer
```

Customers cannot choose privileged roles during registration.

### Property Owner

Property Owners manage:

- Properties
- Buildings
- Floors
- Rooms
- Beds
- Booking requests
- Current tenants

Property Owner accounts are created by a Super Admin.

### Super Admin

The Super Admin manages privileged platform operations.

The initial Super Admin is provisioned using a server-side seed script rather than public registration.

---

## 5. Privileged User Provisioning

Normal registration creates Customer accounts only.

A public request cannot assign:

```text
owner
superAdmin
```

to itself.

### Initial Super Admin

```text
Environment Variables
        ↓
Seed Script
        ↓
User Model
        ↓
bcrypt Password Hashing
        ↓
Super Admin Account
```

### Property Owner Creation

```text
Authenticated Super Admin
        ↓
POST /api/admin/owners
        ↓
Validate Owner Information
        ↓
Hash Password
        ↓
Create User with role = owner
        ↓
Store createdBy reference
```

This avoids allowing normal users to create privileged accounts.

---

## 6. User Model

The User model represents all application users.

```text
User
├── name
├── email
├── password
├── phone
├── role
├── avatar
├── isActive
├── createdBy
├── createdAt
└── updatedAt
```

### Roles

```text
customer
owner
superAdmin
```

### Password Storage

Plain-text passwords are never stored.

```text
Plain Password
      ↓
bcrypt
      ↓
Password Hash
      ↓
MongoDB
```

Password comparison during login uses bcrypt rather than reversing or decrypting the stored password.

---

## 7. Authentication Architecture

Authentication uses JSON Web Tokens.

### Customer Registration

```text
Registration Form
      ↓
POST /api/auth/register
      ↓
Validate Data
      ↓
Check Duplicate Email
      ↓
Hash Password
      ↓
Create Customer
      ↓
Generate JWT
      ↓
Return User + Token
```

### Login

```text
Email + Password
      ↓
POST /api/auth/login
      ↓
Find User
      ↓
bcrypt.compare()
      ↓
Credentials Valid?
      ↓
Generate JWT
      ↓
Return User + Token
```

### Authenticated API Request

```text
Frontend
      ↓
Authorization: Bearer <JWT>
      ↓
protect Middleware
      ↓
jwt.verify()
      ↓
Read User ID
      ↓
Load Current User from MongoDB
      ↓
req.user
      ↓
Protected Route
```

The application reloads the current User from MongoDB after JWT verification.

This ensures authorization uses the User's current role and active status.

---

## 8. Authorization Architecture

Authentication and authorization are separate concerns.

### Authentication

Answers:

```text
Who is making this request?
```

Handled by:

```text
protect
```

### Role Authorization

Answers:

```text
Is this role allowed to use this route?
```

Handled by:

```text
authorize(...)
```

Examples:

```text
authorize("customer")
authorize("owner")
authorize("superAdmin")
```

### Resource Ownership

For Property Owner resources, there is a third check:

```text
Does this resource actually belong to this Owner?
```

Therefore:

```text
Authentication
      ↓
Role Authorization
      ↓
Resource Ownership
      ↓
Business Logic
```

---

## 9. HTTP Security Responses

The application distinguishes between authentication and authorization failures.

```text
401 Unauthorized
→ Authentication is missing, invalid, or expired.

403 Forbidden
→ User is authenticated but does not have the required role.

404 Not Found
→ Resource does not exist or is outside the authenticated Owner's permitted resource set.

409 Conflict
→ Request conflicts with current application state.
```

Examples of `409 Conflict` include:

- Booking an unavailable bed
- Trying to reject an approved booking
- Manually modifying a booking-controlled bed
- Duplicate active booking conflicts

---

## 10. Frontend Authentication

Authentication state is maintained through React Auth Context.

```text
Login / Register
      ↓
Backend Returns JWT
      ↓
Token Stored Locally
      ↓
Axios Interceptor
      ↓
Authorization Header
```

On refresh:

```text
AuthProvider
      ↓
Read Existing Token
      ↓
GET /api/auth/me
      ↓
Verify JWT
      ↓
Return Current User
      ↓
Restore Session
```

Frontend protected routes currently include:

```text
/customer/dashboard
→ customer

/customer/bookings
→ customer

/owner/dashboard
→ owner

/owner/bookings
→ owner

/owner/tenants
→ owner

/admin/dashboard
→ superAdmin
```

Frontend route protection is used for navigation and user experience.

Backend authorization remains the actual security boundary.

---

# 11. Core Property Hierarchy

The accommodation structure is:

```text
Property Owner
      ↓
Property
      ↓
Building
      ↓
Floor
      ↓
Room
      ↓
Bed
```

Each level is stored as its own collection and linked through MongoDB ObjectId references.

---

# 12. Current Core Models

Currently implemented core models are:

- User
- Property
- Building
- Floor
- Room
- Bed
- Booking

Later application stages add:

- Review
- Complaint
- PlatformSetting

---

# 13. Property Model

A Property represents one hostel or PG location.

```text
Property
├── owner → User
├── name
├── description
├── address
├── location
├── amenities
├── images
├── status
├── isActive
├── createdAt
└── updatedAt
```

### Property Status

```text
draft
published
inactive
```

Only active, published properties are considered bookable.

### Address

```text
address
├── line1
├── line2
├── city
├── state
├── postalCode
└── country
```

### Geographic Location

```text
location
├── type: Point
└── coordinates
    ├── longitude
    └── latitude
```

The structure prepares the application for later geographic search and Google Maps integration.

---

# 14. Building Model

```text
Building
├── property → Property
├── name
├── code
├── isActive
├── createdAt
└── updatedAt
```

Building names are unique within the same Property.

---

# 15. Floor Model

```text
Floor
├── building → Building
├── floorNumber
├── name
├── isActive
├── createdAt
└── updatedAt
```

Floor numbers are unique within each Building.

---

# 16. Room Model

```text
Room
├── floor → Floor
├── roomNumber
├── roomType
├── capacity
├── monthlyRent
├── securityDeposit
├── amenities
├── isActive
├── createdAt
└── updatedAt
```

### Room Types

```text
single
double
triple
shared
dormitory
```

### Pricing

```text
monthlyRent
securityDeposit
```

Pricing is currently configured at the Room level.

---

# 17. Room Capacity

Each Room defines a maximum number of active Beds.

Example:

```text
Room 101
capacity = 2
```

Allowed:

```text
Bed A
Bed B
```

Blocked:

```text
Bed C
```

The system also prevents reducing Room capacity below the number of currently active Beds.

---

# 18. Bed Model

```text
Bed
├── room → Room
├── bedNumber
├── status
├── isActive
├── createdAt
└── updatedAt
```

### Bed Status

```text
available
reserved
occupied
unavailable
```

### Responsibility for Bed Status

Property Owners manually control:

```text
available
unavailable
```

The Booking Engine controls:

```text
reserved
occupied
```

This separation prevents Owners from manually bypassing booking state.

---

# 19. Property Relationships

```text
Property.owner
→ User

Building.property
→ Property

Floor.building
→ Building

Room.floor
→ Floor

Bed.room
→ Room
```

Full hierarchy:

```text
User (Owner)
      ↓
Property
      ↓
Building
      ↓
Floor
      ↓
Room
      ↓
Bed
```

---

# 20. Property Ownership Authorization

Role authorization alone is insufficient.

For an Owner request:

```text
1. Is the user authenticated?
2. Is role === owner?
3. Does the resource belong to this Owner?
```

### Direct Property Ownership

```text
Property._id = requested property
AND
Property.owner = authenticated Owner
```

### Nested Ownership

#### Building

```text
Building
   ↓
Property
   ↓
Owner
```

#### Floor

```text
Floor
   ↓
Building
   ↓
Property
   ↓
Owner
```

#### Room

```text
Room
   ↓
Floor
   ↓
Building
   ↓
Property
   ↓
Owner
```

#### Bed

```text
Bed
   ↓
Room
   ↓
Floor
   ↓
Building
   ↓
Property
   ↓
Owner
```

Mongoose population is used to walk these relationships during ownership validation.

---

# 21. Cross-Owner Isolation

An Owner must never access another Owner's accommodation data.

Example:

```text
Owner A
└── Property A
    └── Building A
        └── Floor A
            └── Room A
                └── Bed A

Owner B
└── Property B
```

Owner B cannot:

- Read Property A
- Update Property A
- Modify Building A
- Modify Floor A
- Modify Room A
- Modify Bed A

Even if Owner B knows the resource ObjectId.

Unauthorized cross-owner resources return:

```text
404 Not Found
```

rather than exposing that the resource exists.

---

# 22. Property Owner Management API

All routes are protected by:

```text
protect
      ↓
authorize("owner")
```

## Properties

```text
GET    /api/owner/properties
POST   /api/owner/properties

GET    /api/owner/properties/:propertyId
PATCH  /api/owner/properties/:propertyId
DELETE /api/owner/properties/:propertyId
```

## Buildings

```text
GET  /api/owner/properties/:propertyId/buildings
POST /api/owner/properties/:propertyId/buildings

PATCH  /api/owner/buildings/:buildingId
DELETE /api/owner/buildings/:buildingId
```

## Floors

```text
GET  /api/owner/buildings/:buildingId/floors
POST /api/owner/buildings/:buildingId/floors

PATCH  /api/owner/floors/:floorId
DELETE /api/owner/floors/:floorId
```

## Rooms

```text
GET  /api/owner/floors/:floorId/rooms
POST /api/owner/floors/:floorId/rooms

PATCH  /api/owner/rooms/:roomId
DELETE /api/owner/rooms/:roomId
```

## Beds

```text
GET  /api/owner/rooms/:roomId/beds
POST /api/owner/rooms/:roomId/beds

PATCH  /api/owner/beds/:bedId
DELETE /api/owner/beds/:bedId
```

---

# 23. Soft Deactivation

Property resources use soft deactivation instead of immediate permanent deletion.

Example:

```text
Property
isActive = false
status = inactive
```

For Beds:

```text
isActive = false
status = unavailable
```

This preserves historical references that may later be needed by Bookings.

Beds controlled by active Bookings cannot be manually deactivated.

---

# 24. Booking Model

The Booking model connects a Customer to a specific Bed.

```text
Booking
├── customer → User
├── owner → User
├── property → Property
├── room → Room
├── bed → Bed
├── monthlyRentAtBooking
├── securityDepositAtBooking
├── checkInDate
├── status
├── customerNote
├── ownerNote
├── cancellationReason
├── isActiveBooking
├── approvedAt
├── rejectedAt
├── cancelledAt
├── completedAt
├── createdAt
└── updatedAt
```

---

# 25. Booking Price Snapshot

A Booking stores:

```text
monthlyRentAtBooking
securityDepositAtBooking
```

rather than depending only on the Room's current price.

Example:

```text
Customer books:
monthlyRent = 900

Later Owner changes Room:
monthlyRent = 950
```

The historical Booking still records:

```text
monthlyRentAtBooking = 900
```

This preserves the price associated with the original booking request.

---

# 26. Booking Context Resolution

The Customer does not determine sensitive booking fields.

The Customer submits:

```text
bedId
checkInDate
customerNote
```

The backend derives:

```text
Bed
 ↓
Room
 ↓
Floor
 ↓
Building
 ↓
Property
 ↓
Owner
```

The backend then determines:

- Property
- Owner
- Room
- Monthly rent
- Security deposit

This prevents the Customer from sending manipulated values such as a fake Owner ID or lower rent.

---

# 27. Bookable Resource Validation

A Bed is considered bookable only when its hierarchy is valid.

The application verifies:

```text
Bed is active
AND
Room is active
AND
Floor is active
AND
Building is active
AND
Property is active
AND
Property.status = published
```

The Bed must also have:

```text
status = available
```

before a new booking request can claim it.

---

# 28. Booking Lifecycle

Supported statuses are:

```text
pending
approved
rejected
cancelled
completed
```

The normal lifecycle is:

```text
available bed
      ↓
Customer submits booking
      ↓
pending
      ↓
Owner decision
```

Owner can approve:

```text
pending
   ↓
approved
```

or reject:

```text
pending
   ↓
rejected
```

An eligible active Booking may become:

```text
pending
   ↓
cancelled
```

or:

```text
approved
   ↓
cancelled
```

A successful completed stay becomes:

```text
approved
   ↓
completed
```

Overall:

```text
                  ┌──────────→ rejected
                  │
pending ──────────┼──────────→ approved ─────────→ completed
   │              │               │
   │              │               ↓
   └──────────────┴────────────→ cancelled
```

Invalid transitions return a conflict rather than silently modifying the Booking.

---

# 29. Active Booking State

A Booking contains:

```text
isActiveBooking
```

Active states include:

```text
pending
approved
```

Inactive historical states include:

```text
rejected
cancelled
completed
```

When a Booking reaches one of those final states:

```text
isActiveBooking = false
```

---

# 30. Double-Booking Prevention

The Booking Engine uses two layers of protection.

## Layer 1 — Atomic Bed Claim

The Customer does not simply read:

```text
status = available
```

and later update it.

Instead, MongoDB is asked to update only a Bed that still matches:

```text
_id = requested Bed
status = available
isActive = true
```

Then:

```text
available
   ↓ atomic update
reserved
```

If another Customer has already changed it:

```text
reserved
```

the atomic update fails.

This helps prevent two simultaneous requests from claiming the same Bed.

## Layer 2 — Active Booking Database Constraint

The Booking collection uses a unique partial index so a Bed cannot have more than one active Booking.

Conceptually:

```text
bed = X
AND
isActiveBooking = true
```

must be unique.

Historical rejected, cancelled, and completed Bookings can still reference the same Bed because:

```text
isActiveBooking = false
```

---

# 31. Booking Creation Flow

```text
Customer
   ↓
POST /api/customer/bookings
   ↓
Validate bedId
   ↓
Validate check-in date
   ↓
Resolve Bed hierarchy
   ↓
Validate Property / Building / Floor / Room / Bed
   ↓
Ensure Bed = available
   ↓
Atomically change Bed
available → reserved
   ↓
Create Booking
status = pending
   ↓
Store price snapshot
   ↓
Return Booking
```

If Booking creation fails after the Bed was claimed, the controller attempts to release:

```text
reserved → available
```

so inventory is not unnecessarily left locked.

---

# 32. Bed and Booking Synchronization

The Booking state controls the Bed state.

## New Booking

```text
Booking:
none → pending

Bed:
available → reserved
```

## Approval

```text
Booking:
pending → approved

Bed:
reserved → occupied
```

## Rejection

```text
Booking:
pending → rejected

Bed:
reserved → available
```

## Customer Cancellation

```text
Booking:
pending / approved → cancelled

Bed:
reserved / occupied → available
```

## Completion

```text
Booking:
approved → completed

Bed:
occupied → available
```

---

# 33. Booking-Controlled Bed Protection

Owners may manually manage Beds only when they are not controlled by an active Booking.

Allowed manual states:

```text
available ↔ unavailable
```

Blocked manual changes:

```text
reserved → unavailable
reserved → available

occupied → unavailable
occupied → available
```

A request attempting to manually modify a `reserved` or `occupied` Bed returns:

```text
409 Conflict
```

The Owner also cannot deactivate a Bed while its status is:

```text
reserved
occupied
```

---

# 34. Customer Booking API

Customer booking routes require:

```text
protect
      ↓
authorize("customer")
```

Current endpoints:

```text
GET  /api/customer/bookings
POST /api/customer/bookings
```

Customer booking detail:

```text
GET /api/customer/bookings/:bookingId
```

Customer cancellation:

```text
PATCH /api/customer/bookings/:bookingId/cancel
```

Customers can access only their own Bookings.

---

# 35. Owner Booking API

Owner booking routes require:

```text
protect
      ↓
authorize("owner")
```

### List Bookings

```text
GET /api/owner/bookings
```

Optional status filter:

```text
GET /api/owner/bookings?status=pending
```

### Booking Detail

```text
GET /api/owner/bookings/:bookingId
```

### Approve

```text
PATCH /api/owner/bookings/:bookingId/approve
```

### Reject

```text
PATCH /api/owner/bookings/:bookingId/reject
```

### Complete

```text
PATCH /api/owner/bookings/:bookingId/complete
```

An Owner query always includes:

```text
owner = req.user._id
```

so another Owner cannot retrieve or modify the Booking.

---

# 36. Booking Authorization

Booking security involves multiple levels.

### Customer

A Customer can:

- Create their own booking request
- View their own Bookings
- View one of their own Bookings
- Cancel an eligible Booking

A Customer cannot:

- Approve a Booking
- Reject a Booking
- Complete a Booking
- Access another Customer's Booking

### Property Owner

An Owner can:

- View Bookings for their own properties
- Approve their own Booking requests
- Reject their own Booking requests
- Complete their own approved Bookings
- View their current tenants

An Owner cannot:

- Manage another Owner's Booking
- Read another Owner's Booking
- Use booking actions on unrelated properties

---

# 37. Cross-Owner Booking Isolation

Each Booking stores:

```text
owner → User
```

Owner API queries include:

```text
owner = authenticated Owner
```

Example:

```text
Owner A
└── Booking A

Owner B
```

Even if Owner B knows:

```text
Booking A._id
```

the query does not return Booking A.

The response is:

```text
404 Booking not found
```

---

# 38. Booking State Validation

State transitions are deliberately restricted.

Examples:

```text
pending → approved ✅
pending → rejected ✅
pending → cancelled ✅

approved → completed ✅
approved → cancelled ✅

approved → rejected ❌
completed → cancelled ❌
rejected → approved ❌
```

Invalid transitions return:

```text
409 Conflict
```

rather than altering history incorrectly.

---

# 39. Check-In Date Validation

New Booking requests require a valid check-in date.

The backend rejects:

```text
Invalid date format
```

and:

```text
Check-in date in the past
```

before the Bed is reserved.

---

# 40. Tenant Architecture

A separate Tenant model is not currently required.

An active approved Booking represents a current tenant.

```text
Booking.status = approved
AND
Booking.isActiveBooking = true
```

means:

```text
Current Tenant
```

Owner endpoint:

```text
GET /api/owner/tenants
```

returns these approved active Bookings populated with Customer information.

When the Booking becomes:

```text
cancelled
completed
```

it is no longer part of the current tenant list.

---

# 41. Current Booking History

Customer history contains all of the Customer's Bookings, including final states.

Example:

```text
Booking 1 → rejected
Booking 2 → cancelled
Booking 3 → completed
```

Historical Bookings remain in MongoDB instead of being deleted.

This preserves:

- Pricing history
- Booking history
- Property references
- Customer history
- Owner history

---

# 42. Booking Data Population

Booking responses can populate referenced resources for readable API responses.

Customer Booking responses include information such as:

```text
Property
├── name
├── address
├── images
└── status

Room
├── roomNumber
├── roomType
├── capacity
├── monthlyRent
└── securityDeposit

Bed
├── bedNumber
└── status
```

Owner responses additionally populate Customer information such as:

```text
name
email
phone
avatar
```

---

# 43. Admin API

Super Admin routes require:

```text
protect
      ↓
authorize("superAdmin")
```

Currently implemented:

```text
GET /api/admin/dashboard

GET  /api/admin/owners
POST /api/admin/owners
```

Additional Admin functionality is implemented during the later Super Admin development stage.

---

# 44. Property Image Architecture

The Property model already supports:

```text
images[]
├── url
├── publicId
└── alt
```

A hosted media provider such as Cloudinary is planned for the Owner experience stage.

Actual image-upload functionality is not yet part of the current backend stage.

---

# 45. Map Architecture

Properties support GeoJSON-style location data:

```text
location
├── type: Point
└── coordinates
    ├── longitude
    └── latitude
```

This prepares the database for later:

- Google Maps display
- Location search
- Distance-based discovery

Map UI integration is a later development stage.

---

# 46. Environment Variables

Sensitive configuration remains outside source control.

Backend configuration includes:

```text
PORT
NODE_ENV
CLIENT_URL
MONGODB_URI
JWT_SECRET
JWT_EXPIRES_IN
SUPER_ADMIN_NAME
SUPER_ADMIN_EMAIL
SUPER_ADMIN_PASSWORD
```

Real `.env` files are ignored by Git.

`.env.example` contains variable names without production secrets.

---

# 47. Local Development Architecture

```text
React
localhost:5173
      ↓
Axios
      ↓
Express
localhost:5001
      ↓
Mongoose
      ↓
MongoDB Atlas
```

---

# 48. Production Architecture

```text
Vercel
React Frontend
      ↓
HTTPS
      ↓
Render
Express Backend
      ↓
Mongoose
      ↓
MongoDB Atlas
```

Local and production JWT secrets may be different.

Therefore:

```text
Local JWT
→ Local Backend

Production JWT
→ Production Backend
```

Tokens should not be assumed interchangeable between environments.

---

# 49. Security Principles

Current architecture follows these principles.

## Password Security

Passwords are stored using bcrypt hashes.

## JWT Authentication

Protected APIs require valid signed JWTs.

## Current User Lookup

JWT verification is followed by loading the current User from MongoDB.

## Role-Based Access Control

```text
Customer
Property Owner
Super Admin
```

have separate backend permissions.

## Ownership Authorization

Property Owners can access only their own resources.

## Privilege Protection

Public registration cannot create Owner or Super Admin accounts.

## Server-Derived Booking Data

Customers cannot dictate Owner IDs, Property IDs, or prices during Booking creation.

## Atomic Inventory Claim

Beds are atomically moved from:

```text
available → reserved
```

when Booking creation begins.

## Database Double-Booking Protection

Only one active Booking may reference a Bed.

## Booking-Controlled Inventory

Owners cannot manually override `reserved` or `occupied` Beds.

## Historical Preservation

Bookings and property resources use historical records / soft-deactivation instead of blindly deleting referenced data.

---

# 50. Current Implementation Status

## Day 1 — Foundation

Completed:

- React/Vite setup
- Tailwind CSS
- React Router
- Axios
- Express backend
- MongoDB Atlas
- Mongoose
- Environment variables
- Git/GitHub
- Render backend deployment
- Vercel frontend deployment
- Production frontend/backend communication

## Day 2 — Authentication and Authorization

Completed:

- User model
- bcrypt password hashing
- Customer registration
- Login
- JWT generation
- JWT verification
- Authentication middleware
- Role authorization
- Customer role
- Property Owner role
- Super Admin role
- Persistent frontend authentication
- Protected frontend routing
- Privileged dashboard routing

## Day 3 — Property Management Backend

Completed:

- Super Admin provisioning
- Super Admin-created Property Owners
- Property Owner authentication
- Property model
- Building model
- Floor model
- Room model
- Bed model
- Property CRUD
- Building CRUD
- Floor CRUD
- Room CRUD
- Bed CRUD
- Pricing
- Security deposit
- Room capacity
- Bed availability
- Property ownership authorization
- Cross-owner resource isolation

## Day 4 — Booking Engine

Completed:

- Booking model
- Booking references
- Price snapshots
- Check-in date validation
- Customer booking creation
- Atomic Bed reservation
- Double-booking prevention
- Customer booking history
- Customer booking detail
- Customer cancellation
- Owner Booking list
- Booking status filtering
- Owner Booking detail
- Booking approval
- Booking rejection
- Booking completion
- Bed-state synchronization
- Tenant derivation
- Cross-owner Booking isolation
- Invalid transition protection
- Booking-controlled Bed-state protection

---

## Day 5 — Customer Experience

Completed:

- Public property APIs
- Public room APIs
- Public bed APIs
- Customer property browsing UI
- Property details page
- Room and bed display
- Booking creation UI
- Customer booking history
- Booking cancellation UI
- Loading states
- Error handling
- Protected customer routes

Current status:

Customer booking workflow is complete.

---

## Day 6 — Property Owner Experience

Completed:

- Owner frontend API integration
- Property Owner dashboard
- Property summary
- Pending Booking summary
- Approved Booking summary
- Current Tenant summary
- Active monthly-rent summary
- Owner Booking-management page
- Booking status filtering
- Booking approval UI
- Booking rejection UI
- Booking completion UI
- Current Tenant-management page
- Customer information display
- Owner Booking notes
- Booking and Bed-state synchronization verification
- Customer-to-Owner booking workflow verification
- Owner-to-Customer status propagation
- Protected Owner frontend routes
- Customer isolation from Owner frontend routes
- Customer check-in date selection
- Frontend lint cleanup
- Local production build verification
- Vercel production verification

Current status:

The Customer booking lifecycle and Property Owner booking-management lifecycle are both complete.

The complete operational workflow is now:

```text
Customer selects available Bed
        ↓
Customer submits Booking
        ↓
Booking = pending
Bed = reserved
        ↓
Owner reviews Booking
        ↓
     Decision
    ↙        ↘
Reject      Approve
  ↓           ↓
rejected    approved
available   occupied
              ↓
        Current Tenant
              ↓
        Complete Stay
              ↓
          completed
          available
```

---

# 51. Current Development Stage — Property Owner Management

The Customer Experience and Owner booking-management experience are complete.

The current development stage exposes the existing Property-management backend through the Property Owner frontend.

Planned flow:

```text
Owner Dashboard
      ↓
Properties
      ↓
Buildings
      ↓
Floors
      ↓
Rooms
      ↓
Beds
```

Day 7 focuses on:

- Property listing and management
- Property creation and editing
- Property activation/deactivation
- Building creation and management
- Floor creation and management
- Room creation and management
- Room type
- Room capacity
- Monthly rent
- Security deposit
- Bed creation and management
- Bed availability
- Integration with existing ownership authorization

---

# 52. Remaining Development Stages

## Property Owner Management

Remaining:

- Property-management UI
- Building-management UI
- Floor-management UI
- Room-management UI
- Bed-management UI
- Property images

The Owner dashboard, Booking-management workflow, approval/rejection/completion actions, Tenant view, and revenue summary are already implemented.

## Super Admin

Planned:

- Owner management UI
- User management
- Property oversight
- All Bookings
- Platform overview
- Complaints
- Platform settings

## Remaining Customer Features

Planned:

- Property search
- Property filters
- Customer profile
- Reviews and ratings

## Additional Product Features

Planned where time permits:

- Cloudinary property-image uploads
- Google Maps integration
- Notifications

## Final Production Pass

Planned:

- UI and responsive-design polish
- Centralized error handling review
- Validation audit
- Rate limiting
- Security audit
- NoSQL-injection protection
- Loading/error/empty-state audit
- Full Customer end-to-end testing
- Full Property Owner end-to-end testing
- Full Super Admin testing
- Production verification
- Final README update
- Final architecture update
- Demo preparation
