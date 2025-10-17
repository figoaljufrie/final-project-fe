"use client";

import { motion } from "framer-motion";
import { Upload, Loader2 } from "lucide-react";

interface ImageUploadFormProps {
  files: File[];
  setFiles: (files: File[]) => void;
  handleUpload: (e: React.FormEvent) => void;
  isUploading: boolean;
  goBack: () => void;
}

export default function ImageUploadForm({
  files,
  setFiles,
  handleUpload,
  isUploading,
  goBack,
}: ImageUploadFormProps) {
  return (
    <motion.form
      onSubmit={handleUpload}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload Images
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
          className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
        />
        {files.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            {files.length} file(s) selected
          </p>
        )}
      </div>

      <div className="pt-4 flex justify-between">
        <button
          type="button"
          onClick={goBack}
          className="py-2 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={isUploading || files.length === 0}
          className="inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" /> Upload Images
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
}