'use client';

import React, { useEffect, useState } from "react";
import LayoutTemplate from "@/components/layout";
import { Save, Upload, Trash2, Lightbulb } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UpdateUserDataPayload, User } from "@/types/user";
import storageService from "@/services/storage_service";
import userService from "@/services/user_service";
import Toast from "@/components/toast";
import cookiesService from "@/services/cookies_service";

export default function EditProfile() {
    const router = useRouter();

    /* =======================
       State
    ======================= */
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [photoProfileUrl, setPhotoProfileUrl] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    // Store old photo to delete after successful update
    const [oldPhotoUrl, setOldPhotoUrl] = useState<string | null>(null);

    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const MAX_LENGTH = 20;

    /* =======================
       Fetch User
    ======================= */
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me", {
                    cache: "no-store",
                });

                const { user } = await res.json();
                if (!user) return;

                setUser(user);
                setFirstName(user.first_name);
                setLastName(user.last_name ?? "");

                if (user.photo_profile) {
                    setPhotoProfileUrl(
                        `${process.env.NEXT_PUBLIC_STORAGE_URL}${user.photo_profile}`
                    );
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    /* =======================
       Image Upload
    ======================= */
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please upload a valid image");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be under 5MB");
            return;
        }

        // Save old photo before replacing
        if (user?.photo_profile && !oldPhotoUrl) {
            setOldPhotoUrl(user.photo_profile);
        }

        setPhotoFile(file);
        setPhotoProfileUrl(URL.createObjectURL(file));
    };

    const handleDeletePhoto = () => {
        setPhotoFile(null);
        setPhotoProfileUrl(null);
    };

    /* =======================
       Save Profile
    ======================= */
    const onSave = async () => {
        if (!user) return;

        const token = cookiesService.getCookie("login_data");
        if (!token) {
            alert("Authentication required");
            return;
        }

        let uploadedUrls: string[] = [];
        let finalPhotoUrl = user.photo_profile ?? "";

        try {
            /* 1️⃣ Upload new photo if exists */
            if (photoFile) {
                const uploadResult = await storageService.uploadFiles([photoFile]);

                if (!uploadResult.success || !uploadResult.data?.length) {
                    throw new Error("Image upload failed");
                }

                uploadedUrls = uploadResult.data.map(item => item.file_url);
                finalPhotoUrl = uploadedUrls[0];
            }

            /* 2️⃣ Update user data */
            const payload: UpdateUserDataPayload = {
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                photo_profile_url: finalPhotoUrl,
            };

            const result = await userService.updateData(
                token,
                user.user_id,
                payload
            );

            if (!result.success) {
                throw new Error("Profile update failed");
            }

            /* 3️⃣ Delete old photo AFTER success */
            if (oldPhotoUrl) {
                await storageService.deleteFiles([oldPhotoUrl]);
                setOldPhotoUrl(null);
            }

            /* 4️⃣ Refresh user (NO CACHE) */
            const res = await fetch("/api/auth/me", {
                cache: "no-store",
            });

            const { user: updatedUser } = await res.json();
            if (!updatedUser) return;

            setUser(updatedUser);
            setFirstName(updatedUser.first_name);
            setLastName(updatedUser.last_name ?? "");

            if (updatedUser.photo_profile) {
                setPhotoProfileUrl(
                    `${process.env.NEXT_PUBLIC_STORAGE_URL}${updatedUser.photo_profile}?t=${Date.now()}`
                );
            } else {
                setPhotoProfileUrl(null);
            }

            // IMPORTANT: reset file state
            setPhotoFile(null);

            setToast({
                type: "success",
                message: "Profile updated successfully",
            });

        } catch (error) {
            console.error("Update profile error:", error);

            setToast({
                type: "error",
                message: "Failed to update profile",
            });

            /* 🔁 Rollback newly uploaded images */
            if (uploadedUrls.length > 0) {
                await storageService.deleteFiles(uploadedUrls);
            }
        }
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    /* =======================
       Render
    ======================= */
    return (
        <LayoutTemplate>
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-1">Edit Profile</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Manage your personal information
                </p>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Avatar */}
                    <div className="w-48 flex flex-col items-center gap-4">
                        <div className="relative w-40 h-40 rounded-full overflow-hidden bg-gray-100">
                            {photoProfileUrl ? (
                                <Image
                                    src={photoProfileUrl}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <span className="text-gray-400">No Photo</span>
                                </div>
                            )}
                        </div>

                        <label className="cursor-pointer flex gap-2 px-4 py-2 border rounded-lg">
                            <Upload size={16} />
                            Upload
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </label>

                        {photoProfileUrl && (
                            <button
                                onClick={handleDeletePhoto}
                                className="flex gap-2 px-4 py-2 border rounded-lg"
                            >
                                <Trash2 size={16} />
                                Remove
                            </button>
                        )}
                    </div>

                    {/* Form Section */}
                    <div className="flex-1 space-y-6">
                        <h3 className="text-base font-semibold text-gray-900">
                            Personal Information
                        </h3>

                        {/* Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={firstName}
                                    maxLength={MAX_LENGTH}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    {firstName.length}/{MAX_LENGTH}
                                </p>
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={lastName}
                                    maxLength={MAX_LENGTH}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    {lastName.length}/{MAX_LENGTH}
                                </p>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="border border-red-200 bg-red-50 rounded-lg p-4 sm:p-5 flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                    <Lightbulb className="w-5 h-5 text-red-600" />
                                </div>
                            </div>

                            <div className="text-sm text-gray-700">
                                <h4 className="font-semibold text-gray-900 mb-1">
                                    Why is this important?
                                </h4>
                                <p className="leading-relaxed">
                                    Our platform is built on trust. Help others get to know you better.
                                    Share a bit about your interests, favorite brands, books, movies,
                                    music, or food — and you’ll see the difference.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button
                        onClick={() => router.back()}
                        className="items-center cursor-pointer px-6 py-2 border rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        className="cursor-pointer items-center px-6 py-2 bg-red-600 text-white rounded-lg flex gap-2"
                    >
                        <Save size={16} />
                        Save Changes
                    </button>
                </div>
            </div>
        </LayoutTemplate>
    );
}
