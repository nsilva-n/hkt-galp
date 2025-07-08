'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SubmissionPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page - submission is now modal-only
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to home page...</p>
      </div>
    </div>
  );
}
