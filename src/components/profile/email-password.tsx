"use client";

import { useState, useEffect, ChangeEvent } from "react";
import {
  useMe,
  useUpdateEmail,
  useUpdatePassword,
} from "@/hooks/user-auth/profile/use-get-me";
import { Edit2, X, Check, Mail, Lock } from "lucide-react";

export default function UserEmailPasswordForm() {
  const { data: user, isLoading } = useMe();
  const updateEmail = useUpdateEmail();
  const updatePassword = useUpdatePassword();

  const [email, setEmail] = useState<string>("");
  const [initialEmail, setInitialEmail] = useState<string>("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email ?? "");
      setInitialEmail(user.email ?? "");
    }
  }, [user]);

  if (isLoading) return <p>Loading user data...</p>;

  // --- Email handlers ---
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  const handleSaveEmail = async () => {
    try {
      const updatedUser = await updateEmail.mutateAsync(email);
      setInitialEmail(email);
      setIsEditingEmail(false);
      alert("Email updated! Please check your inbox to verify your new email.");
    } catch (err) {
      console.error(err);
      alert("Failed to update email.");
    }
  };

  const handleDiscardEmail = () => {
    setEmail(initialEmail);
    setIsEditingEmail(false);
  };

  // --- Password handlers ---
  const handleCurrentPasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setCurrentPassword(e.target.value);
  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setNewPassword(e.target.value);

  const handleSavePassword = async () => {
    try {
      await updatePassword.mutateAsync({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setIsEditingPassword(false);
      alert("Password updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update password.");
    }
  };

  const handleDiscardPassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setIsEditingPassword(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-8">
      <h2 className="text-2xl font-bold">Account Settings</h2>

      {/* Email Form */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Mail size={20} /> Update Email
        </h3>

        {user?.isEmailVerified ? (
          <p className="text-green-600 font-medium">Email is verified</p>
        ) : (
          <p className="text-red-600 font-medium">Please verify your email!</p>
        )}

        {!isEditingEmail && (
          <button
            onClick={() => setIsEditingEmail(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
          >
            <Edit2 size={16} /> Edit
          </button>
        )}
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          disabled={!isEditingEmail}
          className={`w-full px-3 py-2 border rounded-lg ${
            !isEditingEmail
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : ""
          }`}
        />
        {isEditingEmail && (
          <div className="flex gap-4">
            <button
              onClick={handleSaveEmail}
              className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              <Check size={16} /> Save
            </button>
            <button
              onClick={handleDiscardEmail}
              className="flex items-center gap-2 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              <X size={16} /> Discard
            </button>
          </div>
        )}
      </div>

      {/* Password Form */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Lock size={20} /> Update Password
        </h3>
        {!isEditingPassword && (
          <button
            onClick={() => setIsEditingPassword(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
          >
            <Edit2 size={16} /> Edit
          </button>
        )}
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={handleCurrentPasswordChange}
          disabled={!isEditingPassword}
          className={`w-full px-3 py-2 border rounded-lg ${
            !isEditingPassword
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : ""
          }`}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={handleNewPasswordChange}
          disabled={!isEditingPassword}
          className={`w-full px-3 py-2 border rounded-lg ${
            !isEditingPassword
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : ""
          }`}
        />
        {isEditingPassword && (
          <div className="flex gap-4">
            <button
              onClick={handleSavePassword}
              className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              <Check size={16} /> Save
            </button>
            <button
              onClick={handleDiscardPassword}
              className="flex items-center gap-2 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              <X size={16} /> Discard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
