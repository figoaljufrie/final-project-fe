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
      // Execute the mutation without assigning unused variable
      await updateEmail.mutateAsync(email);
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
    <div className="max-w-2xl mx-auto p-8 space-y-8">

      {/* Email Form */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold flex items-center gap-3 text-gray-800">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center">
              <Mail size={16} className="text-white" />
            </div>
            Update Email
          </h3>
          {!isEditingEmail && (
            <button
              onClick={() => setIsEditingEmail(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              <Edit2 size={16} /> Edit
            </button>
          )}
        </div>

        {user?.isEmailVerified ? (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <Check size={12} className="text-white" />
            </div>
            <p className="text-green-700 font-medium">Email is verified</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <X size={12} className="text-white" />
            </div>
            <p className="text-red-700 font-medium">Please verify your email!</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            disabled={!isEditingEmail}
            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 ${
              !isEditingEmail
                ? "bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                : "border-gray-200 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 hover:border-gray-300"
            }`}
          />
        </div>

        {isEditingEmail && (
          <div className="flex gap-4 pt-2">
            <button
              onClick={handleSaveEmail}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              <Check size={16} /> Save Changes
            </button>
            <button
              onClick={handleDiscardEmail}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold border-2 border-gray-200 hover:border-gray-300"
            >
              <X size={16} /> Discard
            </button>
          </div>
        )}
      </div>

      {/* Password Form */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold flex items-center gap-3 text-gray-800">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center">
              <Lock size={16} className="text-white" />
            </div>
            Update Password
          </h3>
          {!isEditingPassword && (
            <button
              onClick={() => setIsEditingPassword(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              <Edit2 size={16} /> Edit
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Current Password</label>
            <input
              type="password"
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
              disabled={!isEditingPassword}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 ${
                !isEditingPassword
                  ? "bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                  : "border-gray-200 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 hover:border-gray-300"
              }`}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">New Password</label>
            <input
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              disabled={!isEditingPassword}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 ${
                !isEditingPassword
                  ? "bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                  : "border-gray-200 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 hover:border-gray-300"
              }`}
            />
          </div>
        </div>

        {isEditingPassword && (
          <div className="flex gap-4 pt-2">
            <button
              onClick={handleSavePassword}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              <Check size={16} /> Save Changes
            </button>
            <button
              onClick={handleDiscardPassword}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold border-2 border-gray-200 hover:border-gray-300"
            >
              <X size={16} /> Discard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
