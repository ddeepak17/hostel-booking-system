# Application Architecture

## Overview

A MERN application supporting Customers, Property Owners, and Super
Admins.

## Production Architecture

    React Frontend
          ↓
    Axios
          ↓
    Express REST API
          ↓
    Authentication
          ↓
    Authorization
          ↓
    Controllers
          ↓
    Mongoose
          ↓
    MongoDB Atlas

## Application Structure

Frontend:

    client/src
    ├── api
    ├── components
    ├── context
    ├── pages
    │   ├── customer
    │   ├── owner
    │   └── admin
    └── routes

Backend:

    server/src
    ├── controllers
    ├── middleware
    ├── models
    ├── routes
    ├── services
    └── utils

## Authentication

    Login/Register
     ↓
    JWT Token
     ↓
    Axios Authorization Header
     ↓
    Protect Middleware
     ↓
    Current User Lookup
     ↓
    Protected Route

## Authorization

Every protected operation validates:

1.  Authentication
2.  User role
3.  Resource ownership

## Property Hierarchy

    Owner
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

## Booking Flow

    Customer
     ↓
    Booking
     ↓
    Bed
     ↓
    Room
     ↓
    Property
     ↓
    Owner

Implemented: - Price snapshots - Reservation protection -
Approval/rejection - Cancellation - Completion - Tenant tracking

## Day 9 Production Features

### Media

-   Property images
-   Image URLs
-   Optional Cloudinary uploads

### Location

-   Coordinates
-   Google Maps display

### Security

-   API rate limiting
-   Authentication rate limiting
-   Request limits
-   Security headers

## Future Improvements

-   Notifications
-   Payments
-   Email verification
-   Password reset
-   Analytics
