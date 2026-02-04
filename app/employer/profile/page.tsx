'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Building2, CheckCircle, XCircle, Edit3, ArrowLeft } from 'lucide-react';
import Button from '@/components/Button';
import { formatDate } from '@/lib/dateUtils';

type EmployerProfile = {
  companyName: string;
  industry: string;
  size: string;
  city: string;
  country: string;
  website: string;
  description: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  logoData?: string; // optional uploaded logo (base64)
};

export default function EmployerProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { companies, jobs } = useData();

  const employer = user as any;
  const company = companies.find(c => c.id === employer?.companyId);

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<EmployerProfile>(() => ({
    companyName: company?.name || employer?.companyName || '',
    industry: company?.industry || '',
    size: company?.size || '',
    city: company?.location.city || '',
    country: company?.location.country || '',
    website: company?.website || '',
    description: company?.description || '',
    contactName: employer?.name || '',
    contactEmail: employer?.email || '',
    contactPhone: employer?.phone || '',
    logoData: undefined,
  }));

  // Load saved employer profile from localStorage (per employer)
  useEffect(() => {
    if (!employer?.id) return;
    const key = `employer_profile_${employer.id}`;
    const saved = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as EmployerProfile;
        setProfile(prev => ({ ...prev, ...parsed }));
      } catch {
        // ignore invalid JSON
      }
    }
  }, [employer?.id]);

  // Auth guard redirect
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'employer') {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'employer') {
    return null;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employer?.id) return;
    const key = `employer_profile_${employer.id}`;
    localStorage.setItem(key, JSON.stringify(profile));
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-gray-600 hover:text-red-600"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to home
              </Link>
            </div>
            <Button
              type="button"
              className="inline-flex items-center gap-2"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Info */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {profile.logoData ? (
                    <img
                      src={profile.logoData}
                      alt="Company logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-12 h-12 text-blue-600" />
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{profile.companyName}</h2>
                {employer.verified ? (
                  <div className="flex items-center justify-center space-x-1 text-green-600 mt-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-1 text-gray-400 mt-2">
                    <XCircle className="w-5 h-5" />
                    <span className="text-sm">Not Verified</span>
                  </div>
                )}
              </div>

              {/* Read-only view */}
              {!isEditing && (
                <div className="space-y-6 text-sm">
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div>
                      <span className="text-gray-600">Industry:</span>
                      <span className="ml-2 font-medium text-gray-900">{profile.industry || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Company size:</span>
                      <span className="ml-2 font-medium text-gray-900">{profile.size || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Location:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {profile.city && profile.country ? `${profile.city}, ${profile.country}` : '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Website:</span>
                      {profile.website ? (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:text-blue-700"
                        >
                          {profile.website}
                        </a>
                      ) : (
                        <span className="ml-2 text-gray-900">-</span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <h3 className="font-semibold text-gray-900">Contact details</h3>
                    <div>
                      <span className="text-gray-600">Contact name:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {profile.contactName || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Contact email:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {profile.contactEmail || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Contact phone:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {profile.contactPhone || '-'}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">About the company</h3>
                    <p className="text-sm text-gray-700">
                      {profile.description || 'Add a short description to tell candidates about your company.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Edit form */}
              {isEditing && (
                <form onSubmit={handleSave} className="mt-4 space-y-4 text-sm text-left">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Company logo (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setProfile(prev => ({
                            ...prev,
                            logoData: reader.result as string,
                          }));
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="block w-full text-sm text-gray-700"
                    />
                    {profile.logoData && (
                      <button
                        type="button"
                        onClick={() => setProfile(prev => ({ ...prev, logoData: undefined }))}
                        className="mt-2 text-xs text-red-600 hover:text-red-700"
                      >
                        Remove logo
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Company name
                    </label>
                    <input
                      type="text"
                      value={profile.companyName}
                      onChange={e => setProfile({ ...profile, companyName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Industry
                      </label>
                      <input
                        type="text"
                        value={profile.industry}
                        onChange={e => setProfile({ ...profile, industry: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="e.g. Retail, Construction"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Company size
                      </label>
                      <input
                        type="text"
                        value={profile.size}
                        onChange={e => setProfile({ ...profile, size: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="e.g. 51-200, 5000+"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={profile.city}
                        onChange={e => setProfile({ ...profile, city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Dubai"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={profile.country}
                        onChange={e => setProfile({ ...profile, country: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="UAE"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={profile.website}
                      onChange={e => setProfile({ ...profile, website: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="https://your-company.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Contact name
                      </label>
                      <input
                        type="text"
                        value={profile.contactName}
                        onChange={e => setProfile({ ...profile, contactName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Contact email
                      </label>
                      <input
                        type="email"
                        value={profile.contactEmail}
                        onChange={e => setProfile({ ...profile, contactEmail: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Contact phone
                    </label>
                    <input
                      type="tel"
                      value={profile.contactPhone}
                      onChange={e => setProfile({ ...profile, contactPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="+971 XX XXX XXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      About the company
                    </label>
                    <textarea
                      rows={4}
                      value={profile.description}
                      onChange={e => setProfile({ ...profile, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Describe what your company does, culture, and why candidates should join."
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm bg-red-600 text-white rounded-md font-semibold hover:bg-red-700"
                    >
                      Save changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Placeholder right column for future employer widgets */}
          <div className="bg-white rounded-lg shadow-md p-6 hidden lg:block" />
        </div>
      </div>
    </div>
  );
}
