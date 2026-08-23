# PG / Hostel Room Booking System

A full-stack multi-role hostel accommodation platform that enables customers to discover properties, reserve beds, and manage booking workflows through secure role-based access control.

## Technology Stack

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
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Role-based authorization

## User Roles

- Customer
- Property Owner
- Super Admin

## Core Property Structure

Property
→ Building
→ Floor
→ Room
→ Bed

## Development Status

### Day 1 — Project Foundation

Completed:

- Frontend application setup with React and Vite
- Tailwind CSS configuration
- React Router setup
- Axios API configuration
- Backend setup with Node.js and Express
- MongoDB Atlas connection using Mongoose
- Environment variable configuration
- Express health endpoint
- Frontend-to-backend API connection
- Project folder architecture
- Git and GitHub setup
- Backend deployment on Render
- Frontend deployment on Vercel
- Production frontend-to-backend connection

### Day 2 — Authentication and Authorization

Completed:

- User model with Mongoose validation
- Password hashing using bcrypt
- Customer registration
- Login API
- JWT token generation and verification
- Protected authentication middleware
- Role-based authorization middleware
- Customer, Property Owner, and Super Admin role support
- Current-user endpoint
- Duplicate email handling
- Invalid login handling
- React registration form using Formik and Yup
- React login form
- Axios JWT interceptor
- Auth context and session restoration
- Persistent authentication
- Logout functionality
- Protected frontend routes
- Role-based dashboard routing
- Local authentication testing
- Production authentication testing

### Day 3 — Property Management Backend

Completed:

- Secure Super Admin provisioning
- Super Admin account testing
- Property Owner creation by Super Admin
- Property Owner authentication
- Property model
- Building model
- Floor model
- Room model
- Bed model
- Property ownership authorization
- Property management API
- Building management API
- Floor management API
- Room management API
- Bed management API
- Room pricing
- Room capacity enforcement
- Bed availability management
- Cross-owner access protection
- Privileged role testing

### Day 4 — Booking Engine

Completed:

- Booking model
- Customer booking requests
- Automatic property, room, owner, and pricing resolution
- Booking price snapshots
- Check-in date validation
- Pending booking workflow
- Atomic bed reservation
- Double-booking prevention
- Owner booking management
- Booking approval
- Booking rejection
- Customer cancellation
- Booking completion
- Bed status synchronization
- Current tenant management
- Booking history
- Invalid booking-state protection
- Customer/Owner role protection
- Cross-owner booking isolation
- Booking-controlled bed states

## Day 5 — Customer Experience

Completed:

- Public property discovery
- Property listing page
- Property details page
- Room availability display
- Bed availability display
- Pricing display
- Customer booking interface
- Customer booking history
- Booking cancellation
- Protected customer routes
- Frontend loading and error states

## Day 6 — Property Owner Experience

Completed:

- Property Owner dashboard
- Property count summary
- Pending booking count
- Approved booking count
- Current tenant count
- Active monthly-rent summary
- Owner booking-management page
- Booking status filtering
- Booking approval UI
- Booking rejection UI
- Booking completion UI
- Current-tenants page
- Customer and accommodation details for Owner bookings
- Owner notes
- Booking and Bed state synchronization
- Protected Owner frontend routes
- Customer access protection for Owner pages
- Customer check-in date selection
- Frontend lint cleanup
- Production Owner workflow verification

## Day 7 — Property Owner Management

Completed:

- Owner property-management page
- Property creation
- Property editing
- Draft and published property status management
- Property deactivation and reactivation
- Building listing and management
- Building creation and editing
- Building deactivation and reactivation
- Floor listing and management
- Floor creation and editing
- Floor deactivation and reactivation
- Room listing and management
- Room creation and editing
- Room-type management
- Room-capacity management
- Monthly-rent management
- Security-deposit management
- Room amenities
- Room deactivation and reactivation
- Bed listing and management
- Bed creation and renaming
- Bed availability management
- Bed deactivation
- Room bed-capacity enforcement
- Booking-controlled bed protection
- Protected Owner property-management routes
- Customer access protection for Owner management pages
- Customer regression testing
- Production Owner property-management verification

## Day 8 — Super Admin and Enhanced Customer Experience

Completed:

### Super Admin

- Super Admin dashboard improvements
- Platform-wide statistics
- Customer count
- Property Owner count
- Property count
- Booking count
- Pending Booking count
- Active Tenant count
- Active monthly-rent summary
- Property Owner listing
- Property Owner creation UI
- Property Owner activation and disabling
- User listing
- Customer and Owner filtering
- User activation and disabling
- Platform property oversight
- Platform-wide Booking oversight
- Booking status filtering
- Protected Super Admin frontend routes
- Customer and Owner access protection for Super Admin pages

### Customer Discovery

- Property search
- City filtering
- Amenity filtering
- Room-type filtering
- Minimum-rent filtering
- Maximum-rent filtering
- Available-Bed filtering
- Search-result empty states
- Filter reset functionality

### Customer Profile

- Customer profile page
- Name editing
- Phone editing
- Avatar URL support
- Persistent profile updates
- Auth Context refresh after profile updates

### Reviews and Ratings

- Review model
- Public property reviews
- Property average rating
- Customer review creation
- Existing review updates
- Completed-stay eligibility validation
- One review per Customer per Property

### Quality and Production

- Backend API syntax verification
- Frontend lint cleanup
- Production build verification
- Customer regression testing
- Property Owner regression testing
- Super Admin role testing
- Render production verification
- Vercel production verification

## Current Development Stage

The core functional product is now complete across all three primary roles.

### Customer

Customers can:

- Register and log in
- Search and filter properties
- View property details
- View rooms and available Beds
- View pricing
- Submit Booking requests
- View Booking history and status
- Cancel eligible Bookings
- Manage profile information
- Submit and update reviews after completed stays

### Property Owner

Property Owners can:

- Manage Properties
- Manage Buildings
- Manage Floors
- Manage Rooms
- Configure room type and capacity
- Configure monthly rent and security deposits
- Manage Beds and availability
- View Booking requests
- Approve and reject Bookings
- View current Tenants
- Complete stays

### Super Admin

Super Admins can:

- View platform statistics
- Create Property Owner accounts
- Activate and disable Owners
- View and manage platform users
- View platform Properties
- View platform-wide Bookings
- Filter Booking activity

The final development stage focuses on product polish, additional integrations, security review, complete end-to-end testing, and final delivery.

## Final Development Stage

### Additional Product Features

Planned where feasible:

- Property image uploads
- Cloudinary integration
- Property image galleries
- Google Maps integration
- Property location display
- In-app notifications

### UI and Responsive Polish

- Global navigation
- Consistent role-specific navigation
- Improved property cards
- Improved dashboards
- Improved forms
- Improved status badges
- Consistent buttons and spacing
- Responsive mobile layouts
- Loading-state review
- Error-state review
- Empty-state review

### Security and Validation Audit

- Authentication review
- Role-authorization review
- Property ownership-isolation review
- Booking-state validation review
- Request validation review
- Rate limiting where appropriate
- NoSQL-injection protection review
- CORS review
- Environment-secret review

### Final Verification and Delivery

- Complete Customer end-to-end testing
- Complete Property Owner end-to-end testing
- Complete Super Admin end-to-end testing
- Vercel production verification
- Render production verification
- MongoDB Atlas verification
- Final screenshots
- Demo preparation
- Final README update
- Final architecture update