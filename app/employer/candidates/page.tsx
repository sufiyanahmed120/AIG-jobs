'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { User, Mail, Briefcase, Filter, Check, HelpCircle, X } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';

const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'New' },
  { key: 'reviewed', label: 'Reviewing' },
  { key: 'shortlisted', label: 'Shortlisted' },
  { key: 'rejected', label: 'Rejected' },
] as const;

type StatusKey = (typeof STATUS_FILTERS)[number]['key'];

export default function EmployerCandidatesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { applications, jobs } = useData();
  const [statusFilter, setStatusFilter] = useState<StatusKey>('all');

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

  const companyApplications = useMemo(
    () => applications.filter(app => app.companyId === employer.companyId),
    [applications, employer.companyId]
  );

  const statusCounts = useMemo(() => {
    const counts: Record<StatusKey, number> = {
      all: companyApplications.length,
      pending: 0,
      reviewed: 0,
      shortlisted: 0,
      rejected: 0,
    };
    companyApplications.forEach(app => {
      counts[app.status as Exclude<StatusKey, 'all'>] += 1;
    });
    return counts;
  }, [companyApplications]);

  const filteredApplications = useMemo(
    () =>
      statusFilter === 'all'
        ? companyApplications
        : companyApplications.filter(app => app.status === statusFilter),
    [companyApplications, statusFilter]
  );

  const jobTitleMap = useMemo(
    () =>
      jobs.reduce<Record<string, string>>((acc, job) => {
        acc[job.id] = job.title;
        return acc;
      }, {}),
    [jobs]
  );

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Candidates</h1>
          <p className="text-gray-600 text-sm">
            All open and paused jobs
          </p>
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-500 mr-2">
            <Filter className="w-4 h-4 mr-1" />
            Status
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            {STATUS_FILTERS.map(filter => (
              <button
                key={filter.key}
                type="button"
                onClick={() => setStatusFilter(filter.key)}
                className={`px-3 py-1.5 rounded-full border ${
                  statusFilter === filter.key
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-red-400'
                }`}
              >
                <span className="font-medium mr-1">{filter.label}</span>
                <span className="text-xs opacity-80">
                  {filter.key === 'all' ? statusCounts.all : statusCounts[filter.key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Header row for table */}
        <div className="hidden md:grid grid-cols-[32px_minmax(0,2.5fr)_minmax(0,2fr)_minmax(0,2fr)_minmax(0,1.5fr)] text-xs font-semibold text-gray-500 border-b border-gray-200 pb-2 mb-1">
          <div className="pl-2"> </div>
          <div>Candidates</div>
          <div>Matches to job post</div>
          <div>Activity</div>
          <div>Interest</div>
        </div>

        {/* Candidates list */}
        {filteredApplications.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-2">
            <div className="divide-y divide-gray-100">
              {filteredApplications.map(app => (
                <div
                  key={app.id}
                  className="grid grid-cols-1 md:grid-cols-[32px_minmax(0,2.5fr)_minmax(0,2fr)_minmax(0,2fr)_minmax(0,1.5fr)] items-center px-3 sm:px-4 py-3 hover:bg-gray-50 transition"
                >
                  {/* Checkbox placeholder */}
                  <div className="flex items-center justify-start mb-2 md:mb-0">
                    <input type="checkbox" className="h-4 w-4 text-red-600 rounded border-gray-300" />
                  </div>

                  {/* Candidate */}
                  <div className="flex items-center space-x-3 mb-2 md:mb-0">
                    <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{app.userName}</div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Mail className="w-3 h-3 mr-1" />
                        {app.userEmail}
                      </div>
                    </div>
                  </div>

                  {/* Matches / job info */}
                  <div className="text-sm text-gray-700 mb-2 md:mb-0">
                    <div className="flex items-center mb-1">
                      <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">
                        {jobTitleMap[app.jobId] || app.jobTitle}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 text-[11px] text-gray-600">
                      {/* Simple skill-style tags just to mimic UI */}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
                        Match
                      </span>
                    </div>
                  </div>

                  {/* Activity */}
                  <div className="text-sm text-gray-700 mb-2 md:mb-0">
                    <div>Applied {formatDate(app.appliedAt)}</div>
                    <div className="text-xs text-gray-500">
                      Bulk actions are disabled for candidates in this time frame
                    </div>
                  </div>

                  {/* Interest */}
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                      aria-label="Interested"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                      aria-label="Maybe"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                      aria-label="Not interested"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-dashed border-gray-200 mt-4">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-700 font-medium mb-1">No candidates yet</p>
            <p className="text-sm text-gray-500">
              Once candidates apply to your jobs, they will appear here for review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

