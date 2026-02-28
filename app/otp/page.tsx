"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function OTPPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const email = "";

  const handleOTPSubmission = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const {
        // data: { session },
        error: signInError,
      } = await supabase.auth.verifyOtp({
        email: email,
        token,
        type: "email",
      });

      if (signInError) throw signInError;

      // Successfully logged in
      router.push("/new-password");
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/forgot-password/forgotpasswordbg.png')",
      }}
    >
      {/* Left Side - Construction Site Image */}
      <div className="hidden lg:flex lg:w-[50%] relative">
        <Image
          src="/images/signin/construct.png"
          alt="Construction site with digital overlay"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full lg:w-[50%] items-center justify-center px-6 py-12 relative">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-lg px-8 py-10 relative">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Link
                href="/"
                className="inline-block transition-transform duration-200 hover:scale-105"
              >
                <Image
                  src="/images/sitebuilt.svg"
                  alt="SiteBuilt Logo"
                  width={120}
                  height={40}
                  className="h-auto"
                />
              </Link>
            </div>

            {/* Welcome Text */}
            <div className="text-center mb-8">
              <p className="text-gray-600 text-[1.125rem]">
                A verification OTP code has been sent to {email}. Kindly check
                your email and fill the input below with it.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form
              className="space-y-5 border p-6 rounded-2xl border-[#16a34a]/5 shadow-[0_1px_3px_#0000001a,0_1px_2px_-1px_#0000001a]"
              onSubmit={handleOTPSubmission}
            >
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Enter OTP code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="number"
                  pattern="^\d{6,8}$"
                  autoComplete="token"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="you@domain.com"
                  disabled={loading}
                />
              </div>

              {/* Request OTP Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Next..." : "Next"}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center text-sm">
              <span className="text-gray-600">New here? </span>
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
