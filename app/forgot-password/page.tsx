"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        throw resetError;
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send password reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/signin/signinbg.png')" }}
    >
      <div className="hidden lg:flex lg:w-[50%] relative">
        <Image
          src="/images/signin/construct.png"
          alt="Construction site with digital overlay"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex w-full lg:w-[50%] items-center justify-center px-6 py-12 relative">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg px-8 py-10 relative">
            <div className="mb-4">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to sign in
              </Link>
            </div>

            <div className="flex justify-center mb-6">
              <Link href="/" className="inline-block transition-transform duration-200 hover:scale-105">
                <Image
                  src="/images/sitebuilt.svg"
                  alt="SiteBuilt Logo"
                  width={120}
                  height={40}
                  className="h-auto"
                />
              </Link>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-900">Forgot password?</h1>
              <p className="text-gray-600 text-sm mt-2">
                Enter your work email and we will send a password reset link.
              </p>
            </div>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  If an account exists for <strong>{email}</strong>, a reset link has been sent.
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Work Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="you@domain.com"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending reset link..." : "Send reset link"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
