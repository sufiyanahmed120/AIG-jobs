'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Bell, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const exploreMenuRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
  };

  const handlePremium = () => {
    if (!user) return;

    if (user.role === 'job_seeker') {
      router.push('/premium');
    } else if (user.role === 'employer') {
      router.push('/employer/premium');
    } else {
      router.push('/');
    }

    setIsProfileMenuOpen(false);
  };

  const handleViewProfile = () => {
    if (!user) return;

    if (user.role === 'job_seeker') {
      router.push('/profile');
    } else if (user.role === 'employer') {
      router.push('/employer/profile');
    } else if (user.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/');
    }

    setIsProfileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (exploreMenuRef.current && !exploreMenuRef.current.contains(event.target as Node)) {
        setIsExploreOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              <span className="text-blue-600">AIG</span>
              <span className="text-red-600"> Job Portal</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated && user?.role === 'job_seeker' && (
              <>
                <Link href="/" className="text-gray-700 hover:text-red-600 transition">
                  Home
                </Link>
                <Link href="/jobs" className="text-gray-700 hover:text-red-600 transition">
                  Jobs
                </Link>
                <div className="relative" ref={exploreMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsExploreOpen(prev => !prev)}
                    className="text-gray-700 hover:text-red-600 transition flex items-center"
                  >
                    Explore
                  </button>
                  {isExploreOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-40">
                      <Link
                        href="/courses"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Courses
                      </Link>
                      <Link
                        href="/resources"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Resources
                      </Link>
                      <Link
                        href="/labour-laws"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Labour Laws
                      </Link>
                    </div>
                  )}
                </div>
                <Link href="/my-applications" className="text-gray-700 hover:text-red-600 transition">
                  My Applications
                </Link>
              </>
            )}
            {/* Employer main nav items are in the sidebar dashboard; no top links needed here */}
            {isAuthenticated && user?.role === 'admin' && (
              <Link href="/admin" className="text-gray-700 hover:text-red-600 transition">
                Admin Panel
              </Link>
            )}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Notification bell */}
                <button
                  type="button"
                  className="relative p-2 text-gray-700 hover:text-red-600 transition"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                </button>

                {/* Profile dropdown */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsProfileMenuOpen(prev => !prev)}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                    aria-haspopup="true"
                    aria-expanded={isProfileMenuOpen}
                    aria-label="User menu"
                  >
                    <User className="w-5 h-5" />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                      {user?.name && (
                        <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                          <div className="mb-0.5">Signed in as</div>
                          <div className="font-medium text-gray-900 truncate">{user.name}</div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={handleViewProfile}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        View my profile
                      </button>
                      {(user?.role === 'job_seeker' || user?.role === 'employer') && (
                        <button
                          type="button"
                          onClick={handlePremium}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Premium
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Logout button (outside profile menu) */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-red-600 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:text-red-600 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
