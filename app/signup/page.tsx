"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    company: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      // Sign up with email and password
      const { data, error: signUpError } = await createClient().auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: formData.name,
            role: formData.role,
            company: formData.company || null,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (
        data.user &&
        data.user.identities &&
        data.user.identities.length === 0
      ) {
        setError("An account with this email already exists");
        setLoading(false);
        return;
      }

      if (data.user) {
        // Create user profile record
        try {
          await createClient()
            .from("users")
            .upsert(
              {
                id: crypto.randomUUID(),
                auth_uid: data.user.id,
                email: formData.email,
                full_name: formData.name,
                role: formData.role,
                company: formData.company || null,
              },
              { onConflict: "auth_uid" },
            );
        } catch (profileErr) {
          console.error("Error creating user profile:", profileErr);
        }

        setUserEmail(formData.email);
        setSuccess(true);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during signup",
      );
    } finally {
      setLoading(false);
    }
  };

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
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-lg p-6 relative">
            <div className="flex justify-center mb-2">
              <Link
                href="/"
                className="inline-block transition-transform duration-200 hover:scale-105"
              >
                <Image
                  src="/images/sitebuilt.svg"
                  alt="SiteBuilt Logo"
                  width={120}
                  height={40}
                  className="h-8.75"
                />
              </Link>
            </div>

            <div className="text-center mb-8">
              {/* <h1 className="text-2xl font-semibold text-gray-900">
                Create an account
              </h1> */}
              <p className="text-[#475569] text-base mt-2 leading-6">
                Start building clarity from the ground up.
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-green-800 mb-2">
                      Account created successfully!
                    </p>
                    <p className="text-sm text-green-700 mb-2">
                      A verification email has been sent to{" "}
                      <strong>{userEmail}</strong>
                    </p>
                    <p className="text-sm text-green-700">
                      Click the link in the email to verify your account.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-green-200">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-green-700 hover:text-green-600"
                  >
                    Go to login →
                  </Link>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {!success && (
              <form
                className="space-y-4 border px-8.25 pt-8.25 pb-8 my-8 rounded-2xl border-[#16a34a]/5 shadow-[0_1px_3px_#0000001a,0_1px_2px_-1px_#0000001a]"
                onSubmit={handleSignup}
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Work Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-12"
                      placeholder="Minimum 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-12"
                      placeholder="Re-enter your password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Role
                  </label>
                  <div className="relative">
                    <select
                      id="role"
                      name="role"
                      required
                      value={formData.role}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none pr-12"
                    >
                      <option value="">Select your role</option>
                      <option value="project-manager">Project Manager</option>
                      <option value="site-engineer">Site Engineer</option>
                      <option value="contractor">Contractor</option>
                      <option value="architect">Architect</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Company Name{" "}
                    <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Acme Inc."
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                  >
                    {loading ? "Creating account..." : "Create an account"}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>

                <div className="text-center text-xs text-gray-500 pt-2">
                  By creating an account, you agree to our{" "}
                  <Link href="/terms" className="text-blue-600">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600">
                    Privacy Policy
                  </Link>
                </div>
              </form>
            )}

            {!success && (
              <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">Already have an account? </span>
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
