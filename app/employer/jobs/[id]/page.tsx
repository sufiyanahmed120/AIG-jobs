'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { User, Mail, Phone, FileText, Eye } from 'lucide-react';
import Button from '@/components/Button';
import { formatDate } from '@/lib/dateUtils';

export default function EmployerJobPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { getJobById, getApplicationsByJob } = useData();
  const jobId = params.id as string;

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'employer') {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, user, router]);

  const job = getJobById(jobId);
  const applications = getApplicationsByJob(jobId);
  const [cvViews, setCvViews] = useState<Record<string, number>>({});

  useEffect(() => {
    // Load CV view counts from localStorage
    const views = JSON.parse(localStorage.getItem('cvViews') || '{}');
    setCvViews(views);
  }, []);

  if (!isAuthenticated || user?.role !== 'employer') {
    return null;
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h2>
          <Link href="/employer/profile" className="text-red-600 hover:text-red-700">
            Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  const handleViewCV = (applicationId: string, userId: string) => {
    // Increment CV view count
    const views = { ...cvViews };
    views[applicationId] = (views[applicationId] || 0) + 1;
    setCvViews(views);
    localStorage.setItem('cvViews', JSON.stringify(views));
    
    // In real app, this would open/download the CV
    alert('CV view (demo only - no actual file)');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/employer/profile" className="text-red-600 hover:text-red-700 mb-4 inline-block">
            ← Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
          <p className="text-gray-600">{job.companyName}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Details</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Location:</span>
                  <span className="ml-2 font-medium">{job.location.city}, {job.location.country}</span>
                </div>
                <div>
                  <span className="text-gray-600">Category:</span>
                  <span className="ml-2 font-medium">{job.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-medium capitalize">{job.type.replace('-', ' ')}</span>
                </div>
                <div>
                  <span className="text-gray-600">Experience:</span>
                  <span className="ml-2 font-medium capitalize">{job.experience}</span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                    job.status === 'approved' ? 'bg-green-100 text-green-800' :
                    job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {job.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Applications */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Applications ({applications.length})
                </h2>
              </div>

              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map(app => (
                    <div key={app.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{app.userName}</h3>
                              <p className="text-sm text-gray-600">{app.userEmail}</p>
                            </div>
                          </div>
                          <div className="ml-15 space-y-1 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4" />
                              <span>{app.userEmail}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4" />
                              <span>Applied on {formatDate(app.appliedAt)}</span>
                            </div>
                            {cvViews[app.id] && (
                              <div className="flex items-center space-x-2">
                                <Eye className="w-4 h-4" />
                                <span>CV viewed {cvViews[app.id]} time(s)</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <Button
                            size="sm"
                            onClick={() => handleViewCV(app.id, app.userId)}
                          >
                            View CV
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <span className={`px-3 py-1 rounded text-xs font-medium ${
                          app.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No applications yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
