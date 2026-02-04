 'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import {
  PlusCircle,
  Briefcase,
  Users,
  Calendar,
  BarChart2,
  Wrench,
  Search,
  Mail,
  Check,
  HelpCircle,
  X,
  Plus,
  Settings,
  FileSearch,
  Gauge,
  Sparkles,
  ListChecks,
} from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';

type Tab = 'smart' | 'jobs' | 'candidates' | 'interviews' | 'tools';
type JobStatusFilter = 'all' | 'approved' | 'pending' | 'rejected';
type CandidateStatusFilter = 'all' | 'pending' | 'reviewed' | 'shortlisted' | 'rejected';

const CANDIDATE_STATUS_FILTERS: { key: CandidateStatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'New' },
  { key: 'reviewed', label: 'Reviewing' },
  { key: 'shortlisted', label: 'Shortlisted' },
  { key: 'rejected', label: 'Rejected' },
];

export default function EmployerDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { jobs, applications, getApplicationsByJob } = useData();

  const employer = user as any;
  const [activeTab, setActiveTab] = useState<Tab>('smart');
  const [jobStatusFilter, setJobStatusFilter] = useState<JobStatusFilter>('all');
  const [candidateStatusFilter, setCandidateStatusFilter] =
    useState<CandidateStatusFilter>('all');

  const companyJobs = useMemo(
    () => jobs.filter(j => j.companyId === employer?.companyId),
    [jobs, employer?.companyId]
  );
  const companyApplications = useMemo(
    () => applications.filter(app => app.companyId === employer?.companyId),
    [applications, employer?.companyId]
  );

  const jobStatusCounts: Record<JobStatusFilter, number> = useMemo(() => {
    const counts: Record<JobStatusFilter, number> = {
      all: companyJobs.length,
      approved: 0,
      pending: 0,
      rejected: 0,
    };
    companyJobs.forEach(job => {
      counts[job.status as Exclude<JobStatusFilter, 'all'>] += 1;
    });
    return counts;
  }, [companyJobs]);

  const filteredJobs = useMemo(
    () =>
      jobStatusFilter === 'all'
        ? companyJobs
        : companyJobs.filter(job => job.status === jobStatusFilter),
    [companyJobs, jobStatusFilter]
  );

  const candidateStatusCounts: Record<CandidateStatusFilter, number> = useMemo(() => {
    const counts: Record<CandidateStatusFilter, number> = {
      all: companyApplications.length,
      pending: 0,
      reviewed: 0,
      shortlisted: 0,
      rejected: 0,
    };
    companyApplications.forEach(app => {
      counts[app.status as Exclude<CandidateStatusFilter, 'all'>] += 1;
    });
    return counts;
  }, [companyApplications]);

  const filteredApplications = useMemo(
    () =>
      candidateStatusFilter === 'all'
        ? companyApplications
        : companyApplications.filter(app => app.status === candidateStatusFilter),
    [companyApplications, candidateStatusFilter]
  );

  const jobTitleMap = useMemo(
    () =>
      jobs.reduce<Record<string, string>>((acc, job) => {
        acc[job.id] = job.title;
        return acc;
      }, {}),
    [jobs]
  );

  const renderMain = () => {
    if (activeTab === 'jobs') {
      return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Jobs</h1>
              <p className="text-sm text-gray-600">All open and paused jobs</p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/employer/post-job')}
              className="inline-flex items-center px-4 py-2 rounded-md bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
            >
              + Post a job
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
            {( ['all', 'approved', 'pending', 'rejected'] as JobStatusFilter[] ).map(key => (
              <button
                key={key}
                type="button"
                onClick={() => setJobStatusFilter(key)}
                className={`px-3 py-1.5 rounded-full border ${
                  jobStatusFilter === key
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                <span className="font-medium capitalize mr-1">
                  {key === 'all' ? 'All' : key}
                </span>
                <span className="text-xs opacity-80">{jobStatusCounts[key]}</span>
              </button>
            ))}
          </div>

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

                      <div className="text-sm text-gray-700">
                        <div>{formatDate(job.postedAt)}</div>
                        <div className="text-xs text-gray-500">• {job.views} views</div>
                      </div>

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
              <p className="text-gray-600 mb-6">
                Start posting jobs to find qualified candidates
              </p>
              <button
                type="button"
                onClick={() => router.push('/employer/post-job')}
                className="inline-block bg-red-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700 transition"
              >
                Post Your First Job
              </button>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'candidates') {
      return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Candidates</h1>
            <p className="text-gray-600 text-sm">All open and paused jobs</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center text-sm text-gray-500 mr-2">
              <Search className="w-4 h-4 mr-1" />
              Status
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              {CANDIDATE_STATUS_FILTERS.map(filter => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setCandidateStatusFilter(filter.key)}
                  className={`px-3 py-1.5 rounded-full border ${
                    candidateStatusFilter === filter.key
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-red-400'
                  }`}
                >
                  <span className="font-medium mr-1">{filter.label}</span>
                  <span className="text-xs opacity-80">
                    {candidateStatusCounts[filter.key]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:grid grid-cols-[32px_minmax(0,2.5fr)_minmax(0,2fr)_minmax(0,2fr)_minmax(0,1.5fr)] text-xs font-semibold text-gray-500 border-b border-gray-200 pb-2 mb-1">
            <div className="pl-2" />
            <div>Candidates</div>
            <div>Matches to job post</div>
            <div>Activity</div>
            <div>Interest</div>
          </div>

          {filteredApplications.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-2">
              <div className="divide-y divide-gray-100">
                {filteredApplications.map(app => (
                  <div
                    key={app.id}
                    className="grid grid-cols-1 md:grid-cols-[32px_minmax(0,2.5fr)_minmax(0,2fr)_minmax(0,2fr)_minmax(0,1.5fr)] items-center px-3 sm:px-4 py-3 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center justify-start mb-2 md:mb-0">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-red-600 rounded border-gray-300"
                      />
                    </div>

                    <div className="flex items-center space-x-3 mb-2 md:mb-0">
                      <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                        <Users className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{app.userName}</div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Mail className="w-3 h-3 mr-1" />
                          {app.userEmail}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-700 mb-2 md:mb-0">
                      <div className="flex items-center mb-1">
                        <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">
                          {jobTitleMap[app.jobId] || app.jobTitle}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 text-[11px] text-gray-600">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
                          Match
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-700 mb-2 md:mb-0">
                      <div>Applied {formatDate(app.appliedAt)}</div>
                      <div className="text-xs text-gray-500">
                        Bulk actions are disabled for candidates in this time frame
                      </div>
                    </div>

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
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-700 font-medium mb-1">No candidates yet</p>
              <p className="text-sm text-gray-500">
                Once candidates apply to your jobs, they will appear here for review.
              </p>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'interviews') {
      return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Interviews</h1>
            <p className="text-gray-600 text-sm">
              Manage your interview availability and scheduled meetings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: availability and calendar connect */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">
                Connect your calendar
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Automatically prevent double-bookings and get new events added as they&apos;re
                scheduled.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => alert('Calendar connection is a demo placeholder in this version.')}
                  className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                >
                  Connect your calendar
                </button>
                <button
                  type="button"
                  onClick={() => alert('More information will be available in a future version.')}
                  className="inline-flex items-center px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Learn more
                </button>
              </div>

              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Regular availability
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Add times when you are typically available.
              </p>

              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                <div
                  key={day}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-sm font-medium text-gray-800">{day}</span>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-500">Unavailable</span>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                      aria-label={`Add availability for ${day}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: simple week calendar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
                    aria-label="Previous week"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
                    aria-label="Next week"
                  >
                    ›
                  </button>
                </div>
                <p className="text-sm font-semibold text-gray-800">
                  This week (demo calendar)
                </p>
                <div />
              </div>

              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="px-2 py-2 text-center">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="h-64 grid grid-rows-8 text-[11px] text-gray-400">
                  {Array.from({ length: 8 }).map((_, row) => (
                    <div
                      key={row}
                      className="grid grid-cols-7 border-b border-gray-100 last:border-b-0"
                    >
                      {Array.from({ length: 7 }).map((__, col) => (
                        <div
                          key={col}
                          className="border-r border-gray-100 last:border-r-0 h-8"
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'tools') {
      return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Employer Tools</h1>
            <p className="text-gray-600 text-sm">
              Simple tools to help you review CVs and understand your hiring activity. (Demo only)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* ATS Resume Checker card */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <FileSearch className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">ATS Resume Checker</h2>
                  <p className="text-sm text-gray-600">
                    Quickly scan CVs for key skills, experience and job match.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center mt-4 px-4 py-2 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition"
              >
                Try Resume Checker (demo)
              </button>
            </div>

            {/* Job Match Scoring */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Gauge className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Job Match Scoring</h2>
                  <p className="text-sm text-gray-600">
                    See which candidates best match a specific job based on skills and experience.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center mt-4 px-4 py-2 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition"
              >
                View Match Scores (demo)
              </button>
            </div>

            {/* JD Optimizer */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">JD Optimizer</h2>
                  <p className="text-sm text-gray-600">
                    Improve your job descriptions for better visibility and more relevant applicants.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center mt-4 px-4 py-2 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition"
              >
                Optimize JD (demo)
              </button>
            </div>

            {/* Interview Kit Builder */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                  <ListChecks className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Interview Kit Builder</h2>
                  <p className="text-sm text-gray-600">
                    Generate structured interview questions based on the role and seniority level.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center mt-4 px-4 py-2 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition"
              >
                Build Interview Kit (demo)
              </button>
            </div>

            {/* Activity summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Settings className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Hiring Activity Snapshot</h2>
                  <p className="text-sm text-gray-600">
                    Overview of jobs and candidates for your company.
                  </p>
                </div>
              </div>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                    Open & pending jobs
                  </dt>
                  <dd className="font-semibold text-gray-900">
                    {companyJobs.length}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    Total candidates
                  </dt>
                  <dd className="font-semibold text-gray-900">
                    {companyApplications.length}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      );
    }

    // Smart sourcing default view
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover and engage with top talent
          </h1>
          <p className="text-gray-600 text-sm max-w-2xl">
            Let us know what you&apos;re looking for. We&apos;ll help you find the right
            candidates for your open roles.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-8">
          <form
            onSubmit={e => e.preventDefault()}
            className="flex flex-col md:flex-row gap-3 items-stretch"
          >
            <div className="flex-1 flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Job title, skills, or keywords"
                className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
              />
            </div>
            <div className="flex-1 flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="City or country"
                className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
            >
              Find candidates
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
              Open & pending jobs
            </p>
            <p className="text-2xl font-bold text-gray-900">{companyJobs.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Total candidates</p>
            <p className="text-2xl font-bold text-gray-900">{companyApplications.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Company</p>
            <p className="text-sm font-semibold text-gray-900">
              {employer?.companyName || 'Your company'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <aside className="w-56 bg-gray-900 text-white flex flex-col py-4">
        <div className="px-4 mb-4">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Employer</p>
          <p className="text-sm font-semibold truncate">{employer?.companyName || 'My Company'}</p>
        </div>
        <nav className="flex-1 space-y-1 px-2">
          <button
            type="button"
            onClick={() => router.push('/employer/post-job')}
            className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create new
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`w-full flex items-center px-3 py-2 rounded-md text-sm mt-1 ${
              activeTab === 'jobs' ? 'bg-gray-800 text-white' : 'text-gray-200 hover:bg-gray-800'
            }`}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Jobs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('smart')}
            className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${
              activeTab === 'smart' ? 'bg-gray-800 text-white' : 'text-gray-200 hover:bg-gray-800'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Smart Sourcing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('candidates')}
            className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${
              activeTab === 'candidates'
                ? 'bg-gray-800 text-white'
                : 'text-gray-200 hover:bg-gray-800'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Candidates
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('interviews')}
            className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${
              activeTab === 'interviews'
                ? 'bg-gray-800 text-white'
                : 'text-gray-200 hover:bg-gray-800'
            }`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Interviews
          </button>
          <button
            type="button"
            onClick={() => alert('Analytics dashboard is coming soon in this demo.')}
            className="w-full flex items-center px-3 py-2 rounded-md text-sm text-gray-200 hover:bg-gray-800"
          >
            <BarChart2 className="w-4 h-4 mr-2" />
            Analytics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tools')}
            className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${
              activeTab === 'tools' ? 'bg-gray-800 text-white' : 'text-gray-200 hover:bg-gray-800'
            }`}
          >
            <Wrench className="w-4 h-4 mr-2" />
            Tools
          </button>
        </nav>
      </aside>

      <main className="flex-1">{renderMain()}</main>
    </div>
  );
}

