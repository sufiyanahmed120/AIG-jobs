'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { MapPin, Briefcase, DollarSign, Clock, Calendar, Building2, CheckCircle } from 'lucide-react';
import Button from '@/components/Button';
import { formatDate } from '@/lib/dateUtils';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { getJobBySlug, addApplication, updateJob } = useData();
  const slug = params.slug as string;

  // Centralized auth guard: if not authenticated, redirect to login with ?redirect back here.
  useAuthGuard();
  
  const job = getJobBySlug(slug);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Initialize applied/saved flags from localStorage when auth or job id changes.
  useEffect(() => {
    if (!job) return;

    // If user is not authenticated or not a job seeker, ensure local UI state is reset
    if (!isAuthenticated || user?.role !== 'job_seeker' || !user?.id) {
      setApplied(false);
      setSaved(false);
      return;
    }

    // Check if user has already applied or saved this job (demo: localStorage, scoped by user)
    const appsKey = `applications_${user.id}`;
    const savedKey = `savedJobs_${user.id}`;

    const applications = JSON.parse(localStorage.getItem(appsKey) || '[]');
    setApplied(applications.includes(job.id));

    const savedJobs = JSON.parse(localStorage.getItem(savedKey) || '[]');
    setSaved(savedJobs.includes(job.id));
  }, [job?.id, isAuthenticated, user?.id, user?.role]);

  // Increment view count exactly once per job view (no dependency on full job object to avoid loops).
  useEffect(() => {
    if (!job) return;
    updateJob(job.id, { views: (job.views || 0) + 1 });
  }, [job?.id, updateJob]);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h2>
          <Link href="/jobs" className="text-red-600 hover:text-red-700">
            Browse all jobs
          </Link>
        </div>
      </div>
    );
  }

  const handleApply = () => {
    if (!isAuthenticated || user?.role !== 'job_seeker') {
      router.push('/login?redirect=/jobs/' + slug);
      return;
    }

    // Create application
    const application = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      companyId: job.companyId,
      companyName: job.companyName,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      status: 'pending' as const,
      appliedAt: new Date().toISOString(),
    };

    addApplication(application);

    // Store in localStorage for demo (scoped by user)
    if (user?.id) {
      const appsKey = `applications_${user.id}`;
      const applications = JSON.parse(localStorage.getItem(appsKey) || '[]');
      applications.push(job.id);
      localStorage.setItem(appsKey, JSON.stringify(applications));
    }
    
    setApplied(true);
    alert('Application submitted successfully!');
  };

  const handleSave = () => {
    if (!isAuthenticated || user?.role !== 'job_seeker') {
      router.push('/login?redirect=/jobs/' + slug);
      return;
    }

    if (!user?.id) return;

    const savedKey = `savedJobs_${user.id}`;
    const savedJobs = JSON.parse(localStorage.getItem(savedKey) || '[]');
    if (saved) {
      const updated = (savedJobs || []).filter((id: string) => id !== job.id);
      localStorage.setItem(savedKey, JSON.stringify(updated));
      setSaved(false);
    } else {
      const updated = Array.from(new Set([...(savedJobs || []), job.id]));
      localStorage.setItem(savedKey, JSON.stringify(updated));
      setSaved(true);
    }
  };

  const formatSalary = (salary: typeof job.salary) => {
    return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-600 hover:text-red-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/jobs" className="text-gray-600 hover:text-red-600">Jobs</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{job.title}</span>
        </nav>

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <div className="flex items-center space-x-4 text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Building2 className="w-5 h-5" />
                    <Link href={`/companies/${job.companyId}`} className="hover:text-red-600">
                      {job.companyName}
                    </Link>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-5 h-5" />
                    <span>{job.location.city}, {job.location.country}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {job.category}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium capitalize">
                    {job.type.replace('-', ' ')}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium capitalize">
                    {job.experience}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-6 h-6 text-red-600" />
              <div>
                <div className="text-sm text-gray-600">Salary</div>
                <div className="font-semibold text-gray-900">{formatSalary(job.salary)}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-red-600" />
              <div>
                <div className="text-sm text-gray-600">Job Type</div>
                <div className="font-semibold text-gray-900 capitalize">{job.type.replace('-', ' ')}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Briefcase className="w-6 h-6 text-red-600" />
              <div>
                <div className="text-sm text-gray-600">Experience</div>
                <div className="font-semibold text-gray-900 capitalize">{job.experience}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-red-600" />
              <div>
                <div className="text-sm text-gray-600">Posted</div>
                <div className="font-semibold text-gray-900">
                  {formatDate(job.postedAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            {applied ? (
              <div className="flex items-center space-x-2 px-6 py-3 bg-green-100 text-green-800 rounded-md">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Application Submitted</span>
              </div>
            ) : (
              <Button onClick={handleApply} size="lg">
                Apply Now
              </Button>
            )}
            <Button
              variant={saved ? 'secondary' : 'outline'}
              onClick={handleSave}
              size="lg"
            >
              {saved ? 'Saved' : 'Save Job'}
            </Button>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {/* Requirements */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {job.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>

          {/* Company Info */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About {job.companyName}</h2>
            <Link
              href={`/companies/${job.companyId}`}
              className="text-red-600 hover:text-red-700 font-semibold"
            >
              View company profile →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
