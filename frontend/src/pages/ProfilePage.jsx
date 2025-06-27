import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Trash2 } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();

  // Local states for form editing
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [selectedImg, setSelectedImg] = useState(null);
  const [previewImg, setPreviewImg] = useState(authUser?.profilePic || "/Avatar.jpg");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Reset success/error on authUser change
  useEffect(() => {
    setFullName(authUser?.fullName || "");
    setPreviewImg(authUser?.profilePic || "/Avatar.jpg");
    setSelectedImg(null);
    setError(null);
    setSuccess(null);
  }, [authUser]);

  // Handle image selection and preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setSelectedImg(reader.result);
      setPreviewImg(reader.result);
      setError(null);
    };
  };

  // Remove selected image and reset preview to original
  const handleRemoveImage = () => {
    setSelectedImg(null);
    setPreviewImg("/Avatar.jpg");
    setError(null);
  };

  // Handle profile update submit
  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    if (!fullName.trim()) {
      setError("Full name cannot be empty");
      return;
    }

    try {
      await updateProfile({
        fullName: fullName.trim(),
        profilePic: selectedImg ?? authUser.profilePic,
      });
      setSelectedImg(null);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="h-screen pt-20 bg-base-100">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-sm text-base-content/60">Your profile information</p>
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={previewImg}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 border-base-200"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 cursor-pointer bg-base-content hover:scale-105 p-2 rounded-full duration-200 ${
                  isUpdatingProfile ? "cursor-not-allowed opacity-50" : ""
                }`}
                aria-label="Update profile picture"
              >
                <Camera className="w-5 h-5 text-base-content" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
              {previewImg !== "/Avatar.jpg" && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isUpdatingProfile}
                  aria-label="Remove profile picture"
                  className="absolute bottom-0 left-0 p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition duration-150"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* User Details - Editable Full Name */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label
                htmlFor="fullNameInput"
                className="text-sm text-zinc-400 flex items-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4" />
                Full Name
              </label>
              <input
                id="fullNameInput"
                type="text"
                className="w-full px-4 py-2.5 bg-base-200 rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isUpdatingProfile}
                maxLength={50}
                placeholder="Enter your full name"
                aria-invalid={error ? "true" : "false"}
                aria-describedby="error-message"
              />
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border truncate select-text">
                {authUser?.email || "N/A"}
              </p>
            </div>
          </div>

          {/* Account Information */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>
                  {authUser?.createdAt
                    ? new Date(authUser.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>

          {/* Error & Success messages */}
          {error && (
            <p id="error-message" className="text-red-500 text-center">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-500 text-center">{success}</p>
          )}

          {/* Save Button */}
          <div className="text-center mt-4">
            <button
              onClick={handleSave}
              disabled={isUpdatingProfile}
              className={`btn btn-primary px-6 ${
                isUpdatingProfile ? "loading" : ""
              }`}
              aria-live="polite"
            >
              {isUpdatingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
