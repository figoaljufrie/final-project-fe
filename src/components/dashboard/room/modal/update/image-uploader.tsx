import { Loader2 } from "lucide-react";
import { updateRoomImages } from "@/lib/services/Inventory/room/room-service";
import type { RoomImagePayload } from "@/lib/types/inventory/room-type";
import { QueryClient } from "@tanstack/react-query";

interface Props {
  propertyId: number;
  roomId: number;
  existingImages: {
    id?: number;
    url: string;
    altText?: string;
    isPrimary?: boolean;
  }[];
  setExistingImages: React.Dispatch<
    React.SetStateAction<
      { id?: number; url: string; altText?: string; isPrimary?: boolean }[]
    >
  >;
  newImages: File[];
  setNewImages: React.Dispatch<React.SetStateAction<File[]>>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  queryClient: QueryClient;
}

export default function ImageUploader({
  propertyId,
  roomId,
  existingImages,
  setExistingImages,
  newImages,
  setNewImages,
  isSubmitting,
  setIsSubmitting,
  queryClient,
}: Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);

    const totalImages =
      existingImages.length + newImages.length + selected.length;
    if (totalImages > 5) {
      alert("Maximum 5 images allowed per room");
      return;
    }

    setNewImages((prev) => [...prev, ...selected].slice(0, 5));
  };

  const handleImageUpload = async () => {
    if (newImages.length === 0) {
      alert("No new images selected");
      return;
    }

    try {
      setIsSubmitting(true);

      const imagePayload: RoomImagePayload[] = newImages.map((file, i) => ({
        file,
        altText: file.name,
        isPrimary: existingImages.length === 0 && i === 0,
        order: existingImages.length + i,
      }));

      const updatedRoom = await updateRoomImages(
        propertyId,
        roomId,
        imagePayload
      );

      const mergedImages = [
        ...existingImages,
        ...updatedRoom.images.map((img: unknown) => {
          if (typeof img === "string") return { url: img };
          if (typeof img === "object" && img !== null && "url" in img)
            return img as { url: string; [key: string]: unknown };
          return { url: "" };
        }),
      ];

      setExistingImages(mergedImages.slice(0, 5));
      setNewImages([]);

      await queryClient.invalidateQueries({
        queryKey: ["room", propertyId, roomId],
      });

      console.log("✅ Room images appended successfully");
    } catch (err) {
      console.error("❌ Failed to upload images:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 border p-4 rounded-lg bg-gray-50">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Add New Photos (max 5)
      </label>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700"
      />

      <div className="flex gap-2 mt-2 flex-wrap">
        {newImages.map((file, i) => (
          <span
            key={i}
            className="bg-rose-100 text-rose-700 text-xs px-2 py-1 rounded"
          >
            {file.name}
          </span>
        ))}
      </div>

      <button
        type="button"
        disabled={isSubmitting}
        onClick={handleImageUpload}
        className="mt-3 inline-flex items-center justify-center bg-rose-600 text-white rounded-md px-4 py-2 hover:bg-rose-700 disabled:opacity-50"
      >
        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Upload Images
      </button>
    </div>
  );
}
