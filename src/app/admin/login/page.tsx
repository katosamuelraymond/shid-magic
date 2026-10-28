'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid admin credentials');
        setLoading(false);
        return;
      }

      // Successful login
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login request failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200">
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-800 text-white font-black text-xl mb-3 shadow-sm">
            S
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Shid<span className="text-emerald-700">Magic</span> Operations
          </h1>
          <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mt-1">
            Admin & Concierge Management Portal
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Restricted operator terminal for uploading client goods, managing subscriptions, and toggling merchant visibility.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Operator Access Passcode
            </label>
            <input
              type="password"
              required
              autoFocus
              placeholder="Enter passcode (e.g. shid2026)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-700 focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-800 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-emerald-900 transition disabled:opacity-50 shadow-sm"
          >
            {loading ? 'Verifying Passcode...' : 'Unlock Admin Dashboard'}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-4 text-center">
          <p className="text-[11px] text-slate-400">
            Passcode: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-bold">shid2026</code>
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            Subdomain: <span className="font-mono text-slate-500">admin.shidmagic.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
