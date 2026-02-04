import Link from 'next/link';
import { Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Jobs Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Jobs</h3>
            <ul className="space-y-2">
              <li><Link href="/jobs" className="hover:text-red-400 transition">Find jobs</Link></li>
              <li><Link href="/register" className="hover:text-red-400 transition">Register</Link></li>
              <li><Link href="/jobs" className="hover:text-red-400 transition">Jobs by Title</Link></li>
              <li><Link href="/profile" className="hover:text-red-400 transition">Build online CV</Link></li>
              <li><Link href="/resources" className="hover:text-red-400 transition">Career resources</Link></li>
            </ul>
          </div>

          {/* For Employers Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">For Employers</h3>
            <ul className="space-y-2">
              <li><Link href="/employer/post-job" className="hover:text-red-400 transition">Post a job</Link></li>
              <li><Link href="/employers" className="hover:text-red-400 transition">Search CV database</Link></li>
            </ul>
          </div>

          {/* Discover Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Discover</h3>
            <ul className="space-y-2">
              <li><Link href="/salaries" className="hover:text-red-400 transition">Salaries</Link></li>
              <li><Link href="/courses" className="hover:text-red-400 transition">Courses</Link></li>
              <li><Link href="/resources" className="hover:text-red-400 transition">Articles</Link></li>
            </ul>
          </div>

          {/* Other Services Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Other Services</h3>
            <ul className="space-y-2">
              <li><Link href="/affiliates" className="hover:text-red-400 transition">For affiliates</Link></li>
              <li><Link href="/training" className="hover:text-red-400 transition">For training providers</Link></li>
              <li><Link href="/hr" className="hover:text-red-400 transition">For HR professionals</Link></li>
            </ul>
          </div>

          {/* AGI Job Portal Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">AGI Job Portal</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-red-400 transition">About us</Link></li>
              <li><Link href="/contact" className="hover:text-red-400 transition">Contact us</Link></li>
              <li><Link href="/sitemap" className="hover:text-red-400 transition">Sitemap</Link></li>
            </ul>
          </div>

          {/* Follow Us & App Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Follow Us</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="hover:text-red-400 transition">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-red-400 transition">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Get our App</h3>
            <div className="space-y-2">
              <div className="bg-black px-4 py-2 rounded text-sm cursor-pointer hover:bg-gray-900 transition">
                GET IT ON Google Play
              </div>
              <div className="bg-black px-4 py-2 rounded text-sm cursor-pointer hover:bg-gray-900 transition">
                Download on the App Store
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2024 AGI Job Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
