"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check for success message in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      // Already handled, just show the page
      return;
    }

    // If this page is accessed directly (not from forgot-password flow),
    // redirect to forgot-password or login
    const timer = setTimeout(() => {
      router.push("/forgot-password");
    }, 5000);

    return () => clearTimeout(timer);
  }, [mounted, router]);

  return (
    <div
      className="flex min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/signup/signupbg.png')" }}
    >
      <div className="hidden lg:flex lg:w-[50%] relative">
        <Image
          src="/images/signin/construct.png"
          alt="Construction site"
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
              <h1 className="text-2xl font-semibold text-gray-900">Password Reset</h1>
              <p className="text-gray-600 text-sm mt-2">
                To reset your password, please use the forgot password link and follow the OTP verification process.
              </p>
            </div>

            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                Redirecting to the password recovery process...
              </p>
            </div>

            <div className="text-center space-y-3">
              <Link
                href="/forgot-password"
                className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm block"
              >
                Go to Password Recovery
              </Link>

              <Link
                href="/login"
                className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 transition-all"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
