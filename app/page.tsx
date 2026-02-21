'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push('/mypage'), 800);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans">
      <h1 className="text-3xl font-bold mb-12 tracking-widest uppercase">Contents Card</h1>
      <form onSubmit={handleSignIn} className="w-full max-w-sm space-y-4">
        <input type="text" placeholder="Name" className="w-full p-4 bg-zinc-900 rounded-xl outline-none text-white focus:ring-2 focus:ring-emerald-500" required />
        <input type="password" placeholder="Password" className="w-full p-4 bg-zinc-900 rounded-xl outline-none text-white focus:ring-2 focus:ring-emerald-500" required />
        <button className="w-full bg-emerald-500 text-black p-4 rounded-xl font-bold active:scale-95 transition-transform mt-8">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
