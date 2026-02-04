'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Briefcase, Clock, CheckCircle, XCircle } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';

export default function MyApplicationsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { jobs } = useData();
  const [applications, setApplications] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'job_seeker') {
      router.push('/login');
      return;
    }

    if (user?.id) {
      const appsKey = `applications_${user.id}`;
      const apps = JSON.parse(localStorage.getItem(appsKey) || '[]');
      setApplications(apps);
    } else {
      setApplications([]);
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'job_seeker') {
    return null;
  }

  const appliedJobs = jobs.filter(j => applications.includes(j.id));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Pending</span>
          </span>
        );
      case 'reviewed':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Under Review
          </span>
        );
      case 'shortlisted':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center space-x-1">
            <CheckCircle className="w-4 h-4" />
            <span>Shortlisted</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium flex items-center space-x-1">
            <XCircle className="w-4 h-4" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">
            Track your job applications and their status
          </p>
        </div>

        {appliedJobs.length > 0 ? (
          <div className="space-y-4">
            {appliedJobs.map(job => (
              <div key={job.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link href={`/jobs/${job.slug}`}>
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-red-600 transition mb-2">
                        {job.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mb-2">{job.companyName}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <span>{job.location.city}, {job.location.country}</span>
                      <span>{job.category}</span>
                      <span className="capitalize">{job.type.replace('-', ' ')}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Applied on {formatDate(new Date())}
                    </p>
                  </div>
                  <div className="ml-4">
                    {getStatusBadge('pending')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600 mb-6">
              Start applying to jobs that match your skills and interests
            </p>
            <Link
              href="/jobs"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700 transition"
            >
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
