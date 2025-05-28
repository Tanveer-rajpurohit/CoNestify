/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { Group } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    setError('Google Client ID is not configured. Please contact the administrator.');
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const handleSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;
    if (!token) {
      setError('Failed to retrieve Google token');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const decoded: any = jwtDecode(token);

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const { jwt } = await response.json();
        localStorage.setItem('authToken', jwt);
        document.cookie = `authToken=${jwt}; path=/;`;
        router.push('/workspace');
      } else {
        setError('Authentication failed');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Failed to authenticate');
    }
  };

  return (
    <div className="w-full min-h-screen relative">
      <div className="min-h-screen w-full flex items-center justify-center bg-[#ffffff] relative overflow-hidden">
        <div className="w-full max-w-6xl px-4 py-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 relative z-10">
          <div className="w-full lg:w-1/2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <h1 className="text-2xl font-bold">CoNestify</h1>
            </div>
            <h2 className="text-3xl font-semibold mb-2">Welcome Back</h2>
            <p className="text-gray-500 mb-8">
              Collaborate with your team, manage projects, and achieve more together.
            </p>
            <GoogleOAuthProvider clientId={clientId}>
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => setError('Google login failed')}
              />
            </GoogleOAuthProvider>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Protected by CoNestify
                </span>
              </div>
            </div>
            <div className="text-center text-sm text-gray-500">
              By continuing, you agree to our{" "}
              <a href="#" className="text-rose-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-rose-600 hover:underline">
                Privacy Policy
              </a>
            </div>
          </div>
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
              <Group className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-4xl font-bold mb-8">
              Why Choose CoNestify?
            </h2>
            <ul className="space-y-4 text-lg">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
                Seamless team collaboration
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
                Intuitive project management tools
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
                Real-time updates and notifications
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
                Customizable workflows to fit your needs
              </li>
            </ul>
          </div>
        </div>
        <div className="fixed inset-0 -z-0">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-emerald-50/50 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-rose-50/50 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>
      </div>
    </div>
  );
}