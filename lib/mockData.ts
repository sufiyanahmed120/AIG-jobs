import { Job, Company, User, JobSeeker, Employer, Application, DashboardStats } from '@/types';

// Mock Categories
export const categories = [
  'Engineering',
  'Finance & Accounting',
  'Sales & Marketing',
  'Human Resources',
  'IT & Software',
  'Healthcare',
  'Education',
  'Hospitality',
  'Construction',
  'Retail',
  'Manufacturing',
  'Consulting',
];

// Mock Countries and Cities
export const locations = {
  'UAE': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'],
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Dammam', 'Mecca'],
  'Qatar': ['Doha', 'Al Rayyan', 'Al Wakrah'],
  'Kuwait': ['Kuwait City', 'Al Ahmadi', 'Hawalli'],
  'Oman': ['Muscat', 'Salalah', 'Sohar'],
  'Bahrain': ['Manama', 'Riffa', 'Muharraq'],
  'Pakistan': ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi'],
  'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad'],
};

// Mock Companies
export const mockCompanies: Company[] = [
  {
    id: 'comp-1',
    name: 'Chalhoub Group',
    slug: 'chalhoub-group',
    logo: '/logos/chalhoub.png',
    description: 'Leading luxury retail group in the Middle East',
    website: 'https://chalhoub-group.com',
    industry: 'Retail',
    size: '5000+',
    location: { country: 'UAE', city: 'Dubai' },
    verified: true,
    jobsPosted: 12,
    createdAt: '2020-01-15',
  },
  {
    id: 'comp-2',
    name: 'Alshaya Group',
    slug: 'alshaya-group',
    logo: '/logos/alshaya.png',
    description: 'International retail franchise operator',
    website: 'https://alshaya.com',
    industry: 'Retail',
    size: '10000+',
    location: { country: 'Kuwait', city: 'Kuwait City' },
    verified: true,
    jobsPosted: 8,
    createdAt: '2019-05-20',
  },
  {
    id: 'comp-3',
    name: 'Accor Hotels',
    slug: 'accor-hotels',
    logo: '/logos/accor.png',
    description: 'World-leading hospitality group',
    website: 'https://accor.com',
    industry: 'Hospitality',
    size: '5000+',
    location: { country: 'UAE', city: 'Dubai' },
    verified: true,
    jobsPosted: 15,
    createdAt: '2018-03-10',
  },
  {
    id: 'comp-4',
    name: 'Deloitte',
    slug: 'deloitte',
    logo: '/logos/deloitte.png',
    description: 'Global professional services network',
    website: 'https://deloitte.com',
    industry: 'Consulting',
    size: '10000+',
    location: { country: 'UAE', city: 'Dubai' },
    verified: true,
    jobsPosted: 20,
    createdAt: '2017-08-12',
  },
  {
    id: 'comp-5',
    name: 'Alpha Projects & Logistics',
    slug: 'alpha-projects-logistics',
    logo: '/logos/alpha.png',
    description: 'Leading logistics and project management company',
    website: 'https://alpha.com',
    industry: 'Logistics',
    size: '1000-5000',
    location: { country: 'Saudi Arabia', city: 'Riyadh' },
    verified: true,
    jobsPosted: 5,
    createdAt: '2021-02-28',
  },
  {
    id: 'comp-6',
    name: 'Alfanar',
    slug: 'alfanar',
    logo: '/logos/alfanar.png',
    description: 'Engineering and construction services',
    website: 'https://alfanar.com',
    industry: 'Construction',
    size: '5000+',
    location: { country: 'Saudi Arabia', city: 'Riyadh' },
    verified: true,
    jobsPosted: 10,
    createdAt: '2019-11-05',
  },
];

