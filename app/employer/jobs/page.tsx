'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Briefcase, Users } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';

type StatusFilter = 'all' | 'approved' | 'pending' | 'rejected';

export default function EmployerJobsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { jobs, getApplicationsByJob } = useData();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'employer') {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'employer') {
    return null;
  }

  const employer = user as any;
  const companyJobs = useMemo(
    () => jobs.filter(j => j.companyId === employer.companyId),
    [jobs, employer.companyId]
  );

  const filteredJobs = useMemo(
    () =>
      statusFilter === 'all'
        ? companyJobs
        : companyJobs.filter(job => job.status === statusFilter),
    [companyJobs, statusFilter]
  );

  const statusCounts: Record<StatusFilter, number> = useMemo(() => {
    const counts: Record<StatusFilter, number> = {
      all: companyJobs.length,
      approved: 0,
      pending: 0,
      rejected: 0,
    };
    companyJobs.forEach(job => {
      counts[job.status as Exclude<StatusFilter, 'all'>] += 1;
    });
    return counts;
  }, [companyJobs]);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Jobs</h1>
            <p className="text-sm text-gray-600">All open and paused jobs</p>
          </div>
          <Link
            href="/employer/post-job"
            className="inline-flex items-center px-4 py-2 rounded-md bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
          >
            + Post a job
          </Link>
        </div>

        {/* Status filter buttons (like All / Active etc.) */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
          {(['all', 'approved', 'pending', 'rejected'] as StatusFilter[]).map(key => (
            <button
              key={key}
              type="button"
              onClick={() => setStatusFilter(key)}
              className={`px-3 py-1.5 rounded-full border ${
                statusFilter === key
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              <span className="font-medium capitalize mr-1">
                {key === 'all' ? 'All' : key}
              </span>
              <span className="text-xs opacity-80">{statusCounts[key]}</span>
            </button>
          ))}
        </div>

        {/* Jobs table header */}
        {filteredJobs.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="hidden md:grid grid-cols-[minmax(0,2.3fr)_minmax(0,1.8fr)_minmax(0,1.5fr)_minmax(0,1.5fr)] px-6 py-3 text-xs font-semibold text-gray-500 border-b border-gray-100 uppercase tracking-wide">
              <div>Job title</div>
              <div>Candidates</div>
              <div>Date posted</div>
              <div>Job status</div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredJobs.map(job => {
                const allCandidates = getApplicationsByJob(job.id);
                const newCount = allCandidates.filter(a => a.status === 'pending').length;
                const matchesCount = allCandidates.filter(a => a.status === 'shortlisted').length;

                return (
                  <div
                    key={job.id}
                    className="px-4 sm:px-6 py-4 grid grid-cols-1 md:grid-cols-[minmax(0,2.3fr)_minmax(0,1.8fr)_minmax(0,1.5fr)_minmax(0,1.5fr)] gap-4 items-center hover:bg-gray-50 transition"
                  >
                    {/* Job title & meta */}
                    <div>
                      <Link
                        href={`/employer/jobs/${job.id}`}
                        className="text-sm font-semibold text-blue-700 hover:underline"
                      >
                        {job.title}
                      </Link>
                      <div className="text-xs text-gray-600 mt-1">
                        {job.location.city}, {job.location.country} • {job.category} •{' '}
                        <span className="capitalize">{job.type.replace('-', ' ')}</span>
                      </div>
                    </div>

                    {/* Candidates summary */}
                    <div className="flex flex-wrap md:flex-nowrap gap-3 text-xs">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700 flex items-center gap-1">
                          <Users className="w-3 h-3 text-gray-500" />
                          All
                        </span>
                        <span className="text-gray-900 text-sm font-semibold">
                          {allCandidates.length}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700">New</span>
                        <span className="text-gray-900 text-sm font-semibold">{newCount}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700">Matches</span>
                        <span className="text-gray-900 text-sm font-semibold">
                          {matchesCount}
                        </span>
                      </div>
                    </div>

                    {/* Date posted */}
                    <div className="text-sm text-gray-700">
                      <div>{formatDate(job.postedAt)}</div>
                      <div className="text-xs text-gray-500">• {job.views} views</div>
                    </div>

                    {/* Job status pill */}
                    <div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          job.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : job.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
            <p className="text-gray-600 mb-6">Start posting jobs to find qualified candidates</p>
            <Link
              href="/employer/post-job"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700 transition"
            >
              Post Your First Job
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
