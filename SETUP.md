# AGI Job Portal - Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Demo Accounts

You can use these pre-configured accounts for testing:

### Job Seeker
- **Email:** `seeker@demo.com`
- **Password:** Any password (demo mode)

### Employer
- **Email:** `employer@demo.com`
- **Password:** Any password (demo mode)

### Admin
- **Email:** `admin@demo.com`
- **Password:** Any password (demo mode)

## Features Overview

### For Job Seekers
- ✅ Browse and search jobs
- ✅ Apply to jobs (one-click)
- ✅ Save favorite jobs
- ✅ View application status
- ✅ Upload CV (UI only, demo)

### For Employers
- ✅ Post new job listings
- ✅ View posted jobs
- ✅ See applicants for each job
- ✅ View CVs (counter-based, demo)
- ✅ Company profile management

### For Admins
- ✅ Dashboard with statistics
- ✅ Approve/reject job postings
- ✅ Verify/unverify employers
- ✅ Manage all jobs and employers

## Project Structure

```
/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── login/             # Authentication
│   ├── register/
│   ├── jobs/              # Job listings & details
│   ├── profile/           # Job seeker profile
│   ├── my-applications/   # Application tracking
│   ├── employer/          # Employer features
│   └── admin/              # Admin panel
├── components/             # Reusable React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── JobCard.tsx
│   ├── JobFilters.tsx
│   └── Button.tsx
├── context/               # React Context providers
│   ├── AuthContext.tsx    # Authentication state
│   └── DataContext.tsx    # Mock data management
├── lib/                   # Utilities
│   └── mockData.ts        # Mock data and helpers
└── types/                 # TypeScript definitions
    └── index.ts
```

## Key Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Context** - State management
- **Lucide React** - Icons

## Important Notes

⚠️ **This is a DEMO MVP only:**
- No real backend/database
- No actual file uploads
- Simulated authentication
- Mock data stored in memory/localStorage
- Not production-ready

## Customization

### Adding More Mock Data
Edit `lib/mockData.ts` to add more jobs, companies, or users.

### Styling
Modify `tailwind.config.ts` to customize colors and theme.

### Features
All features are client-side only. To add real functionality, you'll need:
- Backend API
- Database
- File storage
- Real authentication system

## Troubleshooting

**Port already in use?**
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- -p 3001
```

**Dependencies not installing?**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps for Production

1. Set up backend API (Node.js, Python, etc.)
2. Implement real database (PostgreSQL, MongoDB, etc.)
3. Add real authentication (JWT, OAuth)
4. Set up file storage (AWS S3, Cloudinary)
5. Add email notifications
6. Implement payment processing (for premium features)
7. Add analytics and monitoring
8. Set up CI/CD pipeline
9. Add comprehensive testing
10. Deploy to production (Vercel, AWS, etc.)
