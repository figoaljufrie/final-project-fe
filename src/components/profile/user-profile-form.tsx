"use client";

import { useState, ChangeEvent, useEffect } from "react";
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
      let updatedUserData = { ...formData };

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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold">My Profile</h2>

      {/* Edit Button */}
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
        >
          <Edit2 size={16} /> Edit
        </button>
      )}

      {/* Avatar */}
      <div className="flex flex-col items-center space-y-2">
        {avatarPreview ? (
          <img
            src={avatarPreview}
            alt={formData.name ?? "User Avatar"}
            className={`w-32 h-32 rounded-full object-cover border-4 border-teal-600 ${
              !isEditing ? "opacity-70" : ""
            }`}
          />
        ) : (
          <div
            className={`w-32 h-32 rounded-full flex items-center justify-center bg-teal-200 text-teal-800 border-4 border-teal-600 ${
              !isEditing ? "opacity-70" : ""
            }`}
          >
            <UserIcon size={48} />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          disabled={!isEditing}
          className={`${!isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
        />
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 gap-4">
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
            <div key={field.name}>
              <label className="block font-medium">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={
                    value !== undefined && value !== null ? String(value) : ""
                  }
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    !isEditing
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : ""
                  }`}
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
                  className={`w-full px-3 py-2 border rounded-lg ${
                    !isEditing
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : ""
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Save / Discard Buttons */}
      {isEditing && (
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
          >
            <Check size={16} /> Save
          </button>
          <button
            onClick={handleDiscard}
            className="flex items-center gap-2 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            <X size={16} /> Discard Changes
          </button>
        </div>
      )}
    </div>
  );
}
