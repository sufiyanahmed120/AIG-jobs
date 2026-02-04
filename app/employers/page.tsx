'use client';

import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { Building2 } from 'lucide-react';

export default function EmployersPage() {
  const { companies } = useData();
  const verifiedCompanies = companies.filter(c => c.verified);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">For Employers</h1>
          <p className="text-gray-600">
            Join top employers currently hiring
          </p>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-12 mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Post a Job Today</h2>
          <p className="text-xl mb-6 text-blue-100">
            Reach thousands of qualified candidates in Gulf countries and South Asia
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
        </div>

        {/* Featured Employers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Employers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {verifiedCompanies.slice(0, 6).map(company => (
              <div
                key={company.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:border-red-300 transition text-center"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{company.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{company.jobsPosted} jobs</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Targeted Reach</h3>
            <p className="text-gray-600">
              Connect with candidates specifically looking for jobs in Gulf countries and South Asia
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Posting</h3>
            <p className="text-gray-600">
              Post jobs in minutes and start receiving applications immediately
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600">
              Track views, applications, and manage candidates all in one place
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
