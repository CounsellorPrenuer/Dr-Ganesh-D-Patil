# SKILL+ Career Counselor Portfolio

## Overview

This is a professional portfolio website for Dr. Ganesh D. Patil, a career counselor, school management consultant, and educational leader. The site showcases his services including career guidance, workshops, admission guidance, counseling, and consulting & training. Built as a modern single-page application with a clean, professional design following LinkedIn and Notion-inspired aesthetics, the website serves multiple target audiences including students, parents, schools, colleges, corporates, and working professionals.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Framework**: Shadcn/ui component library built on top of Radix UI primitives
- **Styling**: Tailwind CSS with custom design system following blue/yellow brand colors
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: PostgreSQL (via Neon serverless)
- **Email Service**: Nodemailer for contact form submissions
- **Session Management**: Connect-pg-simple for PostgreSQL-backed sessions

### Design System
- **Component Library**: Custom implementation using Radix UI primitives
- **Color Scheme**: Blue primary (#2563eb), yellow accents, neutral grays
- **Typography**: Inter font family with structured weight hierarchy
- **Layout**: Responsive design with max-width containers and consistent spacing
- **Interactions**: Smooth animations and hover effects with scale transforms

### Data Layer
- **Database Schema**: 
  - Users table for potential admin functionality
  - Contact inquiries table for form submissions with timestamps
- **Validation**: Zod schemas for runtime type checking and validation
- **Storage**: Memory storage fallback with PostgreSQL as primary database

### Page Sections
- **Hero**: Profile image, name, titles, and call-to-action buttons
- **About**: Personal background, achievements, and professional experience
- **Services**: Educational leadership, training R&D, student development, integrated learning, school management
- **Testimonials**: Client feedback carousel with rating system
- **Blog**: Latest insights section with article previews
- **Contact**: Contact form with validation and email integration
- **Footer**: Social links, quick navigation, and contact information

## External Dependencies

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle Kit**: Database migrations and schema management

### UI & Styling
- **Radix UI**: Accessible component primitives for complex UI components
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide React**: Icon library for consistent iconography
- **class-variance-authority**: Type-safe variant management for components

### Communication
- **Nodemailer**: Email service for contact form notifications sent to skillpluska@rediffmail.com
- **Ethereal Email**: Development SMTP service for testing

### Development Tools
- **Vite**: Fast build tool with HMR and TypeScript support
- **Replit Integration**: Development environment with cartographer and error overlay plugins
- **ESBuild**: Fast bundler for production builds

### Assets
- **Google Fonts**: Inter font family for typography
- **Local Assets**: Profile images, logo (SKILL+ brand), and other media files stored in attached_assets directory

### Social Media Integration
- **LinkedIn**: https://www.linkedin.com/in/ganesh-d-patil-b5034717
- **Facebook**: Professional page integration
- **Instagram & YouTube**: Planned social media presence