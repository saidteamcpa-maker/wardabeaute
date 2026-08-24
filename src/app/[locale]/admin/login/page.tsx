'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const router = useRouter();
  const locale = useLocale();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.replace(`/${locale}/admin`);
    } else {
      setError('Mot de passe incorrect');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-4">
      <form onSubmit={submit} className="card-wb w-full max-w-sm p-8">
        <h1 className="font-display text-2xl font-bold text-profond">Accès admin</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          className="input-wb mt-5"
          autoFocus
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary mt-5 w-full">
          {loading ? '…' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
