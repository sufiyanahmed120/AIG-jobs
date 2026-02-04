'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import Button from '@/components/Button';
import JobCard from '@/components/JobCard';
import ProfileCompletion from '@/components/ProfileCompletion';
import { JobSeekerProfile, ProfileVisibility, CVVisibility } from '@/types';
import { calculateProfileCompleteness, getDefaultProfile, PROFILE_VISIBILITY_OPTIONS, CV_VISIBILITY_OPTIONS } from '@/lib/profileUtils';
import { User, Upload, Briefcase, Heart, Edit2, Mail, Phone, MapPin, Shield, Eye, EyeOff, Settings } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { jobs, getApplicationsByUser } = useData();
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [applications, setApplications] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'communications' | 'privacy'>('profile');
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [profile, setProfile] = useState<Partial<JobSeekerProfile>>(() => {
    // Load profile from localStorage or use default
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`profile_${user?.id}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return getDefaultProfile();
        }
      }
    }
    return getDefaultProfile();
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'job_seeker') {
      router.push('/login');
      return;
    }

    // Load saved jobs and applications from localStorage (scoped by user)
    if (user?.id) {
      const savedKey = `savedJobs_${user.id}`;
      const appsKey = `applications_${user.id}`;

      const saved = JSON.parse(localStorage.getItem(savedKey) || '[]');
      setSavedJobs(saved);

      const apps = JSON.parse(localStorage.getItem(appsKey) || '[]');
      setApplications(apps);
    } else {
      setSavedJobs([]);
      setApplications([]);
    }

    // Load profile from localStorage
    if (user?.id) {
      const savedProfile = localStorage.getItem(`profile_${user.id}`);
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setProfile(parsed);
        } catch {
          // Invalid JSON, use default
        }
      }
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'job_seeker') {
    return null;
  }

  const savedJobsList = jobs.filter(j => savedJobs.includes(j.id));
  const appliedJobsList = jobs.filter(j => applications.includes(j.id));
  const profileCompleteness = calculateProfileCompleteness(profile);

  const handleSaveProfile = (updatedProfile: Partial<JobSeekerProfile>) => {
    const finalProfile = {
      ...updatedProfile,
      profileCompleteness: calculateProfileCompleteness(updatedProfile),
      lastUpdated: new Date().toISOString(),
    };
    setProfile(finalProfile);
    if (user?.id) {
      localStorage.setItem(`profile_${user.id}`, JSON.stringify(finalProfile));
    }
    setShowProfileCompletion(false);
  };

  const handleUpdatePrivacy = (field: keyof JobSeekerProfile['privacy'], value: any) => {
    const updatedProfile = {
      ...profile,
      privacy: {
        ...profile.privacy,
        [field]: value,
      },
    };
    setProfile(updatedProfile);
    if (user?.id) {
      localStorage.setItem(`profile_${user.id}`, JSON.stringify(updatedProfile));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="bg-blue-50 rounded-lg mb-6 mt-8 p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Your job seeker account
              </h1>
              <p className="text-lg text-gray-600">
                Options to manage your personal info and preferences
              </p>
            </div>
            <div className="hidden md:block mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completeness Banner */}
        {profileCompleteness < 100 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-yellow-900">Complete Your Profile</h3>
                <p className="text-sm text-yellow-700">
                  Your profile is {profileCompleteness}% complete. Complete your profile to increase your visibility to employers.
                </p>
              </div>
              <Button onClick={() => setShowProfileCompletion(true)} size="sm">
                Complete Profile
              </Button>
            </div>
          </div>
        )}

        {/* Profile Completion Modal */}
        {showProfileCompletion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <ProfileCompletion
                profile={profile}
                onSave={handleSaveProfile}
                onCancel={() => setShowProfileCompletion(false)}
              />
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('communications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'communications'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Communications
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'privacy'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Privacy & Visibility
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
              </div>
              <Button onClick={() => setShowProfileCompletion(true)} size="sm" variant="outline">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            {/* Personal Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{profile.personalDetails?.name || user?.name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{profile.personalDetails?.email || user?.email || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900">
                    {profile.personalDetails?.phoneCountryCode && profile.personalDetails?.phone
                      ? `${profile.personalDetails.phoneCountryCode} ${profile.personalDetails.phone}`
                      : 'Not set'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Nationality</label>
                  <p className="text-gray-900">{profile.personalDetails?.nationality || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Current Location</label>
                  <p className="text-gray-900">
                    {profile.personalDetails?.currentLocation?.city && profile.personalDetails?.currentLocation?.country
                      ? `${profile.personalDetails.currentLocation.city}, ${profile.personalDetails.currentLocation.country}`
                      : 'Not set'}
                  </p>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="mb-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Current Role</label>
                  <p className="text-gray-900">{profile.jobDetails?.currentRole || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Current Company</label>
                  <p className="text-gray-900">{profile.jobDetails?.currentCompany || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Years of Experience</label>
                  <p className="text-gray-900">
                    {profile.jobDetails?.experienceYears !== undefined
                      ? `${profile.jobDetails.experienceYears} years`
                      : 'Not set'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Skills</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profile.jobDetails?.skills && profile.jobDetails.skills.length > 0 ? (
                      profile.jobDetails.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-red-50 text-red-700 rounded text-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">Not set</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Visa & Availability */}
            <div className="mb-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Visa & Availability</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Visa Status</label>
                  <p className="text-gray-900">
                    {profile.visaAndAvailability?.visaStatus
                      ? profile.visaAndAvailability.visaStatus.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
                      : 'Not set'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Notice Period</label>
                  <p className="text-gray-900">
                    {profile.visaAndAvailability?.noticePeriod
                      ? profile.visaAndAvailability.noticePeriod.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
                      : 'Not set'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Currently Employed</label>
                  <p className="text-gray-900">
                    {profile.visaAndAvailability?.currentlyEmployed !== undefined
                      ? profile.visaAndAvailability.currentlyEmployed
                        ? 'Yes'
                        : 'No'
                      : 'Not set'}
                  </p>
                </div>
              </div>
            </div>

            {/* Job Preferences */}
            {profile.jobPreferences && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.jobPreferences.preferredCountries && profile.jobPreferences.preferredCountries.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Preferred Countries</label>
                      <p className="text-gray-900">{profile.jobPreferences.preferredCountries.join(', ')}</p>
                    </div>
                  )}
                  {profile.jobPreferences.salaryExpectation && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Salary Expectation</label>
                      <p className="text-gray-900">
                        {profile.jobPreferences.salaryExpectation.min} - {profile.jobPreferences.salaryExpectation.max}{' '}
                        {profile.jobPreferences.salaryExpectation.currency}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'communications' && (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Communication Preferences</h2>
            </div>
            <p className="text-gray-600 mb-6 text-sm">
              Manage how you receive notifications and updates about job opportunities.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive job alerts and updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Job Recommendations</p>
                  <p className="text-sm text-gray-600">Get personalized job recommendations</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Privacy & Visibility Settings</h2>
            </div>
            <p className="text-gray-600 mb-6 text-sm">
              Control who can see your profile information and CV.
            </p>

            <div className="space-y-6">
              {/* Profile Visibility */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Profile Visibility
                </label>
                <select
                  value={profile.privacy?.profileVisibility || 'employers_only'}
                  onChange={(e) =>
                    handleUpdatePrivacy('profileVisibility', e.target.value as ProfileVisibility)
                  }
                  className="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {PROFILE_VISIBILITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {
                    PROFILE_VISIBILITY_OPTIONS.find(
                      (opt) => opt.value === (profile.privacy?.profileVisibility || 'employers_only')
                    )?.description
                  }
                </p>
              </div>

              {/* CV Visibility */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  CV Visibility
                </label>
                <select
                  value={profile.documents?.cvVisibility || 'employers_only'}
                  onChange={(e) => {
                    const updatedProfile = {
                      ...profile,
                      documents: {
                        ...profile.documents,
                        cvVisibility: e.target.value as CVVisibility,
                      },
                    };
                    setProfile(updatedProfile);
                    if (user?.id) {
                      localStorage.setItem(`profile_${user.id}`, JSON.stringify(updatedProfile));
                    }
                  }}
                  className="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {CV_VISIBILITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {
                    CV_VISIBILITY_OPTIONS.find(
                      (opt) => opt.value === (profile.documents?.cvVisibility || 'employers_only')
                    )?.description
                  }
                </p>
              </div>

              {/* Field-level Privacy */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Field Visibility</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">Show Phone Number</p>
                      <p className="text-sm text-gray-600">Allow employers to see your phone number</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.privacy?.showPhone || false}
                        onChange={(e) => handleUpdatePrivacy('showPhone', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">Show Email</p>
                      <p className="text-sm text-gray-600">Allow employers to see your email address</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.privacy?.showEmail || false}
                        onChange={(e) => handleUpdatePrivacy('showEmail', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-900">Show Current Company</p>
                      <p className="text-sm text-gray-600">Display your current company on your profile</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.privacy?.showCurrentCompany !== false}
                        onChange={(e) => handleUpdatePrivacy('showCurrentCompany', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CV Upload Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                {/* CV Upload Section */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Upload CV</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">PDF or DOC format</p>
                    <Button size="sm" variant="outline">
                      Choose File
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">Max 5MB</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Note: CV upload is for demo purposes only
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Saved Jobs */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Heart className="w-6 h-6 text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Saved Jobs</h2>
                  <span className="text-gray-600">({savedJobsList.length})</span>
                </div>
                {savedJobsList.length > 0 ? (
                  <div className="space-y-4">
                    {savedJobsList.map(job => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No saved jobs yet. Start saving jobs you're interested in!</p>
                )}
              </div>

              {/* My Applications */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Briefcase className="w-6 h-6 text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
                  <span className="text-gray-600">({appliedJobsList.length})</span>
                </div>
                {appliedJobsList.length > 0 ? (
                  <div className="space-y-4">
                    {appliedJobsList.map(job => (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                            <p className="text-gray-600">{job.companyName}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              Applied on {formatDate(new Date())}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                            Pending
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">You haven't applied to any jobs yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
