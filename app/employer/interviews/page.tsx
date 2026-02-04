'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Calendar, User, Briefcase } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';

export default function EmployerInterviewsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { applications, jobs } = useData();

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

  // For now, treat shortlisted candidates as "interviews" pipeline
  const shortlisted = applications.filter(
    app => app.companyId === employer.companyId && app.status === 'shortlisted'
  );

  const jobTitleMap = jobs.reduce<Record<string, string>>((acc, job) => {
    acc[job.id] = job.title;
    return acc;
  }, {});

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Interviews</h1>
          <p className="text-gray-600 text-sm">
            Track candidates moved to interview stage. (Demo view using shortlisted candidates)
          </p>
        </div>

        {shortlisted.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="hidden md:grid md:grid-cols-4 gap-4 px-6 py-3 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <div>Candidate</div>
              <div>Job</div>
              <div>Stage</div>
              <div>Applied</div>
            </div>
            <div className="divide-y divide-gray-100">
              {shortlisted.map(app => (
                <div
                  key={app.id}
                  className="px-4 sm:px-6 py-4 flex flex-col md:grid md:grid-cols-4 md:gap-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center space-x-3 mb-3 md:mb-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{app.userName}</div>
                      <div className="text-xs text-gray-500">{app.userEmail}</div>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-700 mb-2 md:mb-0">
                    <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{jobTitleMap[app.jobId] || app.jobTitle}</span>
                  </div>

                  <div className="flex items-center mb-2 md:mb-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Interview pipeline
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {formatDate(app.appliedAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-dashed border-gray-200">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-700 font-medium mb-1">No interviews scheduled yet</p>
            <p className="text-sm text-gray-500">
              When you move candidates to shortlisted status, they will appear here as part of the
              interview pipeline.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