// Mock Jobs
export const mockJobs: Job[] = [
  {
    id: 'job-1',
    slug: 'senior-software-engineer-dubai',
    title: 'Senior Software Engineer',
    companyId: 'comp-1',
    companyName: 'Chalhoub Group',
    companyLogo: '/logos/chalhoub.png',
    location: { country: 'UAE', city: 'Dubai' },
    category: 'IT & Software',
    type: 'full-time',
    experience: 'senior',
    salary: { min: 15000, max: 25000, currency: 'AED' },
    description: 'We are looking for an experienced Senior Software Engineer to join our technology team. You will be responsible for designing and developing scalable web applications, leading technical initiatives, and mentoring junior developers.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '5+ years of experience in software development',
      'Strong proficiency in React, Node.js, and TypeScript',
      'Experience with cloud platforms (AWS, Azure)',
      'Excellent problem-solving and communication skills',
    ],
    benefits: [
      'Competitive salary package',
      'Health insurance',
      'Annual flight tickets',
      'Professional development opportunities',
      'Flexible working hours',
    ],
    status: 'approved',
    postedAt: '2024-01-15',
    expiresAt: '2024-03-15',
    applicants: [],
    views: 234,
  },
  {
    id: 'job-2',
    slug: 'finance-manager-riyadh',
    title: 'Finance Manager',
    companyId: 'comp-2',
    companyName: 'Alshaya Group',
    companyLogo: '/logos/alshaya.png',
    location: { country: 'Saudi Arabia', city: 'Riyadh' },
    category: 'Finance & Accounting',
    type: 'full-time',
    experience: 'senior',
    salary: { min: 18000, max: 28000, currency: 'SAR' },
    description: 'We are seeking a Finance Manager to oversee financial operations, budgeting, and financial reporting. The ideal candidate will have strong analytical skills and experience in retail finance.',
    requirements: [
      'MBA or CPA qualification',
      '8+ years of experience in finance',
      'Experience in retail or FMCG industry',
      'Strong Excel and financial modeling skills',
      'Excellent leadership abilities',
    ],
    benefits: [
      'Attractive salary package',
      'Medical insurance',
      'Performance bonus',
      'Career growth opportunities',
    ],
    status: 'approved',
    postedAt: '2024-01-20',
    expiresAt: '2024-03-20',
    applicants: [],
    views: 189,
  },
  {
    id: 'job-3',
    slug: 'marketing-specialist-doha',
    title: 'Digital Marketing Specialist',
    companyId: 'comp-3',
    companyName: 'Accor Hotels',
    companyLogo: '/logos/accor.png',
    location: { country: 'Qatar', city: 'Doha' },
    category: 'Sales & Marketing',
    type: 'full-time',
    experience: 'mid',
    salary: { min: 12000, max: 18000, currency: 'QAR' },
    description: 'Join our marketing team to drive digital marketing campaigns, manage social media presence, and enhance brand visibility across digital channels.',
    requirements: [
      'Bachelor\'s degree in Marketing or related field',
      '3+ years of digital marketing experience',
      'Proficiency in Google Analytics, SEO, and social media',
      'Creative thinking and content creation skills',
    ],
    benefits: [
      'Competitive package',
      'Hotel discounts',
      'Training programs',
      'Work-life balance',
    ],
    status: 'approved',
    postedAt: '2024-01-18',
    expiresAt: '2024-03-18',
    applicants: [],
    views: 156,
  },
  {
    id: 'job-4',
    slug: 'hr-manager-dubai',
    title: 'HR Manager',
    companyId: 'comp-4',
    companyName: 'Deloitte',
    companyLogo: '/logos/deloitte.png',
    location: { country: 'UAE', city: 'Dubai' },
    category: 'Human Resources',
    type: 'full-time',
    experience: 'senior',
    salary: { min: 20000, max: 30000, currency: 'AED' },
    description: 'We are looking for an experienced HR Manager to lead our human resources department, manage talent acquisition, and develop HR strategies.',
    requirements: [
      'Master\'s degree in HR or related field',
      '10+ years of HR experience',
      'Strong knowledge of UAE labor laws',
      'Excellent interpersonal and leadership skills',
    ],
    benefits: [
      'Premium salary package',
      'Comprehensive benefits',
      'Global career opportunities',
      'Professional certifications support',
    ],
    status: 'approved',
    postedAt: '2024-01-22',
    expiresAt: '2024-03-22',
    applicants: [],
    views: 278,
  },
  {
    id: 'job-5',
    slug: 'civil-engineer-riyadh',
    title: 'Senior Civil Engineer',
    companyId: 'comp-6',
    companyName: 'Alfanar',
    companyLogo: '/logos/alfanar.png',
    location: { country: 'Saudi Arabia', city: 'Riyadh' },
    category: 'Engineering',
    type: 'full-time',
    experience: 'senior',
    salary: { min: 15000, max: 22000, currency: 'SAR' },
    description: 'Join our engineering team to work on major infrastructure projects. You will be responsible for project design, supervision, and quality control.',
    requirements: [
      'Bachelor\'s degree in Civil Engineering',
      '7+ years of experience',
      'Professional engineering license',
      'Experience with large-scale projects',
    ],
    benefits: [
      'Competitive salary',
      'Project bonuses',
      'Health insurance',
      'Professional development',
    ],
    status: 'approved',
    postedAt: '2024-01-25',
    expiresAt: '2024-03-25',
    applicants: [],
    views: 145,
  },
  {
    id: 'job-6',
    slug: 'accountant-karachi',
    title: 'Senior Accountant',
    companyId: 'comp-5',
    companyName: 'Alpha Projects & Logistics',
    companyLogo: '/logos/alpha.png',
    location: { country: 'Pakistan', city: 'Karachi' },
    category: 'Finance & Accounting',
    type: 'full-time',
    experience: 'mid',
    salary: { min: 80000, max: 120000, currency: 'PKR' },
    description: 'We are seeking a Senior Accountant to manage financial records, prepare reports, and ensure compliance with accounting standards.',
    requirements: [
      'Bachelor\'s degree in Accounting',
      '5+ years of accounting experience',
      'CPA or CA qualification preferred',
      'Proficiency in accounting software',
    ],
    benefits: [
      'Market competitive salary',
      'Health insurance',
      'Annual bonuses',
    ],
    status: 'approved',
    postedAt: '2024-01-28',
    expiresAt: '2024-03-28',
    applicants: [],
    views: 98,
  },
];

