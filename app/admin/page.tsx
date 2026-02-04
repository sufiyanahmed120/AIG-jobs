'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { mockStats } from '@/lib/mockData';
import { CheckCircle, XCircle, Briefcase, Users, FileText, Building2 } from 'lucide-react';
import Button from '@/components/Button';
import JobCard from '@/components/JobCard';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { jobs, companies, updateJob } = useData();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'employers'>('dashboard');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const pendingJobs = jobs.filter(j => j.status === 'pending');
  const allEmployers = companies;

  const handleApproveJob = (jobId: string) => {
    updateJob(jobId, { status: 'approved' });
    alert('Job approved successfully!');
  };

  const handleRejectJob = (jobId: string) => {
    updateJob(jobId, { status: 'rejected' });
    alert('Job rejected.');
  };

  const handleVerifyEmployer = (companyId: string) => {
    // In real app, this would update the company
    alert('Employer verification status updated (demo only)');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'jobs'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Jobs ({pendingJobs.length})
            </button>
            <button
              onClick={() => setActiveTab('employers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'employers'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Employers
            </button>
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Jobs</p>
                    <p className="text-3xl font-bold text-gray-900">{mockStats.totalJobs}</p>
                  </div>
                  <Briefcase className="w-12 h-12 text-red-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Jobs</p>
                    <p className="text-3xl font-bold text-yellow-600">{mockStats.pendingJobs}</p>
                  </div>
                  <FileText className="w-12 h-12 text-yellow-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Employers</p>
                    <p className="text-3xl font-bold text-gray-900">{mockStats.totalEmployers}</p>
                  </div>
                  <Building2 className="w-12 h-12 text-blue-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Verified Employers</p>
                    <p className="text-3xl font-bold text-green-600">{mockStats.verifiedEmployers}</p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Applications</p>
                    <p className="text-3xl font-bold text-gray-900">{mockStats.totalApplications}</p>
                  </div>
                  <FileText className="w-12 h-12 text-purple-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Job Seekers</p>
                    <p className="text-3xl font-bold text-gray-900">{mockStats.totalJobSeekers}</p>
                  </div>
                  <Users className="w-12 h-12 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pending Jobs Tab */}
        {activeTab === 'jobs' && (
          <div>
            {pendingJobs.length > 0 ? (
              <div className="space-y-6">
                {pendingJobs.map(job => (
                  <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                        <p className="text-gray-600 mb-2">{job.companyName}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span>{job.location.city}, {job.location.country}</span>
                          <span>{job.category}</span>
                          <span className="capitalize">{job.type.replace('-', ' ')}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                          Pending
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <Button onClick={() => handleApproveJob(job.id)}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button variant="outline" onClick={() => handleRejectJob(job.id)}>
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button variant="outline" onClick={() => router.push(`/jobs/${job.slug}`)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No pending jobs to review</p>
              </div>
            )}
          </div>
        )}

        {/* Employers Tab */}
        {activeTab === 'employers' && (
          <div>
            {allEmployers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allEmployers.map(company => (
                  <div key={company.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{company.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{company.industry}</p>
                        <p className="text-sm text-gray-600">
                          {company.location.city}, {company.location.country}
                        </p>
                      </div>
                      {company.verified ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-sm text-gray-600">
                        {company.jobsPosted} job{company.jobsPosted !== 1 ? 's' : ''} posted
                      </span>
                      <Button
                        size="sm"
                        variant={company.verified ? 'outline' : 'primary'}
                        onClick={() => handleVerifyEmployer(company.id)}
                      >
                        {company.verified ? 'Unverify' : 'Verify'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No employers found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
