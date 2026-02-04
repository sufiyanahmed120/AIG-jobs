'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import JobCard from '@/components/JobCard';
import JobFilters from '@/components/JobFilters';
import { JobFilters as Filters } from '@/types';
import { useData } from '@/context/DataContext';
import { Search } from 'lucide-react';

export default function JobsPage() {
  const searchParams = useSearchParams();
  const { searchJobs, jobs } = useData();
  const [filters, setFilters] = useState<Filters>({});
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    // Initialize filters from URL params
    const initialFilters: Filters = {};
    if (searchParams.get('keyword')) {
      initialFilters.keyword = searchParams.get('keyword') || undefined;
      setKeyword(initialFilters.keyword || '');
    }
    if (searchParams.get('country')) {
      initialFilters.country = searchParams.get('country') || undefined;
    }
    if (searchParams.get('city')) {
      initialFilters.city = searchParams.get('city') || undefined;
    }
    if (searchParams.get('category')) {
      initialFilters.category = searchParams.get('category') || undefined;
    }
    if (searchParams.get('experience')) {
      initialFilters.experience = searchParams.get('experience') as any;
    }
    if (searchParams.get('jobType')) {
      initialFilters.jobType = searchParams.get('jobType') as any;
    }
    setFilters(initialFilters);
  }, [searchParams]);

  const handleKeywordSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, keyword: keyword || undefined });
  };

  const filteredJobs = searchJobs({ ...filters, keyword: keyword || filters.keyword });
  const approvedJobs = filteredJobs.filter(job => job.status === 'approved');

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Jobs</h1>
          <p className="text-gray-600">
            {approvedJobs.length} job{approvedJobs.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <form onSubmit={handleKeywordSearch} className="flex gap-2">
            <div className="flex-1 flex items-center px-4 border border-gray-300 rounded-md">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search by job title, company, or keywords"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1 py-2 outline-none text-gray-900"
              />
            </div>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold transition"
            >
              Search
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <JobFilters filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            {approvedJobs.length > 0 ? (
              <div className="space-y-4">
                {approvedJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={() => {
                    setFilters({});
                    setKeyword('');
                  }}
                  className="text-red-600 hover:text-red-700 font-semibold"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
