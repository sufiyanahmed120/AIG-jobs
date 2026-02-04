'use client';

import { useState } from 'react';
import { JobFilters as Filters } from '@/types';
import { categories, locations } from '@/lib/mockData';
import { X } from 'lucide-react';

interface JobFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export default function JobFilters({ filters, onFiltersChange }: JobFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof Filters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilter = (key: keyof Filters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const clearAll = () => {
    onFiltersChange({});
  };

  const activeFiltersCount = Object.keys(filters).length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Mobile Toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 rounded-md"
        >
          <span className="font-semibold">Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          <span>{isOpen ? '▲' : '▼'}</span>
        </button>
      </div>

      {/* Filters Content */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block space-y-6`}>
        {/* Country Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Country
          </label>
          <select
            value={filters.country || ''}
            onChange={(e) => updateFilter('country', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">All Countries</option>
            {Object.keys(locations).map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        {filters.country && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City
            </label>
            <select
              value={filters.city || ''}
              onChange={(e) => updateFilter('city', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Cities</option>
              {locations[filters.country as keyof typeof locations]?.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        )}

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => updateFilter('category', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Experience Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Experience Level
          </label>
          <select
            value={filters.experience || ''}
            onChange={(e) => updateFilter('experience', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">All Levels</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
            <option value="executive">Executive</option>
          </select>
        </div>

        {/* Job Type Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Job Type
          </label>
          <select
            value={filters.jobType || ''}
            onChange={(e) => updateFilter('jobType', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">All Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        {/* Salary Range */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Salary Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.salaryMin || ''}
              onChange={(e) => updateFilter('salaryMin', e.target.value ? Number(e.target.value) : undefined)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.salaryMax || ''}
              onChange={(e) => updateFilter('salaryMax', e.target.value ? Number(e.target.value) : undefined)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Active Filters</span>
              <button
                onClick={clearAll}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.country && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {filters.country}
                  <button
                    onClick={() => clearFilter('country')}
                    className="ml-2 hover:text-red-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.city && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {filters.city}
                  <button
                    onClick={() => clearFilter('city')}
                    className="ml-2 hover:text-red-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {filters.category}
                  <button
                    onClick={() => clearFilter('category')}
                    className="ml-2 hover:text-red-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.experience && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {filters.experience}
                  <button
                    onClick={() => clearFilter('experience')}
                    className="ml-2 hover:text-red-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.jobType && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {filters.jobType}
                  <button
                    onClick={() => clearFilter('jobType')}
                    className="ml-2 hover:text-red-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
