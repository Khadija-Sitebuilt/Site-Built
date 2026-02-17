"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Form() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch user data on load
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          setError("Failed to load user data");
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from("users")
          .select("full_name, email, phone_number")
          .eq("auth_uid", user.id)
          .single();

        if (fetchError) {
          console.error("Fetch error:", fetchError);
          setLoading(false);
          return;
        }

        if (data) {
          const nameParts = data.full_name ? data.full_name.split(" ") : ["", ""];
          setFormData({
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: data.email || "",
            phone: data.phone_number || "",
          });
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Not authenticated");
      }

      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      const { error: updateError } = await supabase
        .from("users")
        .update({
          full_name: fullName,
          email: formData.email,
          phone_number: formData.phone,
        })
        .eq("auth_uid", user.id);

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error saving changes:", err);
      setError(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSave}>
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
          Changes saved successfully!
        </div>
      )}

      <div className="flex gap-x-3">
        <div className="flex flex-col gap-y-1 text-sm font-roboto">
          <label htmlFor="firstName" className="font-medium">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={saving}
            className="text-[#1f2937] bg-[#f3f4f6] rounded-lg px-3 py-2 w-68.25 disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-y-1 text-sm font-roboto">
          <label htmlFor="lastName" className="font-medium">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={saving}
            className="text-[#1f2937] bg-[#f3f4f6] rounded-lg px-3 py-2 w-68.25 disabled:opacity-50"
          />
        </div>
      </div>

      <div className="flex flex-col gap-y-1 text-sm font-roboto">
        <label htmlFor="email" className="font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          disabled={saving}
          className="text-[#1f2937] bg-[#f3f4f6] rounded-lg px-3 py-2 w-full disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-y-1 text-sm font-roboto">
        <label htmlFor="phone" className="font-medium">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={saving}
          placeholder="+1 (555) 000-0000"
          className="text-[#1f2937] bg-[#f3f4f6] rounded-lg px-3 py-2 w-full disabled:opacity-50"
        />
      </div>

      <div className="flex justify-end gap-x-3 text-sm font-roboto font-medium">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-4 py-2 border-2 border-black/10 rounded-lg text-[#1f2937] hover:bg-gray-100 disabled:opacity-50"
          disabled={saving}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 text-white bg-linear-[191deg,#0088ff,#6155f5_100%] rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
