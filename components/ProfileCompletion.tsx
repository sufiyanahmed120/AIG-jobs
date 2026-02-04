'use client';

import { useState } from 'react';
import { JobSeekerProfile, VisaStatus, NoticePeriod } from '@/types';
import {
  GULF_COUNTRIES,
  NATIONALITIES,
  VISA_STATUS_OPTIONS,
  NOTICE_PERIOD_OPTIONS,
  COMMON_SKILLS,
  PHONE_COUNTRY_CODES,
  CURRENCIES,
  calculateProfileCompleteness,
  validateProfileStep,
  getDefaultProfile,
} from '@/lib/profileUtils';
import { locations } from '@/lib/mockData';
import { User, Briefcase, FileText, Globe, X, Check, Plus } from 'lucide-react';
import Button from './Button';

interface ProfileCompletionProps {
  profile: Partial<JobSeekerProfile>;
  onSave: (profile: Partial<JobSeekerProfile>) => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, name: 'Personal Details', icon: User },
  { id: 2, name: 'Job Details', icon: Briefcase },
  { id: 3, name: 'Visa & Availability', icon: Globe },
  { id: 4, name: 'CV Upload', icon: FileText },
];

export default function ProfileCompletion({ profile, onSave, onCancel }: ProfileCompletionProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<JobSeekerProfile>>(profile || getDefaultProfile());
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [skillInput, setSkillInput] = useState('');

  const updateField = (section: keyof JobSeekerProfile, field: string, value: any) => {
    setFormData(prev => {
      const sectionData = (prev[section] as any) || {};
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: value,
        },
      };
    });
    // Clear errors for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const updateNestedField = (section: keyof JobSeekerProfile, path: string[], value: any) => {
    setFormData((prev) => {
      const sectionData = prev[section] || {};
      const newSectionData = { ...sectionData };
      let current: any = newSectionData;
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...current[path[i]] };
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return {
        ...prev,
        [section]: newSectionData,
      };
    });
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.jobDetails?.skills?.includes(skillInput.trim())) {
      updateField('jobDetails', 'skills', [
        ...(formData.jobDetails?.skills || []),
        skillInput.trim(),
      ]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    updateField(
      'jobDetails',
      'skills',
      formData.jobDetails?.skills?.filter((s) => s !== skill) || []
    );
  };

  const togglePreferredCountry = (countryValue: string, checked: boolean) => {
    const current = formData.jobPreferences?.preferredCountries || [];
    let next: string[];

    if (checked) {
      // Add if not already present
      next = current.includes(countryValue) ? current : [...current, countryValue];
    } else {
      // Remove if present
      next = current.filter((c) => c !== countryValue);
    }

    updateField('jobPreferences', 'preferredCountries', next);
  };

  const handleNext = () => {
    const validation = validateProfileStep(currentStep, formData);
    if (!validation.valid) {
      setErrors({ [currentStep.toString()]: validation.errors });
      return;
    }
    setErrors({});
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    const validation = validateProfileStep(currentStep, formData);
    if (!validation.valid) {
      setErrors({ [currentStep.toString()]: validation.errors });
      return;
    }

    const completeness = calculateProfileCompleteness(formData);
    const finalProfile = {
      ...formData,
      profileCompleteness: completeness,
      lastUpdated: new Date().toISOString(),
    };
    onSave(finalProfile);
  };

  const completeness = calculateProfileCompleteness(formData);
  const StepIcon = STEPS[currentStep - 1].icon;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
          <div className="text-right">
            <div className="text-sm text-gray-600">Profile Completeness</div>
            <div className="text-2xl font-bold text-red-600">{completeness}%</div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-red-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completeness}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      isCompleted
                        ? 'bg-red-600 border-red-600 text-white'
                        : isCurrent
                        ? 'border-red-600 text-red-600 bg-red-50'
                        : 'border-gray-300 text-gray-400'
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span
                    className={`text-xs mt-2 text-center ${
                      isCurrent ? 'text-red-600 font-semibold' : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 ${
                      isCompleted ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-6">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Details</h3>
              {errors['1'] && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <ul className="list-disc list-inside text-sm text-red-600">
                    {errors['1'].map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.personalDetails?.name || ''}
                    onChange={(e) => updateField('personalDetails', 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.personalDetails?.email || ''}
                    onChange={(e) => updateField('personalDetails', 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="md:col-span-2 grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country Code <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={formData.personalDetails?.phoneCountryCode || '+971'}
                      onChange={(e) => updateField('personalDetails', 'phoneCountryCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {PHONE_COUNTRY_CODES.map((code) => (
                        <option key={code.value} value={code.value}>
                          {code.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.personalDetails?.phone || ''}
                      onChange={(e) => updateField('personalDetails', 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="XX XXX XXXX"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nationality <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.personalDetails?.nationality || ''}
                    onChange={(e) => updateField('personalDetails', 'nationality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Select Nationality</option>
                    {NATIONALITIES.map((nat) => (
                      <option key={nat.value} value={nat.value}>
                        {nat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Country <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.personalDetails?.currentLocation?.country || ''}
                    onChange={(e) =>
                      updateNestedField('personalDetails', ['currentLocation', 'country'], e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Select Country</option>
                    {GULF_COUNTRIES.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current City <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.personalDetails?.currentLocation?.city || ''}
                    onChange={(e) =>
                      updateNestedField('personalDetails', ['currentLocation', 'city'], e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={!formData.personalDetails?.currentLocation?.country}
                    required
                  >
                    <option value="">Select City</option>
                    {formData.personalDetails?.currentLocation?.country &&
                      locations[formData.personalDetails.currentLocation.country as keyof typeof locations]?.map(
                        (city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        )
                      )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.personalDetails?.dateOfBirth || ''}
                    onChange={(e) => updateField('personalDetails', 'dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={formData.personalDetails?.gender || ''}
                    onChange={(e) => updateField('personalDetails', 'gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Job Details</h3>
              {errors['2'] && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <ul className="list-disc list-inside text-sm text-red-600">
                    {errors['2'].map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Role</label>
                  <input
                    type="text"
                    value={formData.jobDetails?.currentRole || ''}
                    onChange={(e) => updateField('jobDetails', 'currentRole', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Company</label>
                  <input
                    type="text"
                    value={formData.jobDetails?.currentCompany || ''}
                    onChange={(e) => updateField('jobDetails', 'currentCompany', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., ABC Company"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.jobDetails?.experienceYears || 0}
                    onChange={(e) =>
                      updateField('jobDetails', 'experienceYears', parseInt(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills <span className="text-red-600">*</span> (Minimum 3)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Type a skill and press Enter"
                    />
                    <Button onClick={addSkill} size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.jobDetails?.skills?.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.jobDetails?.skills?.length || 0} skills added (minimum 3 required)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Visa & Availability</h3>
              {errors['3'] && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <ul className="list-disc list-inside text-sm text-red-600">
                    {errors['3'].map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visa Status <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.visaAndAvailability?.visaStatus || 'no_visa'}
                    onChange={(e) =>
                      updateField('visaAndAvailability', 'visaStatus', e.target.value as VisaStatus)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    {VISA_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {(formData.visaAndAvailability?.visaStatus as VisaStatus | undefined) !== 'no_visa' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Visa Validity Date <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.visaAndAvailability?.visaValidityDate || ''}
                      onChange={e =>
                        updateField('visaAndAvailability', 'visaValidityDate', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      required={
                        (formData.visaAndAvailability?.visaStatus as VisaStatus | undefined) !==
                        'no_visa'
                      }
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notice Period <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.visaAndAvailability?.noticePeriod || '1_month'}
                    onChange={(e) =>
                      updateField('visaAndAvailability', 'noticePeriod', e.target.value as NoticePeriod)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    {NOTICE_PERIOD_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currently Employed <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.visaAndAvailability?.currentlyEmployed ? 'true' : 'false'}
                    onChange={(e) =>
                      updateField('visaAndAvailability', 'currentlyEmployed', e.target.value === 'true')
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
                  <input
                    type="date"
                    value={formData.visaAndAvailability?.availableFrom || ''}
                    onChange={(e) => updateField('visaAndAvailability', 'availableFrom', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">CV Upload & Preferences</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Countries
                  </label>
                  <div className="border border-gray-200 rounded-md p-3 max-h-40 overflow-y-auto">
                    {GULF_COUNTRIES.map((country) => {
                      const checked =
                        formData.jobPreferences?.preferredCountries?.includes(country.value) || false;
                      return (
                        <label
                          key={country.value}
                          className="flex items-center justify-between py-1 text-sm text-gray-700"
                        >
                          <span>{country.label}</span>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => togglePreferredCountry(country.value, e.target.checked)}
                            className="ml-2"
                          />
                        </label>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Select one or more Gulf countries you are interested in.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Roles
                  </label>
                  <input
                    type="text"
                    value={formData.jobPreferences?.preferredRoles?.join(', ') || ''}
                    onChange={(e) =>
                      updateField(
                        'jobPreferences',
                        'preferredRoles',
                        e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., Software Engineer, Product Manager"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary Expectation</label>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <select
                        value={formData.jobPreferences?.salaryExpectation?.currency || 'AED'}
                        onChange={(e) =>
                          updateNestedField('jobPreferences', ['salaryExpectation', 'currency'], e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        {CURRENCIES.map((curr) => (
                          <option key={curr.value} value={curr.value}>
                            {curr.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Min"
                        value={formData.jobPreferences?.salaryExpectation?.min || ''}
                        onChange={(e) =>
                          updateNestedField('jobPreferences', ['salaryExpectation', 'min'], parseInt(e.target.value) || 0)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Max"
                        value={formData.jobPreferences?.salaryExpectation?.max || ''}
                        onChange={(e) =>
                          updateNestedField('jobPreferences', ['salaryExpectation', 'max'], parseInt(e.target.value) || 0)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.jobPreferences?.willingToRelocate || false}
                          onChange={(e) => updateField('jobPreferences', 'willingToRelocate', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Willing to relocate</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload CV</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">PDF or DOC format (Max 5MB)</p>
                  <Button size="sm" variant="outline">
                    Choose File
                  </Button>
                  {formData.documents?.cvUrl && (
                    <p className="text-sm text-green-600 mt-2">CV uploaded successfully</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <div>
          {currentStep > 1 && (
            <Button onClick={handlePrevious} variant="outline">
              Previous
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          {currentStep < STEPS.length ? (
            <Button onClick={handleNext}>
              Next Step
            </Button>
          ) : (
            <Button onClick={handleSave}>
              Save Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
