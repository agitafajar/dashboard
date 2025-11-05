'use client';

import { useQuery } from '@tanstack/react-query';
import { listUsers } from '@/services/user.service';

export default function UsersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users', { limit: 10 }],
    queryFn: () => listUsers({ limit: 10 }),
  });

  if (isLoading) return <div>Memuat...</div>;
  if (error) return <div>Gagal memuat data</div>;

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-xl font-semibold">Users (DummyJSON)</h1>
      <ul className="list-disc pl-5">
        {data?.users.map((u) => (
          <li key={u.id}>
            {u.firstName} {u.lastName} — {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}