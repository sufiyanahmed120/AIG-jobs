'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Bell, User, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const exploreMenuRef = useRef<HTMLDivElement | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
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

          {/* Desktop Navigation Links */}
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
                    AIG Academy
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
            {isAuthenticated && user?.role === 'admin' && (
              <Link href="/admin" className="text-gray-700 hover:text-red-600 transition">
                Admin Panel
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Desktop Auth Buttons / User Menu */}
            <div className="hidden md:flex items-center space-x-4">
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

            {/* Mobile Menu Button - Visible only on small screens */}
            <div className="flex md:hidden items-center">
              <button
                type="button"
                className="text-gray-700 hover:text-red-600 p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-in slide-in-from-top-2">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {isAuthenticated && user?.role === 'job_seeker' && (
              <>
                <Link 
                  href="/" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/jobs" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Jobs
                </Link>
                <div className="px-3 py-2">
                  <div className="font-medium text-gray-700 mb-2">AIG Academy</div>
                  <div className="pl-4 space-y-1">
                    <Link
                      href="/courses"
                      className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-red-600 hover:bg-gray-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Courses
                    </Link>
                    <Link
                      href="/resources"
                      className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-red-600 hover:bg-gray-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Resources
                    </Link>
                    <Link
                      href="/labour-laws"
                      className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-red-600 hover:bg-gray-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Labour Laws
                    </Link>
                  </div>
                </div>
                <Link 
                  href="/my-applications" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Applications
                </Link>
              </>
            )}
            
            {isAuthenticated && user?.role === 'admin' && (
              <Link 
                href="/admin" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Panel
              </Link>
            )}

            {/* Mobile Auth Buttons */}
            <div className="border-t border-gray-100 pt-4 mt-4">
              {isAuthenticated ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 flex items-center space-x-3 text-gray-700">
                    <User className="w-5 h-5" />
                    <span className="font-medium">
                      {user?.name || 'User'}
                    </span>
                  </div>
                  <button
                    onClick={handleViewProfile}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50"
                  >
                    View Profile
                  </button>
                   {(user?.role === 'job_seeker' || user?.role === 'employer') && (
                    <button
                      onClick={handlePremium}
                      className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50"
                    >
                      Premium Membership
                    </button>
                   )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2 p-3">
                  <Link
                    href="/login"
                    className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full text-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
