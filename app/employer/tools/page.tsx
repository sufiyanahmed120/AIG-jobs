'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import {
  Settings,
  FileSearch,
  Users,
  Briefcase,
  Gauge,
  Sparkles,
  ListChecks,
} from 'lucide-react';

export default function EmployerToolsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { jobs, applications } = useData();

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
  const companyJobs = jobs.filter(j => j.companyId === employer.companyId);
  const companyApplications = applications.filter(app => app.companyId === employer.companyId);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
    </div>
  );
}

