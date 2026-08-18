# Application Architecture

## 1. Overview

The PG / Hostel Room Booking System is a full-stack MERN application that supports three primary user roles:

- Customer
- Property Owner
- Super Admin

The application separates authentication, authorization, property ownership, accommodation structure, and booking logic so that each area can be developed and secured independently.

The core production architecture is:

```text
React Frontend
      ↓
Axios HTTP Requests
      ↓
Express REST API
      ↓
Authentication / Authorization Middleware
      ↓
Controllers / Business Logic
      ↓
Mongoose Models
      ↓
MongoDB Atlas
```

The frontend is deployed using Vercel.

The backend API is deployed using Render.

MongoDB Atlas is used as the production database.

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

The backend currently follows this request flow:

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
Ownership / Business Logic
      ↓
Mongoose Model
      ↓
MongoDB
      ↓
HTTP Response
```

The project also contains folders for reusable services and utilities as the application grows.

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

The system has three user roles.

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

Customers cannot assign themselves privileged roles.

### Property Owner

Property Owners manage accommodation properties and their internal structure.

Property Owner accounts are created by an authenticated Super Admin.

### Super Admin

The Super Admin manages privileged platform operations including Property Owner accounts.

The initial Super Admin is not created through public registration.

It is provisioned using a secure server-side seed script.

---

## 5. Privileged User Provisioning

Public registration creates Customer accounts only.

The API does not accept a user-supplied privileged role during normal registration.

This prevents a request such as:

```json
{
  "role": "superAdmin"
}
```

from creating an administrator account.

### Initial Super Admin

The initial Super Admin is provisioned using environment variables and a server-side seed script.

```text
Environment Variables
        ↓
Seed Script
        ↓
User Model
        ↓
bcrypt Password Hash
        ↓
Super Admin Account
```

### Property Owner Creation

After the Super Admin exists:

```text
Super Admin
      ↓
Authenticated Admin API
      ↓
Create Property Owner
      ↓
Password Hashed
      ↓
Owner Saved to MongoDB
```

The created Owner stores a reference to the Super Admin that created the account through:

```text
User.createdBy
```

---

## 6. Authentication Architecture

Authentication uses JSON Web Tokens.

### Registration Flow

```text
Customer Registration Form
        ↓
POST /api/auth/register
        ↓
Validate User Data
        ↓
Check Existing Email
        ↓
bcrypt Hash Password
        ↓
Create User
        ↓
Generate JWT
        ↓
Return User + Token
```

### Login Flow

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

### Authenticated Request Flow

```text
Frontend
   ↓
Authorization: Bearer <JWT>
   ↓
protect Middleware
   ↓
Verify JWT
   ↓
Read User ID from Token
   ↓
Load Current User from MongoDB
   ↓
req.user
   ↓
Protected Controller
```

The current user is loaded from MongoDB after token verification rather than trusting role information stored only inside the JWT.

This ensures current account state and current role information are used for authorization.

---

## 7. Authorization Architecture

Authentication and authorization are treated separately.

### Authentication

Answers:

```text
Who is this user?
```

Handled by:

```text
protect
```

### Role Authorization

Answers:

```text
Is this type of user allowed to access this route?
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

### HTTP Status Behaviour

```text
401 Unauthorized
→ User is not successfully authenticated.

403 Forbidden
→ User is authenticated but does not have the required role.
```

---

## 8. Frontend Authentication

The frontend maintains authentication through an Auth Context.

```text
Login / Register
      ↓
API Returns JWT
      ↓
Token Stored Locally
      ↓
Axios Interceptor
      ↓
Authorization Header Added Automatically
```

When the application reloads:

```text
AuthProvider Starts
      ↓
Check Existing Token
      ↓
GET /api/auth/me
      ↓
Backend Verifies JWT
      ↓
Current User Returned
      ↓
Session Restored
```

Frontend routes are also protected by role.

```text
/customer/dashboard
→ customer

/owner/dashboard
→ owner

/admin/dashboard
→ superAdmin
```

Frontend route protection improves the user experience, but backend authorization remains the actual security boundary.

---

# 9. Core Property Hierarchy

The accommodation system uses the following hierarchy:

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

Each level is stored as a separate MongoDB collection and linked through ObjectId references.

This prevents the Property model from becoming one deeply nested document and gives each resource its own lifecycle.

---

# 10. Core Models

The planned application contains the following primary models:

- User
- Property
- Building
- Floor
- Room
- Bed
- Booking
- Review
- Complaint
- PlatformSetting

The following models are currently implemented:

- User
- Property
- Building
- Floor
- Room
- Bed

Booking and the remaining platform models are implemented in later stages.

---

# 11. User Model

The User model stores identity and authorization information.

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

Supported roles:

```text
customer
owner
superAdmin
```

Passwords are never stored in plain text.

Before a new or modified password is saved:

```text
Plain Password
      ↓
bcrypt
      ↓
Password Hash
      ↓
MongoDB
```

---

# 12. Property Model

A Property represents one PG or hostel location.

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

### Address Structure

