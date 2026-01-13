# Tech Vimal International Inspection & Certification Website - PRD

## Project Overview
**Project Name:** Tech Vimal International Inspection & Certification Website  
**Date Created:** January 12, 2025  
**Status:** Phase 1 Complete (Frontend with Mock Data)

## Original Problem Statement
Create a standard professional website for Tech Vimal International Inspection & Certification Private Limited showcasing their services (Inspection, Audit, Certification, Hygiene Rating) with USPs including:
- Auto certification
- Certification with measurable business impact
- Live digital compliance dashboard
- Hybrid & remote audits (low downtime)
- Subscription-based compliance model
- Public QR verification – zero fake certificates

Target audience: MSMEs, exporters, manufacturers across India

## User Personas
1. **MSME Business Owners**: Need compliance certifications for exports/tenders
2. **Export Companies**: Require ISO and international certifications
3. **Food & Hospitality**: Looking for hygiene ratings and food safety certifications
4. **Manufacturing Units**: Need quality management system certifications
5. **Certificate Verifiers**: Customers/partners wanting to verify certificate authenticity

## Core Requirements (Static)
1. Professional corporate website design with navy blue, silver grey, white color scheme
2. Comprehensive service showcase (Inspection, Audit, Certification, Hygiene Rating)
3. Certificate verification system with QR code
4. Industry-specific solutions display
5. Contact form and company information
6. FAQ section
7. Responsive design for all devices
8. Smooth navigation with anchor links

## Architecture & Tech Stack
- **Frontend:** React 19, Tailwind CSS, Shadcn UI components
- **Backend:** FastAPI (Python) - Not yet implemented
- **Database:** MongoDB - Not yet implemented
- **Styling:** Modern glassmorphism effects, hover animations, smooth scrolling

## What's Been Implemented (January 12, 2025)

### Phase 1: Frontend with Mock Data ✅
1. **Home Page** (`/app/frontend/src/pages/Home.jsx`)
   - Hero section with tagline and CTA buttons
   - USPs showcase (5 cards with icons)
   - About section with company stats
   - Services section (4 service cards with images)
   - Industries section (8 industry cards)
   - Certificate verification UI with mock data
   - FAQ section with accordion
   - Contact form UI
   - Footer with navigation links

2. **Mock Data** (`/app/frontend/src/utils/mockData.js`)
   - USPs data (5 items)
   - Services data (4 services)
   - Industries data (8 industries)
   - Certificate verification data (3 sample certificates)
   - FAQ data (6 questions)

3. **Styling** (`/app/frontend/src/App.css`)
   - Custom animations (fadeInUp, float)
   - Smooth scrolling
   - Button hover effects
   - Transition effects

4. **Features Working (Frontend Only)**
   - Navigation with smooth scroll
   - Certificate verification with mock lookup
   - Contact form (shows alert on submit)
   - Responsive design
   - Interactive hover effects on cards/buttons

## Mock Data Currently Used
- **Services:** Static display only
- **Certificate Verification:** 3 hardcoded certificates (CERT-2024-001, CERT-2024-002, CERT-2024-003)
- **Contact Form:** Shows alert, no actual email sending
- **All content:** Static, no backend integration

## Prioritized Backlog

### P0 Features (Must Have - Phase 2)
1. **Backend Development:**
   - Certificate management API endpoints
   - Certificate verification API
   - Contact form email integration
   - Database schema for certificates

2. **Database Models:**
   - Certificates collection (id, company, standard, issue_date, expiry_date, qr_code)
   - Contact inquiries collection
   - Services/Industries (if dynamic content needed)

3. **API Contracts:**
   - `POST /api/contact` - Submit contact form
   - `GET /api/certificates/verify/:id` - Verify certificate
   - `GET /api/certificates/:qr_code` - QR code lookup

### P1 Features (Should Have - Future)
1. Admin dashboard for certificate management
2. Client login portal for compliance dashboard
3. Email notifications for contact form
4. Certificate PDF generation
5. QR code generation for certificates
6. Subscription payment integration
7. Service booking/scheduling system

### P2 Features (Nice to Have)
1. Blog/Resources section
2. Case studies showcase
3. Testimonials with video
4. Multi-language support
5. Live chat integration
6. Analytics dashboard
7. SEO optimization

## Next Tasks (Priority Order)
1. ✅ Frontend with mock data (COMPLETED)
2. 📋 User confirmation to proceed with backend
3. Build backend API endpoints for certificate verification
4. Integrate contact form with email service
5. Create certificate management system
6. Connect frontend to backend APIs
7. Testing and bug fixes
8. Deploy to production

## Design Assets Used
- Hero image: Quality inspection professional
- Service images: Professional inspection/audit scenarios
- Industry images: Manufacturing facilities

## Contact Information (Placeholder)
- Email: info@techvimal.com
- Phone: +91 1234 567 890
- Address: Mumbai, Maharashtra, India

## Notes
- All current functionality is frontend-only with mock data
- Certificate verification works with 3 hardcoded IDs
- Contact form shows success alert but doesn't send emails
- Ready for backend integration in Phase 2
