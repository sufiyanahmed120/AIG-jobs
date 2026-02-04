import { JobSeekerProfile, VisaStatus, NoticePeriod, ProfileVisibility, CVVisibility } from '@/types';

// Gulf Countries
export const GULF_COUNTRIES = [
  { value: 'UAE', label: 'United Arab Emirates' },
  { value: 'Saudi Arabia', label: 'Saudi Arabia' },
  { value: 'Qatar', label: 'Qatar' },
  { value: 'Kuwait', label: 'Kuwait' },
  { value: 'Oman', label: 'Oman' },
  { value: 'Bahrain', label: 'Bahrain' },
];

// Common Nationalities in Gulf
export const NATIONALITIES = [
  { value: 'UAE', label: 'UAE' },
  { value: 'Saudi Arabia', label: 'Saudi Arabia' },
  { value: 'Qatar', label: 'Qatar' },
  { value: 'Kuwait', label: 'Kuwait' },
  { value: 'Oman', label: 'Oman' },
  { value: 'Bahrain', label: 'Bahrain' },
  { value: 'India', label: 'India' },
  { value: 'Pakistan', label: 'Pakistan' },
  { value: 'Bangladesh', label: 'Bangladesh' },
  { value: 'Philippines', label: 'Philippines' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'Jordan', label: 'Jordan' },
  { value: 'Lebanon', label: 'Lebanon' },
  { value: 'Syria', label: 'Syria' },
  { value: 'Yemen', label: 'Yemen' },
  { value: 'Sudan', label: 'Sudan' },
  { value: 'Morocco', label: 'Morocco' },
  { value: 'Tunisia', label: 'Tunisia' },
  { value: 'Other', label: 'Other' },
];

// Visa Status Options
export const VISA_STATUS_OPTIONS: { value: VisaStatus; label: string }[] = [
  { value: 'no_visa', label: 'No Visa' },
  { value: 'visit_visa', label: 'Visit Visa' },
  { value: 'employment_visa', label: 'Employment Visa' },
  { value: 'family_visa', label: 'Family Visa' },
  { value: 'residence_visa', label: 'Residence Visa' },
  { value: 'sponsor_visa', label: 'Sponsor Visa' },
];

// Notice Period Options
export const NOTICE_PERIOD_OPTIONS: { value: NoticePeriod; label: string }[] = [
  { value: 'immediate', label: 'Immediate' },
  { value: '1_week', label: '1 Week' },
  { value: '2_weeks', label: '2 Weeks' },
  { value: '1_month', label: '1 Month' },
  { value: '2_months', label: '2 Months' },
  { value: '3_months', label: '3 Months' },
  { value: 'more_than_3_months', label: 'More than 3 Months' },
];

// Profile Visibility Options
export const PROFILE_VISIBILITY_OPTIONS: { value: ProfileVisibility; label: string; description: string }[] = [
  { value: 'public', label: 'Public', description: 'Visible to all employers and job seekers' },
  { value: 'employers_only', label: 'Employers Only', description: 'Visible only to verified employers' },
  { value: 'private', label: 'Private', description: 'Not visible to anyone' },
];

// CV Visibility Options
export const CV_VISIBILITY_OPTIONS: { value: CVVisibility; label: string; description: string }[] = [
  { value: 'employers_only', label: 'Employers Only', description: 'Only employers can view your CV' },
  { value: 'public', label: 'Public', description: 'Visible to all employers' },
  { value: 'private', label: 'Private', description: 'Not visible to anyone' },
];

// Common Skills (Gulf Market)
export const COMMON_SKILLS = [
  'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js',
  'SQL', 'MongoDB', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'DevOps',
  'Project Management', 'Agile', 'Scrum', 'Sales', 'Marketing', 'Digital Marketing',
  'Accounting', 'Finance', 'HR', 'Recruitment', 'Customer Service',
  'Arabic', 'English', 'French', 'Hindi', 'Urdu',
  'AutoCAD', 'SAP', 'Oracle', 'Salesforce', 'Microsoft Office',
];

// Phone Country Codes (Gulf)
export const PHONE_COUNTRY_CODES = [
  { value: '+971', label: '+971 (UAE)' },
  { value: '+966', label: '+966 (Saudi Arabia)' },
  { value: '+974', label: '+974 (Qatar)' },
  { value: '+965', label: '+965 (Kuwait)' },
  { value: '+968', label: '+968 (Oman)' },
  { value: '+973', label: '+973 (Bahrain)' },
  { value: '+91', label: '+91 (India)' },
  { value: '+92', label: '+92 (Pakistan)' },
  { value: '+880', label: '+880 (Bangladesh)' },
  { value: '+63', label: '+63 (Philippines)' },
  { value: '+20', label: '+20 (Egypt)' },
  { value: '+1', label: '+1 (US/Canada)' },
];

// Currency Options
export const CURRENCIES = [
  { value: 'AED', label: 'AED (UAE Dirham)' },
  { value: 'SAR', label: 'SAR (Saudi Riyal)' },
  { value: 'QAR', label: 'QAR (Qatari Riyal)' },
  { value: 'KWD', label: 'KWD (Kuwaiti Dinar)' },
  { value: 'OMR', label: 'OMR (Omani Rial)' },
  { value: 'BHD', label: 'BHD (Bahraini Dinar)' },
  { value: 'USD', label: 'USD (US Dollar)' },
];

