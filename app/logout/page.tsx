'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/services/auth.service';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    logout();
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p>Mengeluarkan akun...</p>
    </div>
  );
}