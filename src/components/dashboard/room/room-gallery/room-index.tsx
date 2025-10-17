"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRoomGallery } from "@/hooks/Inventory/room/query/use-room-gallery";
import {
  useRoomImageHandlers,
  LocalImage,
} from "@/hooks/Inventory/images/room/use-room-image-handler";

import GalleryGrid from "./gallery-grid";
import GalleryActions from "./gallery-actions";
import Lightbox from "./room-lightbox";

interface RoomGalleryProps {
  roomId: number;
  propertyId: number;
}

export default function RoomGallery({ roomId, propertyId }: RoomGalleryProps) {
  const {
    images: fetchedImages,
    isLoading,
    refetch,
  } = useRoomGallery({ roomId, propertyId });

  const [localImages, setLocalImages] = useState<LocalImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { uploadImages, updateImages, deleteImage, isUploading } =
    useRoomImageHandlers({
      propertyId,
      roomId,
      setLocalImages,
    });

  useEffect(() => {
    if (fetchedImages && fetchedImages.length > 0) {
      setLocalImages(
        fetchedImages.map((img) => ({
          id: img.id ?? Math.random(),
          url: img.url,
          isPrimary: img.isPrimary,
          isNew: false,
        }))
      );
    }
  }, [fetchedImages]);

  const allPreviewImages: LocalImage[] = [
    ...localImages,
    ...newImages.map(
      (file, i): LocalImage => ({
        id: -(i + 1),
        url: URL.createObjectURL(file),
        isPrimary: false,
        isNew: true,
      })
    ),
  ];

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % allPreviewImages.length);
  const prevImage = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? allPreviewImages.length - 1 : prev - 1
    );

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;
    const selected = Array.from(files);
    const totalImages = localImages.length + newImages.length + selected.length;
    if (totalImages > 5) {
      alert("Maximum 5 images allowed per room");
      return;
    }
    setNewImages((prev) =>
      [...prev, ...selected].slice(0, 5 - localImages.length - prev.length)
    );
  };

  const handleAddImageClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = (e) =>
      handleFileChange((e.target as HTMLInputElement).files);
    input.click();
  };

  const handleUpload = async () => {
    if (!newImages.length) return;
    try {
      setIsSubmitting(true);
      await uploadImages(newImages);
      setNewImages([]);
      await refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAll = async () => {
    if (
      !confirm(
        "Are you sure you want to delete all images? This action cannot be undone."
      )
    )
      return;
    try {
      for (const img of localImages) {
        if (!img.isNew) await deleteImage(img.id);
      }
      setLocalImages([]);
      setNewImages([]);
      await refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetPrimary = async (id: number) => {
    await updateImages(id);
    await refetch();
  };

  const handleDeleteSingle = async (id: number, isNew: boolean) => {
    if (isNew) {
      setNewImages((prev) => prev.filter((_, idx) => -(idx + 1) !== id));
    } else {
      await deleteImage(id);
      await refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 border border-dashed rounded-xl bg-gray-50">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-2 text-sm text-gray-500">Loading gallery...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <GalleryGrid
        allPreviewImages={allPreviewImages}
        openLightbox={(index) => {
          setCurrentImageIndex(index);
          setLightboxOpen(true);
        }}
      />

      <GalleryActions
        allPreviewImages={allPreviewImages}
        localImages={localImages}
        newImages={newImages}
        handleAddImageClick={handleAddImageClick}
        handleUpload={handleUpload}
        handleDeleteAll={handleDeleteAll}
        handleSetPrimary={handleSetPrimary}
        isSubmitting={isSubmitting}
        isUploading={isUploading}
      />

      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            allPreviewImages={allPreviewImages}
            currentImageIndex={currentImageIndex}
            closeLightbox={() => setLightboxOpen(false)}
            nextImage={nextImage}
            prevImage={prevImage}
            handleSetPrimary={handleSetPrimary}
            handleDeleteSingle={handleDeleteSingle}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
