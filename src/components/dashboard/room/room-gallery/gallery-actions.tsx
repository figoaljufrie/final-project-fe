import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Star, Trash2, Loader2, Upload } from "lucide-react";
import { LocalImage } from "@/hooks/Inventory/images/room/use-room-image-handler";

interface GalleryActionsProps {
  allPreviewImages: LocalImage[];
  localImages: LocalImage[];
  newImages: File[];
  handleAddImageClick: () => void;
  handleUpload: () => void;
  handleDeleteAll: () => void;
  handleSetPrimary: (id: number) => void;
  isSubmitting: boolean;
  isUploading: boolean;
}

export default function GalleryActions({
  allPreviewImages,
  localImages,
  newImages,
  handleAddImageClick,
  handleUpload,
  handleDeleteAll,
  handleSetPrimary,
  isSubmitting,
  isUploading,
}: GalleryActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center justify-between bg-gray-50 p-4 rounded-lg border">
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" onClick={handleAddImageClick} disabled={allPreviewImages.length >= 5} className="border-rose-600 text-rose-600 hover:bg-rose-50">
          <Plus className="w-4 h-4 mr-2" /> Add Images ({allPreviewImages.length}/5)
        </Button>

        {newImages.length > 0 && (
          <Button variant="default" onClick={handleUpload} disabled={isSubmitting || isUploading} className="bg-rose-600 hover:bg-rose-700">
            {(isSubmitting || isUploading) ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload {newImages.length} New
              </>
            )}
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        {localImages.length > 0 && !localImages[0]?.isPrimary && (
          <Button variant="outline" onClick={() => handleSetPrimary(localImages[0].id)} className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
            <Star className="w-4 h-4 mr-1" /> Set First as Primary
          </Button>
        )}

        <Button variant="destructive" onClick={handleDeleteAll} disabled={localImages.length === 0 && newImages.length === 0} className="bg-red-600 hover:bg-red-700">
          <Trash2 className="w-4 h-4 mr-1" /> Delete All
        </Button>
      </div>
    </div>
  );
}