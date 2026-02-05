import Link from 'next/link';
import { Job } from '@/types';
import { MapPin, Briefcase, DollarSign, Clock } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';

interface JobCardProps {
  job: Job;
  showCompanyLogo?: boolean;
}

export default function JobCard({ job, showCompanyLogo = true }: JobCardProps) {
  const formatSalary = (salary: Job['salary']) => {
    // Use 'en-US' locale to ensure consistent formatting on server and client
    const formatNumber = (num: number) => num.toLocaleString('en-US');
    return `${salary.currency} ${formatNumber(salary.min)} - ${formatNumber(salary.max)}`;
  };

  const getExperienceColor = (exp: string) => {
    switch (exp) {
      case 'entry': return 'bg-green-100 text-green-800';
      case 'mid': return 'bg-blue-100 text-blue-800';
      case 'senior': return 'bg-purple-100 text-purple-800';
      case 'executive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link href={`/jobs/${job.slug}`} className="h-full">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 hover:border-red-300 h-full flex flex-col">
        <div className="flex items-start justify-between flex-1">
          <div className="flex-1">
            {/* Company Logo and Name */}
            <div className="flex items-center space-x-3 mb-3">
              {showCompanyLogo && job.companyLogo && (
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-600">
                    {job.companyName.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 hover:text-red-600 transition">
                  {job.title}
                </h3>
                <p className="text-gray-600">{job.companyName}</p>
              </div>
            </div>

            {/* Job Details */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location.city}, {job.location.country}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Briefcase className="w-4 h-4" />
                <span>{job.category}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span className="capitalize">{job.type.replace('-', ' ')}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getExperienceColor(job.experience)}`}>
                {job.experience.charAt(0).toUpperCase() + job.experience.slice(1)}
              </span>
              <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                {job.category}
              </span>
            </div>

            {/* Salary */}
            <div className="flex items-center space-x-1 text-red-600 font-semibold">
              <DollarSign className="w-4 h-4" />
              <span>{formatSalary(job.salary)}</span>
            </div>
          </div>

          {/* Posted Date */}
          <div className="text-right text-xs text-gray-500 ml-4">
            <p>Posted {formatDate(job.postedAt)}</p>
            {job.views > 0 && (
              <p className="mt-1">{job.views} views</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
