# Application Architecture

## User Roles

- Super Admin
- Property Owner
- Customer

## Core Property Structure

Property
→ Building
→ Floor
→ Room
→ Bed

## Main Models

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

## Booking Lifecycle

A booking begins as:

pending

The property owner can change it to:

pending → approved

or:

pending → rejected

A booking can also become:

pending/approved → cancelled

After an approved stay is completed:

approved → completed

## Application Layers

Frontend
→ API Request
→ Express Route
→ Middleware
→ Controller
→ Service / Business Logic
→ Mongoose Model
→ MongoDB