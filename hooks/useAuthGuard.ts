'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/**
 * Simple authentication guard hook.
 * - If the user is not authenticated, redirects to /login with a ?redirect back to the current path.
 * - Uses router.replace so the protected page is removed from history.
 * - Safe dependency list to avoid infinite update loops.
 */
export function useAuthGuard() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isAuthenticated) return;

    const redirect = pathname || '/';
    router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
  }, [isAuthenticated, pathname, router]);
}

