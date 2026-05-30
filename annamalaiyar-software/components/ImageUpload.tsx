"use client";

import { useState } from "react";
import { FiUpload, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
}

export default function ImageUpload({ onUpload, currentImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      onUpload(result.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gold-400">
        {currentImage ? "Change Image" : "Upload Image"}
      </label>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 px-5 py-3 bg-gold-500 text-black rounded-lg cursor-pointer hover:bg-gold-400 transition font-semibold">
          <FiUpload />
          <span>{uploading ? "Uploading..." : "Choose File"}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
        {currentImage && !uploading && (
          <span className="text-green-400 flex items-center gap-1">
            <FiCheckCircle /> Uploaded
          </span>
        )}
      </div>
      {currentImage && (
        <img
          src={currentImage}
          alt="Preview"
          className="h-24 rounded-xl border border-gold/20"
        />
      )}
    </div>
  );
}