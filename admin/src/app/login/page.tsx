'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';

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
        setError(data.error || 'Invalid administrator credentials');
        setLoading(false);
        return;
      }

      // Successful login
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login request failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] rounded-xl bg-white p-8 shadow-2xl border border-slate-200/80">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-lg shadow-sm">
            SM
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              ShidMagic Operations
            </h1>
            <p className="text-[12px] font-medium text-slate-500">
              Enterprise Control & Merchant Console
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Administrator Security Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter admin passcode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition"
              />
              <Lock className="absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2.5 px-4 text-xs font-semibold text-white hover:bg-blue-700 active:bg-blue-800 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign in to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Authorized access only • Encrypted session</span>
          </div>
        </div>
      </div>
    </div>
  );
}
