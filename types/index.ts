// User and Authentication Types
export type UserRole = 'job_seeker' | 'employer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

// Job Seeker Profile Types - Gulf Recruitment Optimized
export type VisaStatus = 'no_visa' | 'visit_visa' | 'employment_visa' | 'family_visa' | 'residence_visa' | 'sponsor_visa';
export type NoticePeriod = 'immediate' | '1_week' | '2_weeks' | '1_month' | '2_months' | '3_months' | 'more_than_3_months';
export type ProfileVisibility = 'public' | 'private' | 'employers_only';
export type CVVisibility = 'public' | 'employers_only' | 'private';

// Gulf Countries & Nationalities
export const GULF_COUNTRIES = ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Oman', 'Bahrain'] as const;
export const COMMON_NATIONALITIES = [
  'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Oman', 'Bahrain',
  'India', 'Pakistan', 'Bangladesh', 'Philippines', 'Egypt', 'Jordan',
  'Lebanon', 'Syria', 'Yemen', 'Sudan', 'Morocco', 'Tunisia', 'Other'
] as const;

// Job Seeker Profile Structure
export interface JobSeekerProfile {
  // Personal Details (Mandatory: name, email, phone, nationality, currentLocation)
  personalDetails: {
    name: string; // Mandatory
    email: string; // Mandatory
    phone: string; // Mandatory - Gulf format (+971 XX XXX XXXX)
    phoneCountryCode: string; // Mandatory
    nationality: string; // Mandatory - Searchable
    currentLocation: {
      country: string; // Mandatory - Searchable
      city: string; // Mandatory - Searchable
    };
    dateOfBirth?: string; // Optional
    gender?: 'male' | 'female' | 'prefer_not_to_say'; // Optional
  };

  // Job Details (Mandatory: currentRole, experienceYears, skills)
  jobDetails: {
    currentRole?: string; // Optional but recommended
    currentCompany?: string; // Optional
    experienceYears: number; // Mandatory - Searchable
    skills: string[]; // Mandatory - Searchable (min 3)
    education?: {
      degree: string;
      field: string;
      institution: string;
      graduationYear?: number;
    }[]; // Optional
  };

  // Visa & Availability (Mandatory: visaStatus, noticePeriod)
  visaAndAvailability: {
    visaStatus: VisaStatus; // Mandatory - Searchable
    visaValidityDate?: string; // Optional - Required if visaStatus !== 'no_visa'
    noticePeriod: NoticePeriod; // Mandatory - Searchable
    availableFrom?: string; // Optional
    currentlyEmployed: boolean; // Mandatory
  };

  // Job Preferences (Optional but recommended)
  jobPreferences: {
    preferredRoles?: string[]; // Optional - Searchable
    preferredCountries?: string[]; // Optional - Searchable
    preferredCities?: string[]; // Optional - Searchable
    preferredJobTypes?: JobType[]; // Optional
    salaryExpectation?: {
      min: number;
      max: number;
      currency: string; // AED, SAR, QAR, KWD, OMR, BHD, USD
    }; // Optional
    willingToRelocate: boolean; // Optional
  };

  // CV & Documents
  documents: {
    cvUrl?: string; // Optional
    cvFileName?: string; // Optional
    cvUploadedAt?: string; // Optional
    cvVisibility: CVVisibility; // Default: 'employers_only'
    otherDocuments?: {
      name: string;
      url: string;
      type: string;
    }[]; // Optional
  };

  // Privacy & Visibility
  privacy: {
    profileVisibility: ProfileVisibility; // Default: 'employers_only'
    showPhone: boolean; // Default: false
    showEmail: boolean; // Default: false
    showCurrentCompany: boolean; // Default: true
  };

  // Metadata
  profileCompleteness: number; // 0-100
  lastUpdated: string;
  profileCreatedAt: string;
}

export interface JobSeeker extends User {
  role: 'job_seeker';
  phone?: string;
  location?: string;
  experience?: string;
  skills?: string[];
  cvUrl?: string;
  savedJobs?: string[];
  applications?: string[];
  profile?: JobSeekerProfile; // Comprehensive profile
}

export interface Employer extends User {
  role: 'employer';
  companyId: string;
  companyName: string;
  phone?: string;
  verified: boolean;
}

export interface Admin extends User {
  role: 'admin';
}

// Job Types
export type JobStatus = 'pending' | 'approved' | 'rejected' | 'closed';
export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'executive';

export interface Job {
  id: string;
  slug: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  location: {
    country: string;
    city: string;
  };
  category: string;
  type: JobType;
  experience: ExperienceLevel;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  benefits: string[];
  status: JobStatus;
  postedAt: string;
  expiresAt?: string;
  applicants?: string[];
  views: number;
}

// Company Types
export interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description: string;
  website?: string;
  industry: string;
  size: string;
  location: {
    country: string;
    city: string;
  };
  verified: boolean;
  jobsPosted: number;
  createdAt: string;
}

// Application Types
export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyId: string;
  companyName: string;
  userId: string;
  userName: string;
  userEmail: string;
  cvUrl?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  appliedAt: string;
  viewedAt?: string;
}

// Filter Types
export interface JobFilters {
  keyword?: string;
  country?: string;
  city?: string;
  category?: string;
  experience?: ExperienceLevel;
  jobType?: JobType;
  salaryMin?: number;
  salaryMax?: number;
}

// Stats Types
export interface DashboardStats {
  totalJobs: number;
  pendingJobs: number;
  totalEmployers: number;
  verifiedEmployers: number;
  totalApplications: number;
  totalJobSeekers: number;
}
