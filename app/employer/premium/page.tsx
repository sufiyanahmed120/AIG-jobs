'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Crown, CheckCircle, Users, Briefcase } from 'lucide-react';

export default function EmployerPremiumPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'employer') {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'employer') {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl text-white p-8 mb-8 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Crown className="w-7 h-7 text-yellow-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">AGI Premium (Employers)</h1>
              <p className="text-sm text-blue-100">
                Supercharge your hiring with priority visibility, smarter insights and curated talent.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Planned premium benefits</h2>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Priority placement for your jobs in search results and email alerts.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Advanced ATS-style filters and AI-powered match scores.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Branded company profile and featured employer placement.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Designed for your hiring needs</h2>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <Users className="w-4 h-4 text-blue-500 mt-0.5" />
                <span>Reach more qualified candidates in Gulf countries and South Asia.</span>
              </li>
              <li className="flex items-start gap-2">
                <Briefcase className="w-4 h-4 text-indigo-500 mt-0.5" />
                <span>Boost critical roles and fill them faster with better insights.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Availability</h2>
          <p className="text-sm text-gray-700 mb-4">
            Premium is a demo concept in this version of AGI Job Portal. In a live product, this is where
            you would manage your subscription, billing details and usage.
          </p>
          <button
            type="button"
            className="w-full md:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-gray-200 text-gray-700 text-sm font-semibold cursor-not-allowed"
            disabled
          >
            Premium for employers coming soon
          </button>
        </div>
      </div>
    </div>
  );
}

