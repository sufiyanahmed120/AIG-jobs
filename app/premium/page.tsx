'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Star, CheckCircle, Shield } from 'lucide-react';

export default function JobSeekerPremiumPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'job_seeker') {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'job_seeker') {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl text-white p-8 mb-8 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Star className="w-7 h-7 text-yellow-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">AGI Premium (Job Seeker)</h1>
              <p className="text-sm text-red-100">
                Get noticed faster and stand out to top employers across the Gulf and South Asia.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">What you get</h2>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Profile boosted to the top of employer search results (demo only).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Smart resume tips to improve your chances of getting shortlisted.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Priority access to jobs from verified employers.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Coming soon</h2>
            <p className="text-sm text-gray-700 mb-4">
              Premium is a demo concept only right now. In a real product, you would be able to
              subscribe securely and unlock advanced tools.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>Secure payments and cancellation any time.</span>
            </div>
            <button
              type="button"
              className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-md bg-gray-200 text-gray-700 text-sm font-semibold cursor-not-allowed"
              disabled
            >
              Premium coming soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

