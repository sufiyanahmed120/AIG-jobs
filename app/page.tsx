'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Briefcase, Filter, X } from 'lucide-react';
import JobCard from '@/components/JobCard';
import FilterSelect from '@/components/FilterSelect';
import ProfileCompletion from '@/components/ProfileCompletion';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import EmployerDashboard from '@/components/EmployerDashboard';
import { locations, categories } from '@/lib/mockData';
import { getJobRoleSuggestions, getLocationSuggestions } from '@/lib/searchUtils';
import { getDefaultProfile, calculateProfileCompleteness } from '@/lib/profileUtils';
import { JobSeekerProfile } from '@/types';

// Country flag mapping - maps country names to flag image paths
// Place flag images in: public/images/flags/
const countryFlags: Record<string, string> = {
  'UAE': '/images/flags/dubai.jpg',
  'Saudi Arabia': '/images/flags/saudi.jpg',
  'Qatar': '/images/flags/qatar.png',
  'Kuwait': '/images/flags/Kuwait.png',
  'Oman': '/images/flags/omang.jpg',
  'Bahrain': '/images/flags/bahrain.jpg', // Missing - will show fallback
  'Pakistan': '/images/flags/pakistan.jpg',
  'India': '/images/flags/India.jpg',
};

export default function Home() {
  const router = useRouter();
  const { jobs } = useData();
  const { user, isAuthenticated } = useAuth();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Profile completion modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState<Partial<JobSeekerProfile>>(getDefaultProfile());
  
  // Autocomplete states
  const [roleSuggestions, setRoleSuggestions] = useState<string[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<Array<{ city: string; country: string; display: string }>>([]);
  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  
  const roleInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLDivElement>(null);

  // Get featured jobs (approved jobs, limited to 6)
  const featuredJobs = jobs.filter(job => job.status === 'approved').slice(0, 6);

  // Handle job role autocomplete
  useEffect(() => {
    if (searchKeyword) {
      const suggestions = getJobRoleSuggestions(searchKeyword);
      setRoleSuggestions(suggestions);
      setShowRoleSuggestions(suggestions.length > 0);
    } else {
      setRoleSuggestions([]);
      setShowRoleSuggestions(false);
    }
  }, [searchKeyword]);

  // Handle location autocomplete
  useEffect(() => {
    if (searchLocation) {
      const suggestions = getLocationSuggestions(searchLocation);
      setLocationSuggestions(suggestions);
      setShowLocationSuggestions(suggestions.length > 0);
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  }, [searchLocation]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleInputRef.current && !roleInputRef.current.contains(event.target as Node)) {
        setShowRoleSuggestions(false);
      }
      if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check if user is new and show profile completion modal
  useEffect(() => {
    if (isAuthenticated && user?.role === 'job_seeker' && user?.id) {
      const savedProfile = localStorage.getItem(`profile_${user.id}`);
      const skippedProfile = localStorage.getItem(`profile_skipped_${user.id}`);
      
      // Don't show modal if profile exists or user skipped it
      if (savedProfile || skippedProfile === 'true') {
        setShowProfileModal(false);
        return;
      }
      
      // New user who hasn't skipped - show profile completion modal
      // Pre-fill with user's email and name
      const defaultProfile = getDefaultProfile();
      const basePersonalDetails: JobSeekerProfile['personalDetails'] = {
        ...(defaultProfile.personalDetails as JobSeekerProfile['personalDetails']),
        name: user.name || '',
        email: user.email || '',
      };

      setProfile({
        ...defaultProfile,
        personalDetails: basePersonalDetails,
      });
      setShowProfileModal(true);
    } else {
      // Not authenticated or not job seeker, close modal
      setShowProfileModal(false);
    }
  }, [isAuthenticated, user?.id, user?.role]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showProfileModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showProfileModal]);

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
    // Close modal immediately after saving - it won't show again because profile now exists
    setShowProfileModal(false);
  };

  const handleCancelProfile = () => {
    setShowProfileModal(false);
  };

  const handleSkipProfile = () => {
    // Mark that user skipped the profile completion
    if (user?.id) {
      localStorage.setItem(`profile_skipped_${user.id}`, 'true');
    }
    setShowProfileModal(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKeyword) params.set('keyword', searchKeyword);
    if (searchLocation) {
      // Check if it's a city,country format or just country
      const locationMatch = searchLocation.match(/^(.+),\s*(.+)$/);
      if (locationMatch) {
        params.set('city', locationMatch[1].trim());
        params.set('country', locationMatch[2].trim());
      } else {
        params.set('country', searchLocation);
      }
    }
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedJobType) params.set('jobType', selectedJobType);
    if (selectedExperience) params.set('experience', selectedExperience);
    router.push(`/jobs?${params.toString()}`);
  };

  const selectRole = (role: string) => {
    setSearchKeyword(role);
    setShowRoleSuggestions(false);
  };

  const selectLocation = (location: { city: string; country: string; display: string }) => {
    setSearchLocation(location.display);
    setShowLocationSuggestions(false);
  };

  // If employer is logged in, show employer dashboard instead of job seeker hero
  if (isAuthenticated && user?.role === 'employer') {
    return <EmployerDashboard />;
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative text-white min-h-[600px]">
        {/* Background Image with Fallback */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero-background.jpg.jpeg')",
          }}
        >
          {/* Subtle dark overlay for text readability - minimal opacity */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Find your next job
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Join top employers from Dubai and the Middle East
            </p>

            {/* Enhanced Search Bar with Autocomplete */}
            <form onSubmit={handleSearch} className="max-w-5xl mx-auto relative z-10">
              <div className="bg-white rounded-lg shadow-2xl p-4 flex flex-col gap-3">
                {/* Main Search Row */}
                <div className="flex flex-col md:flex-row gap-2">
                  {/* Job Role Input with Autocomplete */}
                  <div className="flex-1 relative" ref={roleInputRef}>
                    <div className="flex items-center px-4 py-3 border border-gray-200 rounded-md focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200">
                      <input
                        type="text"
                        placeholder="Job role, title, or keywords"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onFocus={() => searchKeyword && setShowRoleSuggestions(true)}
                        className="flex-1 outline-none text-gray-900 placeholder-gray-400"
                      />
                      {searchKeyword && (
                        <button
                          type="button"
                          onClick={() => setSearchKeyword('')}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {/* Autocomplete Dropdown */}
                    {showRoleSuggestions && roleSuggestions.length > 0 && (
                      <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-300 rounded-md shadow-xl max-h-60 overflow-y-auto">
                        {roleSuggestions.map((role, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => selectRole(role)}
                            className="w-full text-left px-4 py-2.5 hover:bg-red-50 hover:text-red-600 transition cursor-pointer text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            <Search className="w-4 h-4 inline mr-2 text-gray-400" />
                            {role}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Location Input with Autocomplete */}
                  <div className="md:w-72 relative mr-3 md:mr-4" ref={locationInputRef}>
                    <div className="flex items-center px-4 py-3 border border-gray-200 rounded-md focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200">
                      <MapPin className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="City or Country"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        onFocus={() => searchLocation && setShowLocationSuggestions(true)}
                        className="flex-1 outline-none text-gray-900 placeholder-gray-400"
                      />
                      {searchLocation && (
                        <button
                          type="button"
                          onClick={() => setSearchLocation('')}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {/* Location Autocomplete Dropdown */}
                    {showLocationSuggestions && locationSuggestions.length > 0 && (
                      <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-300 rounded-md shadow-xl max-h-60 overflow-y-auto">
                        {locationSuggestions.map((location, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => selectLocation(location)}
                            className="w-full text-left px-4 py-2.5 hover:bg-red-50 hover:text-red-600 transition cursor-pointer text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            <MapPin className="w-4 h-4 inline mr-2 text-gray-400" />
                            {location.display}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Search Button */}
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-semibold transition flex items-center justify-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Find Jobs
                  </button>
                </div>

                {/* Advanced Filters Toggle */}
                <div className="flex items-center justify-between px-2">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition text-sm font-medium"
                  >
                    <Filter className="w-4 h-4" />
                    {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                  </button>
                  {(selectedCategory || selectedJobType || selectedExperience) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory('');
                        setSelectedJobType('');
                        setSelectedExperience('');
                      }}
                      className="text-xs text-gray-500 hover:text-red-600"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                {/* Advanced Filters Panel */}
                {showAdvancedFilters && (
                  <div className="border-t border-gray-200 pt-4 px-2 mt-2 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Category Filter */}
                      <FilterSelect
                        label="Category"
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                        placeholder="All Categories"
                        options={[
                          { label: 'All Categories', value: '' },
                          ...categories.map(cat => ({ label: cat, value: cat }))
                        ]}
                      />

                      {/* Job Type Filter */}
                      <FilterSelect
                        label="Job Type"
                        value={selectedJobType}
                        onChange={setSelectedJobType}
                        placeholder="All Types"
                        options={[
                          { label: 'All Types', value: '' },
                          { label: 'Full Time', value: 'full-time' },
                          { label: 'Part Time', value: 'part-time' },
                          { label: 'Contract', value: 'contract' },
                          { label: 'Internship', value: 'internship' },
                        ]}
                      />

                      {/* Experience Level Filter */}
                      <FilterSelect
                        label="Experience Level"
                        value={selectedExperience}
                        onChange={setSelectedExperience}
                        placeholder="All Levels"
                        options={[
                          { label: 'All Levels', value: '' },
                          { label: 'Entry Level', value: 'entry' },
                          { label: 'Mid Level', value: 'mid' },
                          { label: 'Senior Level', value: 'senior' },
                          { label: 'Executive', value: 'executive' },
                        ]}
                      />
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Browse Jobs by Location */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Find jobs by Country</h2>
          <div className="relative overflow-hidden">
            {/* Auto-scrolling row of country cards */}
            <div className="marquee-row gap-4">
              {[...Object.entries(locations), ...Object.entries(locations)].map(
                ([country]) => {
                  const jobCount = jobs.filter(
                    (j) => j.location.country === country && j.status === 'approved'
                  ).length;
                  return (
                    <Link
                      key={`${country}-${Math.random()}`}
                      href={isAuthenticated ? `/jobs?country=${country}` : "/login"}
                      className="min-w-[140px] bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition text-center border border-gray-200 hover:border-red-300 mr-2"
                    >
                      <div className="mb-2 flex justify-center items-center h-8">
                        {countryFlags[country] ? (
                          <img 
                            src={countryFlags[country]} 
                            alt={`${country} flag`}
                            className="w-10 h-7 object-contain rounded-sm shadow-sm"
                            onError={(e) => {
                              // Hide broken image and show fallback
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'block';
                            }}
                          />
                        ) : null}
                        <span className="text-2xl" style={{ display: countryFlags[country] ? 'none' : 'block' }}>🏳️</span>
                      </div>
                      <div className="font-semibold text-gray-900">{country}</div>
                      <div className="text-sm text-gray-600 mt-1">{jobCount} jobs</div>
                    </Link>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Browse Jobs by Category */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Find jobs in your field</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Engineering', 'Finance & Accounting', 'IT & Software', 'Sales & Marketing'].map(category => {
              const jobCount = jobs.filter(j => j.category === category && j.status === 'approved').length;
              return (
                <Link
                  key={category}
                  href={isAuthenticated ? `/jobs?category=${encodeURIComponent(category)}` : "/login"}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border border-gray-200 hover:border-red-300"
                >
                  <div className="text-3xl mb-3">
                    {category === 'Engineering' && '🏗️'}
                    {category === 'Finance & Accounting' && '💰'}
                    {category === 'IT & Software' && '💻'}
                    {category === 'Sales & Marketing' && '📊'}
                  </div>
                  <div className="font-semibold text-gray-900">{category}</div>
                  <div className="text-sm text-gray-600 mt-1">{jobCount} jobs</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Jobs</h2>
            <Link href="/jobs" className="text-red-600 hover:text-red-700 font-semibold">
              View All Jobs →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {featuredJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      {/* Employer CTA - Only show for employers or when not logged in */}
      {(!isAuthenticated || user?.role === 'employer') && (
        <section className="py-16 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join top employers currently hiring
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Connect with thousands of qualified candidates
            </p>
            <Link
              href="/employer/post-job"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
            >
              Post a Job
            </Link>
          </div>
        </section>
      )}

      {/* Job Seeker CTA - Only show for job seekers or when not logged in */}
      {(!isAuthenticated || user?.role === 'job_seeker') && (
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Register now and let employers find you
                  </h2>
                  <p className="text-lg text-gray-600 mb-4">
                    <span className="text-red-600 font-bold text-2xl">60,000</span> professionals get contacted by employers every month through AGI Job Portal.
                  </p>
                  <p className="text-xl text-gray-700 font-semibold mb-6">Be the next one</p>
                  <Link
                    href="/register"
                    className="inline-block bg-red-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-red-700 transition"
                  >
                    Register
                  </Link>
                </div>
                <div className="hidden md:block">
                  <div className="bg-gradient-to-br from-blue-100 to-red-100 rounded-lg p-8 text-center">
                    <div className="text-6xl mb-4">👤</div>
                    <p className="text-gray-700">Build your profile and get discovered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Profile Completion Modal for New Users */}
      {showProfileModal && isAuthenticated && user?.role === 'job_seeker' && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <ProfileCompletion
              profile={profile}
              onSave={handleSaveProfile}
              onCancel={handleCancelProfile}
              onSkip={handleSkipProfile}
            />
          </div>
        </div>
      )}
    </div>
  );
}
