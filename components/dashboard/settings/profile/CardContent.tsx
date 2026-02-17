"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Form from "./Form";

export default function ProfileCardContent() {
  const [avatarUrl, setAvatarUrl] = useState("/images/dashboard/settings/profile.jpg");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user avatar on load
  useEffect(() => {
    const fetchUserAvatar = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("users")
          .select("avatar_url")
          .eq("auth_uid", user.id)
          .single();

        if (data?.avatar_url) {
          setAvatarUrl(data.avatar_url);
        }
      } catch (err) {
        console.error("Error fetching avatar:", err);
      }
    };

    fetchUserAvatar();
  }, []);

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be less than 2MB");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      const publicUrl = data.publicUrl;

      // Update user record with avatar URL
      const { error: updateError } = await supabase
        .from("users")
        .update({ avatar_url: publicUrl })
        .eq("auth_uid", user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
    } catch (err: any) {
      console.error("Error uploading avatar:", err);
      setError(err.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-6 pb-2">
      {/* Profile Photo */}
      <div className="flex items-center gap-x-3.5">
        <Image
          width={80}
          height={80}
          alt="profile-photo"
          src={avatarUrl}
          className="size-20 rounded-full object-cover"
        />

        <div className="flex flex-col justify-center items-start gap-y-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="border-2 border-black/10 rounded-lg text-[#1f2937] text-sm font-roboto font-medium px-4.25 py-2 hover:bg-gray-50 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Change Photo"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpg,image/jpeg,image/png,image/gif"
            onChange={handlePhotoChange}
            className="hidden"
            disabled={uploading}
          />
          <span className="text-sm text-[#6b7280] font-roboto">
            JPG, PNG or GIF. Max size 2MB
          </span>
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      </div>

      <div className="h-px bg-black/10" />

      <Form />
    </div>
  );
}
