# Wedding Photo-Sharing Platform

A full-featured React-based web application for wedding photographers and clients to manage, organize, and share wedding photography albums. Built with modern web technologies and designed for seamless collaboration between photographers and their clients.

## 🎯 Overview

This platform enables photography studios to:
- Create and manage wedding photo albums
- Organize photos into hierarchical folder structures
- Control album visibility (public for clients, private for internal use)
- Share albums with clients securely
- Track photography events and bookings

Clients can:
- View and download their wedding photos
- Browse photos in an elegant gallery interface
- Download individual photos or entire albums

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Integration](#api-integration)
- [User Roles](#user-roles)
- [Key Components](#key-components)
- [Development Guide](#development-guide)
- [Contributing](#contributing)

## ✨ Features

### Authentication & Authorization
- JWT-based authentication system
- Secure password hashing (SHA-256)
- Role-based access control (Photographer, Studio Owner, Customer)
- Persistent login with automatic token validation

### Album Management
- ✅ Create albums with client metadata
- ✅ Upload cover photos and thumbnails
- ✅ Store client information (name, email, phone)
- ✅ Set event dates and locations
- ✅ Assign multiple photographers per album
- ✅ Toggle album visibility (public/private)
- ✅ Delete albums with confirmation

### Photo Organization
- ✅ Hierarchical folder structure (nested folders)
- ✅ Drag-and-drop photo upload
- ✅ Drag-select multiple photos
- ✅ Create, rename, and delete folders
- ✅ Organize photos by event type (ceremony, portraits, environment, etc.)

### Photo Management
- ✅ Multi-select photo operations
- ✅ Download individual photos
- ✅ Download multiple photos as ZIP archive
- ✅ Delete photos with confirmation
- ✅ Filter photos by detected faces
- ✅ Image preview with pan and zoom

### Gallery & Viewing
- ✅ Responsive photo grid (2-8 columns adjustable)
- ✅ Image height adjustment
- ✅ Hover effects and image options menu
- ✅ Customer-friendly album viewing interface
- ✅ Collapsible cover photo section

### Booking & Calendar
- ✅ Photography event scheduling
- ✅ Calendar view (month, week, day)
- ✅ Event details management
- ✅ Client and location tracking
- ✅ Time slot scheduling

### Profile & Settings
- ✅ User profile editing
- ✅ Profile picture upload with cropping
- ✅ Bio and about section
- ✅ Password management
- ✅ Studio association
- ✅ Email and phone management

### Image Upload & Cropping
- ✅ Drag-and-drop file upload
- ✅ Image preview and positioning
- ✅ Zoom functionality
- ✅ Bounded panning (no overflow)
- ✅ Custom image cropping and generation

## 🛠 Technology Stack

### Frontend
- **React 18.2.0** - UI library
- **React Router 6.15.0** - Client-side routing
- **Bootstrap 5.2.1** - UI framework and grid system
- **FontAwesome 6.2.0** - Icon library

### State Management & Context
- **React Context API** - Global state management
- **React Hooks** - Local component state and side effects

### Additional Libraries
- **FullCalendar 6.1.19** - Calendar widget
- **JWT Decode 4.0.0** - JWT token parsing
- **JSZip 3.10.1** - ZIP file creation for bulk downloads
- **File Saver 2.0.5** - File download functionality
- **Crypto JS 4.1.1** - Password hashing

### Build & Development
- **React Scripts 5.0.1** - Create React App build tools
- **npm** - Package manager

### Backend Integration
- **Django** - RESTful API backend at `http://127.0.0.1:8000`
- **CORS** - Cross-origin resource sharing for API calls

## 📁 Project Structure