// Mock Users
export const mockUsers: (JobSeeker | Employer | User)[] = [
  {
    id: 'user-1',
    email: 'seeker@demo.com',
    name: 'Ahmed Hassan',
    role: 'job_seeker',
    phone: '+971501234567',
    location: 'Dubai, UAE',
    experience: '5 years',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    savedJobs: ['job-1', 'job-4'],
    applications: ['job-1'],
    createdAt: '2023-06-15',
  },
  {
    id: 'user-2',
    email: 'employer@demo.com',
    name: 'Sarah Al-Mansoori',
    role: 'employer',
    companyId: 'comp-1',
    companyName: 'Chalhoub Group',
    phone: '+971501111111',
    verified: true,
    createdAt: '2023-01-10',
  },
  {
    id: 'user-3',
    email: 'admin@demo.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2023-01-01',
  },
];

// Mock Applications
export const mockApplications: Application[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    jobTitle: 'Senior Software Engineer',
    companyId: 'comp-1',
    companyName: 'Chalhoub Group',
    userId: 'user-1',
    userName: 'Ahmed Hassan',
    userEmail: 'seeker@demo.com',
    cvUrl: '/cvs/ahmed-hassan.pdf',
    status: 'pending',
    appliedAt: '2024-01-20',
  },
];

// Dashboard Stats
export const mockStats: DashboardStats = {
  totalJobs: mockJobs.length,
  pendingJobs: mockJobs.filter(j => j.status === 'pending').length,
  totalEmployers: mockUsers.filter(u => u.role === 'employer').length,
  verifiedEmployers: mockUsers.filter(u => u.role === 'employer' && (u as Employer).verified).length,
  totalApplications: mockApplications.length,
  totalJobSeekers: mockUsers.filter(u => u.role === 'job_seeker').length,
};

// Helper function to get jobs by filters
export function filterJobs(jobs: Job[], filters: {
  keyword?: string;
  country?: string;
  city?: string;
  category?: string;
  experience?: string;
  jobType?: string;
  salaryMin?: number;
  salaryMax?: number;
}): Job[] {
  return jobs.filter(job => {
    // Keyword search (title, description, company)
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      const matchesKeyword = 
        job.title.toLowerCase().includes(keyword) ||
        job.description.toLowerCase().includes(keyword) ||
        job.companyName.toLowerCase().includes(keyword) ||
        job.requirements.some(r => r.toLowerCase().includes(keyword));
      if (!matchesKeyword) return false;
    }

    // Location filters
    if (filters.country && job.location.country !== filters.country) return false;
    if (filters.city && job.location.city !== filters.city) return false;

    // Category filter
    if (filters.category && job.category !== filters.category) return false;

    // Experience filter
    if (filters.experience && job.experience !== filters.experience) return false;

    // Job type filter
    if (filters.jobType && job.type !== filters.jobType) return false;

    // Salary filters
    if (filters.salaryMin && job.salary.max < filters.salaryMin) return false;
    if (filters.salaryMax && job.salary.min > filters.salaryMax) return false;

    return true;
  });
}
