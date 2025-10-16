"use client";

import { useUpdateProperty } from "@/hooks/Inventory/property/mutations/use-property-mutation";
import { useState } from "react";
import { Loader2, ImagePlus } from "lucide-react";
import Image from "next/image";

export default function PropertyImageUploader({
  propertyId,
  images = [],
}: {
  propertyId: number;
  images: { url: string; id: number }[];
}) {
  const [files, setFiles] = useState<File[]>([]);
  const { mutateAsync: updateProperty, isPending } = useUpdateProperty();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    await updateProperty({
      propertyId,
      payload: {},
      files,
    });
    setFiles([]);
  };

  return (
    <div className="flex flex-col items-end space-y-2">
      <div className="flex gap-2 flex-wrap">
        {images.map((img) => (
          <div
            key={img.id}
            className="w-16 h-16 relative rounded-md border overflow-hidden"
          >
            <Image src={img.url} alt="" fill className="object-cover" />
          </div>
        ))}
      </div>
      <label className="flex items-center gap-2 cursor-pointer text-rose-600 hover:text-rose-700 text-sm">
        <ImagePlus className="w-4 h-4" />
        <span>Add Images</span>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={isPending}
          className="inline-flex items-center px-3 py-1.5 text-sm bg-rose-600 text-white rounded-md hover:bg-rose-700"
        >
          {isPending && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
          Upload
        </button>
      )}
    </div>
  );
}