```text
address
├── line1
├── line2
├── city
├── state
├── postalCode
└── country
```

### Location Structure

Location is designed to support geographic search and map integration.

```text
location
├── type: Point
└── coordinates
    ├── longitude
    └── latitude
```

A geospatial index is used on the location field.

---

# 13. Building Model

A property may contain one or more buildings.

```text
Building
├── property → Property
├── name
├── code
├── isActive
├── createdAt
└── updatedAt
```

Building names must be unique within the same property.

Example:

```text
Harbour View Student Residence
├── Main Building
└── Annex Building
```

---

# 14. Floor Model

Each Building can contain multiple Floors.

```text
Floor
├── building → Building
├── floorNumber
├── name
├── isActive
├── createdAt
└── updatedAt
```

A floor number must be unique within a Building.

Example:

```text
Main Building
├── Floor 0
├── Floor 1
├── Floor 2
└── Floor 3
```

---

# 15. Room Model

A Floor contains Rooms.

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

Supported room types currently include:

```text
single
double
triple
shared
dormitory
```

### Pricing

Pricing is currently configured at the Room level.

```text
monthlyRent
securityDeposit
```

Example:

```text
Room 101
├── monthlyRent: 900
└── securityDeposit: 500
```

---

# 16. Room Capacity

Every room defines its maximum number of active Beds.

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

Not allowed:

```text
Bed C
```

The application prevents creation of active Beds beyond the Room's configured capacity.

The Room capacity also cannot be reduced below its current number of active Beds.

Example:

```text
Active Beds = 2

Attempt:
capacity = 1

Result:
Rejected
```

---

# 17. Bed Model

Rooms contain individual bookable Beds.

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

Beds support:

```text
available
reserved
occupied
unavailable
```

At the current stage, Property Owners can manually change Beds only between:

```text
available
unavailable
```

The states:

```text
reserved
occupied
```

are reserved for the Booking workflow.

This prevents an Owner from manually bypassing booking state transitions.

---

# 18. Model Relationships

The core database relationships are:

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

Complete relationship path:

```text
User
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

# 19. Property Ownership Authorization

Role authorization alone is not sufficient.

An authenticated Property Owner must only be allowed to access their own accommodation data.

The application therefore performs three separate security checks.

```text
1. Authentication
   ↓
Is the user logged in?

2. Role Authorization
   ↓
Is the user a Property Owner?

3. Resource Ownership
   ↓
Does this resource actually belong to this Owner?
```

---

# 20. Direct Property Ownership

A Property directly contains its Owner reference.

Ownership can therefore be checked using:

```text
Property._id = requested property
AND
Property.owner = authenticated owner
```

If the resource does not match the authenticated Owner, it is not returned.

---

# 21. Nested Ownership

Nested resources do not directly store the Owner.

Ownership is resolved through the hierarchy.

### Building Ownership

```text
Building
   ↓
Property
   ↓
Owner
```

### Floor Ownership

```text
Floor
   ↓
Building
   ↓
Property
   ↓
Owner
```

### Room Ownership

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

### Bed Ownership

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

Mongoose population is used to resolve these parent relationships during ownership checks.

---

# 22. Cross-Owner Isolation

The application is designed so one Property Owner cannot access another Owner's resources.

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

Owner B must not be able to:

- Read Property A
- Update Property A
- Modify Building A
- Modify Floor A
- Modify Room A
- Modify Bed A

Even if Owner B obtains the MongoDB ObjectId.

For ownership-restricted queries, inaccessible resources are returned as:

```text
404 Not Found
```

instead of revealing that another Owner's resource exists.

---

# 23. Property Owner API Structure

All Property Owner management routes are protected by:

```text
protect
      ↓
authorize("owner")
```

The current Owner API structure includes:

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

# 24. Soft Deactivation

Property resources are not permanently removed by normal DELETE operations.

Instead, they are soft-deactivated.

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

This design protects historical data once Bookings reference these resources.

---

# 25. Admin API Structure

Super Admin routes require:

```text
protect
      ↓
authorize("superAdmin")
```

Current privileged-user management includes:

```text
GET  /api/admin/dashboard

GET  /api/admin/owners
POST /api/admin/owners
```

Property Owner accounts are therefore created through an authenticated administrative workflow rather than public registration.

Additional Super Admin functionality is added in later stages.

---

# 26. Booking Architecture

The Booking system is the next major application layer.

The intended relationship is:

```text
Customer
   ↓
Property
   ↓
Room
   ↓
Bed
   ↓
Booking
```

A Booking will connect:

```text
Booking
├── customer → User
├── property → Property
├── room → Room
├── bed → Bed
├── price
├── checkInDate
├── status
├── createdAt
└── updatedAt
```

The final Booking model and transaction rules are implemented during the Booking Engine stage.

---

# 27. Booking Lifecycle

A Booking begins as:

```text
pending
```

The Property Owner can then:

```text
pending
   ↓
approved
```

or:

```text
pending
   ↓
rejected
```

The Customer may also cancel eligible Bookings:

```text
pending
   ↓
