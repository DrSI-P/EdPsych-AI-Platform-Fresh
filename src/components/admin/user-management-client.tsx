'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the actual component with SSR disabled
const AdminUserManagementContent = dynamic(
  () => import('@/components/admin/user-management'),
  { ssr: false }
);

export default function ClientPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-8 px-4">Loading user management...</div>}>
      <AdminUserManagementContent />
    </Suspense>
  );
}