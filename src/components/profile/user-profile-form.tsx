"use client";

import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image"; // ✅ Added import
import {
  useMe,
  useUpdateUser,
  useUpdateAvatar,
} from "@/hooks/user-auth/profile/use-get-me";
import type { User } from "@/lib/types/account/user-type";
import { User as UserIcon, Edit2, X, Check } from "lucide-react";

export default function UserProfileForm() {
  const { data: user, isLoading } = useMe();
  const updateUser = useUpdateUser();
  const updateAvatar = useUpdateAvatar();

  const [formData, setFormData] = useState<Partial<User>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [initialData, setInitialData] = useState<Partial<User>>({});
  const [initialAvatar, setInitialAvatar] = useState<string | null>(null);

  // Sync form data when user is loaded
  useEffect(() => {
    if (user) {
      const initial = {
        name: user.name,
        avatarUrl: user.avatarUrl,
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
        phoneNumber: user.phoneNumber,
        address: user.address,
        city: user.city,
        country: user.country,
      };
      setFormData(initial);
      setAvatarPreview(user.avatarUrl ?? null);
      setInitialData(initial);
      setInitialAvatar(user.avatarUrl ?? null);
    }
  }, [user]);

  if (isLoading) return <p>Loading profile...</p>;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Only set Date if value is a valid string, else undefined
    setFormData((prev) => ({
      ...prev,
      dateOfBirth: value ? new Date(value) : undefined,
    }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const updatedUserData = { ...formData }; // ✅ changed to const

      // 1️⃣ Upload avatar first if changed
      if (avatarFile) {
        const avatarUpdatedUser = await updateAvatar.mutateAsync(avatarFile);
        updatedUserData.avatarUrl = avatarUpdatedUser.avatarUrl;
        setAvatarPreview(avatarUpdatedUser.avatarUrl ?? null);
      }

      // 2️⃣ Update user info including avatarUrl
      await updateUser.mutateAsync(updatedUserData);

      // Save current state as initial for future discards
      setInitialData(updatedUserData);
      setInitialAvatar(updatedUserData.avatarUrl ?? null);

      setIsEditing(false);
      setAvatarFile(null);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    }
  };

  const handleDiscard = () => {
    setFormData(initialData);
    setAvatarPreview(initialAvatar);
    setAvatarFile(null);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      {/* Edit Button */}
      {!isEditing && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            <Edit2 size={16} /> Edit Profile
          </button>
        </div>
      )}

      {/* Avatar */}
      <div className="flex flex-col items-center space-y-4">
        {avatarPreview ? (
          <Image
            src={avatarPreview}
            alt={formData.name ?? "User Avatar"}
            width={128}
            height={128}
            className={`w-32 h-32 rounded-full object-cover border-4 border-rose-500 shadow-lg ${
              !isEditing ? "opacity-70" : ""
            }`}
          />
        ) : (
          <div
            className={`w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-br from-rose-100 to-rose-200 text-rose-600 border-4 border-rose-500 shadow-lg ${
              !isEditing ? "opacity-70" : ""
            }`}
          >
            <UserIcon size={48} />
          </div>
        )}
        {isEditing && (
          <div className="text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 transition-all duration-200"
            />
            <p className="text-xs text-gray-500 mt-1">Click to change profile picture</p>
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 gap-6">
        {[
          { label: "Name", name: "name", type: "text" },
          { label: "Date of Birth", name: "dateOfBirth", type: "date" },
          { label: "Phone Number", name: "phoneNumber", type: "text" },
          { label: "Address", name: "address", type: "textarea" },
          { label: "City", name: "city", type: "text" },
          { label: "Country", name: "country", type: "text" },
        ].map((field) => {
          const value = formData[field.name as keyof User];

          return (
            <div key={field.name} className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={
                    value !== undefined && value !== null ? String(value) : ""
                  }
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 ${
                    !isEditing
                      ? "bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                      : "border-gray-200 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 hover:border-gray-300"
                  }`}
                  rows={3}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={
                    field.type === "date" && value instanceof Date
                      ? value.toISOString().split("T")[0]
                      : value !== undefined &&
                        value !== null &&
                        typeof value !== "boolean"
                      ? String(value)
                      : ""
                  }
                  onChange={
                    field.type === "date" ? handleDateChange : handleChange
                  }
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 ${
                    !isEditing
                      ? "bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                      : "border-gray-200 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 hover:border-gray-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Save / Discard Buttons */}
      {isEditing && (
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            <Check size={16} /> Save Changes
          </button>
          <button
            onClick={handleDiscard}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold border-2 border-gray-200 hover:border-gray-300"
          >
            <X size={16} /> Discard Changes
          </button>
        </div>
      )}
    </div>
  );
}
