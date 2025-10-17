"use client";

import type { UploadedImageResult } from "@/lib/types/inventory/image-type";
import type { PropertyImage } from "@/lib/types/inventory/property-types";
import { ImagePlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { usePropertyImageHandlers } from "@/hooks/Inventory/images/property/use-property-image-handler";
import ImageGrid from "./image-grid";

export type LocalImage = {
  id: number;
  url: string;
  isPrimary?: boolean;
  isNew?: boolean;
};

export default function PropertyImageUploader({
  propertyId,
  images = [],
}: {
  propertyId: number;
  images: PropertyImage[];
}) {
  const maxImages = 5;

  const [files, setFiles] = useState<File[]>([]);
  const [localImages, setLocalImages] = useState<LocalImage[]>(
    images.map((img) => ({
      id: img.id,
      url: img.url,
      isPrimary: img.isPrimary,
    }))
  );

  const { uploadImages, updateImages, deleteImage, isUploading } =
    usePropertyImageHandlers({ propertyId, setLocalImages });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    const availableSlots = maxImages - localImages.length - files.length;
    if (availableSlots <= 0) return;
    setFiles((prev) => [...prev, ...selectedFiles.slice(0, availableSlots)]);
  };

  // Upload new files
  const handleUpload = async () => {
    if (files.length === 0) return;
    const response = await uploadImages(files);
    if (response) {
      setLocalImages((prev) => [
        ...prev,
        ...response.map((img: UploadedImageResult) => ({
          id: img.id,
          url: img.url,
          isPrimary: img.isPrimary,
        })),
      ]);
      setFiles([]);
    }
  };

  // Preview images
  const previewImages = [
    ...localImages.map((img) => ({ ...img, isNew: false })),
    ...files.map((file, idx) => ({
      id: -(idx + 1),
      url: URL.createObjectURL(file),
      isPrimary: false,
      isNew: true,
    })),
  ].slice(0, maxImages);

  return (
    <div className="flex flex-col items-end space-y-2 w-full">
      <ImageGrid
        images={previewImages}
        onDelete={deleteImage}
        onSetPrimary={updateImages}
      />

      {previewImages.length < maxImages && (
        <label className="flex items-center gap-2 cursor-pointer text-rose-600 hover:text-rose-700 text-sm mt-2">
          <ImagePlus className="w-4 h-4" />
          <span>Add Images</span>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}

      {files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="inline-flex items-center px-3 py-1.5 text-sm bg-rose-600 text-white rounded-md hover:bg-rose-700 mt-2"
        >
          {isUploading && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
          Upload
        </button>
      )}
    </div>
  );
}
