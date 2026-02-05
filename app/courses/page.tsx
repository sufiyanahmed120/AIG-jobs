'use client';

import { BookOpen, Briefcase, Code, Mic, Users } from 'lucide-react';

type Course = {
  id: string;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  focus: string;
  description: string;
};

const COURSES: Course[] = [
  {
    id: 'interview-mastery',
    title: 'Interview Cracks Masterclass',
    icon: Mic,
    duration: '4 weeks · Live & recorded',
    level: 'Intermediate',
    focus: 'Interview Skills',
    description:
      'Structured training to help you answer real interview questions, build confidence, and avoid common mistakes in Gulf and international interviews.',
  },
  {
    id: 'soft-skills',
    title: 'Soft Skills for Job Seekers',
    icon: Users,
    duration: '3 weeks · Practice based',
    level: 'Beginner',
    focus: 'Communication & Workplace Skills',
    description:
      'Improve communication, teamwork, time management, and workplace professionalism to stand out in any role or country.',
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Fundamentals',
    icon: BookOpen,
    duration: '6 weeks · Hands-on projects',
    level: 'Beginner',
    focus: 'Marketing & Growth',
    description:
      'Cover SEO, social media, performance marketing, and content strategy designed for Gulf businesses and global online brands.',
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud Basics',
    icon: Code,
    duration: '6 weeks · Project based',
    level: 'Intermediate',
    focus: 'IT & Cloud',
    description:
      'Learn CI/CD pipelines, Docker, basic Kubernetes, and cloud concepts to prepare for modern DevOps and site reliability roles.',
  },
  {
    id: 'job-ready',
    title: 'Job-Ready Portfolio Builder',
    icon: Briefcase,
    duration: '2 weeks · Fast track',
    level: 'Beginner',
    focus: 'CV & Profile',
    description:
      'Create a professional CV, LinkedIn profile, and portfolio tailored to Gulf market expectations and recruiter screening tools.',
  },
];

export default function CoursesPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            AIG Academy Courses
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Practical, job-focused learning designed for Gulf and international opportunities.
            Choose a course to build the skills employers are actively looking for.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map((course) => {
            const Icon = course.icon;
            return (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mr-3">
                    <Icon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{course.title}</h2>
                    <p className="text-xs text-red-600 font-medium mt-0.5">{course.focus}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 flex-1 mb-4">{course.description}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                    {course.duration}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                    Level: {course.level}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