// Calculate Profile Completeness
export function calculateProfileCompleteness(profile: Partial<JobSeekerProfile>): number {
  let completed = 0;
  let total = 0;

  // Personal Details (40 points)
  total += 40;
  if (profile.personalDetails?.name) completed += 5;
  if (profile.personalDetails?.email) completed += 5;
  if (profile.personalDetails?.phone && profile.personalDetails?.phoneCountryCode) completed += 5;
  if (profile.personalDetails?.nationality) completed += 5;
  if (profile.personalDetails?.currentLocation?.country) completed += 5;
  if (profile.personalDetails?.currentLocation?.city) completed += 5;
  if (profile.personalDetails?.dateOfBirth) completed += 5;
  if (profile.personalDetails?.gender) completed += 5;

  // Job Details (30 points)
  total += 30;
  if (profile.jobDetails?.currentRole) completed += 5;
  if (profile.jobDetails?.currentCompany) completed += 5;
  if (profile.jobDetails?.experienceYears !== undefined && profile.jobDetails.experienceYears >= 0) completed += 10;
  if (profile.jobDetails?.skills && profile.jobDetails.skills.length >= 3) completed += 10;

  // Visa & Availability (20 points)
  total += 20;
  if (profile.visaAndAvailability?.visaStatus) completed += 5;
  if (profile.visaAndAvailability?.visaStatus !== 'no_visa' && profile.visaAndAvailability?.visaValidityDate) completed += 5;
  if (profile.visaAndAvailability?.noticePeriod) completed += 5;
  if (profile.visaAndAvailability?.currentlyEmployed !== undefined) completed += 5;

  // Job Preferences (5 points)
  total += 5;
  if (profile.jobPreferences?.preferredRoles && profile.jobPreferences.preferredRoles.length > 0) completed += 2;
  if (profile.jobPreferences?.preferredCountries && profile.jobPreferences.preferredCountries.length > 0) completed += 2;
  if (profile.jobPreferences?.salaryExpectation) completed += 1;

  // CV Upload (5 points)
  total += 5;
  if (profile.documents?.cvUrl) completed += 5;

  return Math.round((completed / total) * 100);
}

// Validate Profile Step
export function validateProfileStep(step: number, profile: Partial<JobSeekerProfile>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  switch (step) {
    case 1: // Personal Details
      if (!profile.personalDetails?.name?.trim()) errors.push('Name is required');
      if (!profile.personalDetails?.email?.trim()) errors.push('Email is required');
      if (!profile.personalDetails?.phone?.trim()) errors.push('Phone number is required');
      if (!profile.personalDetails?.phoneCountryCode) errors.push('Phone country code is required');
      if (!profile.personalDetails?.nationality) errors.push('Nationality is required');
      if (!profile.personalDetails?.currentLocation?.country) errors.push('Current country is required');
      if (!profile.personalDetails?.currentLocation?.city) errors.push('Current city is required');
      break;

    case 2: // Job Details
      if (profile.jobDetails?.experienceYears === undefined || profile.jobDetails.experienceYears < 0) {
        errors.push('Years of experience is required');
      }
      if (!profile.jobDetails?.skills || profile.jobDetails.skills.length < 3) {
        errors.push('At least 3 skills are required');
      }
      break;

    case 3: // Visa & Availability
      if (!profile.visaAndAvailability?.visaStatus) errors.push('Visa status is required');
      if (profile.visaAndAvailability?.visaStatus !== 'no_visa' && !profile.visaAndAvailability?.visaValidityDate) {
        errors.push('Visa validity date is required');
      }
      if (!profile.visaAndAvailability?.noticePeriod) errors.push('Notice period is required');
      if (profile.visaAndAvailability?.currentlyEmployed === undefined) {
        errors.push('Please specify if you are currently employed');
      }
      break;

    case 4: // CV Upload (optional but recommended)
      // CV is optional, no validation needed
      break;
  }

  return { valid: errors.length === 0, errors };
}

// Get default profile
export function getDefaultProfile(): Partial<JobSeekerProfile> {
  return {
    personalDetails: {
      name: '',
      email: '',
      phone: '',
      phoneCountryCode: '+971',
      nationality: '',
      currentLocation: {
        country: '',
        city: '',
      },
    },
    jobDetails: {
      experienceYears: 0,
      skills: [],
    },
    visaAndAvailability: {
      visaStatus: 'no_visa',
      noticePeriod: '1_month',
      currentlyEmployed: false,
    },
    jobPreferences: {
      preferredCountries: [],
      preferredRoles: [],
      preferredJobTypes: [],
      willingToRelocate: false,
    },
    documents: {
      cvVisibility: 'employers_only',
    },
    privacy: {
      profileVisibility: 'employers_only',
      showPhone: false,
      showEmail: false,
      showCurrentCompany: true,
    },
    profileCompleteness: 0,
    profileCreatedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  };
}
