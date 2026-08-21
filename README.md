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

## Current Development Stage

The customer booking workflow and Property Owner booking-management workflow are complete.

The next development phase focuses on the Property Owner management interface:

- Property management UI
- Building management UI
- Floor management UI
- Room management UI
- Bed management UI
- Room pricing and security-deposit management
- Room capacity management
- Bed availability management

## Future Improvements

- Search and filtering
- Property images
- Cloudinary integration
- Google Maps integration
- Payments
- Notifications
- Reviews and ratings
- Analytics dashboard