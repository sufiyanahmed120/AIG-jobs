'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { categories, locations } from '@/lib/mockData';
import { Job, JobType, ExperienceLevel } from '@/types';
import Button from '@/components/Button';

export default function PostJobPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { addJob, companies } = useData();
  const [formData, setFormData] = useState({
    title: '',
    companyId: '',
    location: { country: '', city: '' },
    category: '',
    type: 'full-time' as JobType,
    experience: 'mid' as ExperienceLevel,
    salary: { min: 0, max: 0, currency: 'AED' },
    description: '',
    requirements: [''],
    benefits: [''],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'employer') {
      router.push('/login');
      return;
    }

    // Set company ID from user
    const employer = user as any;
    if (employer.companyId) {
      setFormData(prev => ({ ...prev, companyId: employer.companyId }));
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const employer = user as any;
    const company = companies.find(c => c.id === employer.companyId);

    // Create slug from title
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + formData.location.city.toLowerCase();

    const newJob: Job = {
      id: `job-${Date.now()}`,
      slug,
      title: formData.title,
      companyId: formData.companyId,
      companyName: company?.name || employer.companyName,
      companyLogo: company?.logo,
      location: formData.location,
      category: formData.category,
      type: formData.type,
      experience: formData.experience,
      salary: formData.salary,
      description: formData.description,
      requirements: formData.requirements.filter(r => r.trim() !== ''),
      benefits: formData.benefits.filter(b => b.trim() !== ''),
      status: 'pending',
      postedAt: new Date().toISOString(),
      applicants: [],
      views: 0,
    };

    addJob(newJob);
    
    alert('Job posted successfully! It will be reviewed by admin before going live.');
    router.push('/employer/profile');
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, ''],
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((r, i) => i === index ? value : r),
    }));
  };

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, ''],
    }));
  };

  const updateBenefit = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.map((b, i) => i === index ? value : b),
    }));
  };

  if (!isAuthenticated || user?.role !== 'employer') {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Post a Job</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="e.g. Senior Software Engineer"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Country *
              </label>
              <select
                required
                value={formData.location.country}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, country: e.target.value, city: '' },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select Country</option>
                {Object.keys(locations).map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City *
              </label>
              <select
                required
                value={formData.location.city}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, city: e.target.value },
                })}
                disabled={!formData.location.country}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
              >
                <option value="">Select City</option>
                {formData.location.country && locations[formData.location.country as keyof typeof locations]?.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category, Type, Experience */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as JobType })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Experience *
              </label>
              <select
                required
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value as ExperienceLevel })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="executive">Executive</option>
              </select>
            </div>
          </div>

          {/* Salary */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Min Salary *
              </label>
              <input
                type="number"
                required
                value={formData.salary.min || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  salary: { ...formData.salary, min: Number(e.target.value) },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Max Salary *
              </label>
              <input
                type="number"
                required
                value={formData.salary.max || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  salary: { ...formData.salary, max: Number(e.target.value) },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Currency *
              </label>
              <select
                required
                value={formData.salary.currency}
                onChange={(e) => setFormData({
                  ...formData,
                  salary: { ...formData.salary, currency: e.target.value },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="AED">AED</option>
                <option value="SAR">SAR</option>
                <option value="QAR">QAR</option>
                <option value="KWD">KWD</option>
                <option value="PKR">PKR</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Describe the role, responsibilities, and what you're looking for..."
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Requirements *
            </label>
            {formData.requirements.map((req, index) => (
              <input
                key={index}
                type="text"
                required={index === 0}
                value={req}
                onChange={(e) => updateRequirement(index, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder={`Requirement ${index + 1}`}
              />
            ))}
            <button
              type="button"
              onClick={addRequirement}
              className="text-sm text-red-600 hover:text-red-700 font-semibold"
            >
              + Add Requirement
            </button>
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Benefits
            </label>
            {formData.benefits.map((benefit, index) => (
              <input
                key={index}
                type="text"
                value={benefit}
                onChange={(e) => updateBenefit(index, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder={`Benefit ${index + 1}`}
              />
            ))}
            <button
              type="button"
              onClick={addBenefit}
              className="text-sm text-red-600 hover:text-red-700 font-semibold"
            >
              + Add Benefit
            </button>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Job'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