cancelled
```

or where permitted:

```text
approved
   ↓
cancelled
```

After an approved stay is finished:

```text
approved
   ↓
completed
```

Full state model:

```text
                ┌──────────→ rejected
                │
pending ────────┼──────────→ approved ───────→ completed
                │                │
                │                ↓
                └──────────→ cancelled
```

---

# 28. Planned Bed / Booking Synchronization

The Booking Engine will control reservation-related Bed states.

Intended flow:

```text
Bed = available
      ↓
Customer requests booking
      ↓
Booking = pending
      ↓
Bed protected from competing booking requests
      ↓
Owner reviews booking
```

If approved:

```text
Booking = approved
Bed = reserved / occupied
```

If rejected:

```text
Booking = rejected
Bed = available
```

If cancelled:

```text
Booking = cancelled
Bed = available
```

The booking implementation must prevent two customers from successfully booking the same Bed at the same time.

---

# 29. Planned Customer Experience

Customer functionality will include:

```text
Browse Properties
      ↓
Search / Filter
      ↓
Property Details
      ↓
Rooms
      ↓
Available Beds
      ↓
Pricing
      ↓
Booking Request
      ↓
Booking Status
      ↓
Booking History
```

Customers will also be able to manage their profile and submit reviews/ratings.

---

# 30. Planned Property Owner Experience

The Property Owner interface will expose the backend hierarchy visually.

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

Additional Owner functionality will include:

- Booking management
- Approve/reject booking requests
- Tenant management
- Property images
- Revenue reporting
- Availability management

---

# 31. Planned Super Admin Experience

The final Super Admin dashboard will support:

- Manage Property Owners
- Manage Users
- Manage PG/Hostel properties
- View all Bookings
- View platform revenue
- Manage complaints
- Manage platform settings

---

# 32. Image Architecture

Property image support is planned using Cloudinary or a similar hosted media provider.

The Property model already supports image metadata in the form:

```text
images[]
├── url
├── publicId
└── alt
```

The upload workflow is implemented in a later stage.

---

# 33. Map Architecture

Properties include geographic location data:

```text
GeoJSON Point
├── longitude
└── latitude
```

This provides the database structure required for later Google Maps integration and geographic property search.

---

# 34. Environment Variables

Sensitive configuration is stored outside source control.

Backend environment variables include values such as:

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

Real `.env` files are excluded from Git.

`.env.example` contains only variable names and safe placeholders.

---

# 35. Deployment Architecture

## Local Development

```text
React
localhost:5173
      ↓
Express
localhost:5001
      ↓
MongoDB Atlas
```

## Production

```text
Vercel
React Frontend
      ↓
HTTPS / Axios
      ↓
Render
Express Backend
      ↓
Mongoose
      ↓
MongoDB Atlas
```

Production and local environments maintain separate configuration values where appropriate.

---

# 36. Security Principles

The architecture currently follows these security principles:

### Password Security

```text
Plain Password
      ↓
bcrypt
      ↓
Hash Only Stored
```

### JWT Verification

Protected APIs require a valid signed JWT.

### Role-Based Access Control

```text
Customer
Property Owner
Super Admin
```

have separate permissions.

### Ownership Authorization

A Property Owner must own the requested resource.

### Privilege Protection

Public users cannot choose privileged roles during registration.

### Sensitive Configuration

Secrets remain in environment variables and are excluded from Git.

### Resource History

Core property resources are soft-deactivated instead of immediately destroyed.

---

# 37. Current Development State

## Completed

### Foundation

- React/Vite frontend
- Tailwind CSS
- React Router
- Axios
- Express backend
- MongoDB Atlas
- Mongoose
- Render deployment
- Vercel deployment
- Production frontend/backend communication

### Authentication

- User model
- Customer registration
- Login
- bcrypt password hashing
- JWT creation
- JWT verification
- Auth middleware
- Current-user endpoint
- Persistent frontend authentication
- Logout
- Protected frontend routes

### Authorization

- Customer role
- Property Owner role
- Super Admin role
- Role-based backend protection
- Role-based frontend routing
- Secure Super Admin provisioning
- Super Admin-created Property Owners

### Property Management Backend

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
- Ownership authorization
- Cross-owner isolation
- Room pricing
- Security deposits
- Capacity enforcement
- Bed availability
- Soft deactivation

---

# 38. Next Development Stage

The next major system is the Booking Engine.

It will implement:

```text
Customer Booking Request
        ↓
Booking Validation
        ↓
Double-Booking Prevention
        ↓
Pending Booking
        ↓
Owner Approval / Rejection
        ↓
Bed Status Synchronization
        ↓
Tenant Management
        ↓
Cancellation / Completion
```

After the Booking Engine is complete, development proceeds to:

1. Customer-facing property and booking UI
2. Property Owner management UI
3. Property image uploads
4. Revenue reporting
5. Super Admin management features
6. Reviews and ratings
7. Complaints and platform settings
8. Google Maps integration
9. Security and validation audit
10. Final production testing and polish