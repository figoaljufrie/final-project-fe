"use client";

import { useRoomGallery } from "@/hooks/Inventory/room/query/use-room-gallery";
import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import GalleryGrid from "./gallery-grid";
import AddImageButton from "./room-add-image";
import Lightbox from "./room-lightbox";

export default function RoomGallery({
  roomId,
  propertyId,
}: {
  roomId: number;
  propertyId: number;
}) {
  const { images, isLoading, addImage } = useRoomGallery({
    roomId,
    propertyId,
  });

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);
  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  if (isLoading)
    return <p className="text-sm text-gray-400">Loading photos...</p>;

  if (!images || images.length === 0)
    return (
      <div className="border rounded-xl p-6 flex flex-col items-center justify-center text-gray-500">
        <p>No images yet for this room.</p>
        <AddImageButton propertyId={propertyId} roomId={roomId} addImage={addImage}>
          <Plus className="w-4 h-4 mr-2" /> Add Image
        </AddImageButton>
      </div>
    );

  return (
    <>
      {/* Gallery Grid */}
      <GalleryGrid images={images} onImageClick={openLightbox} />

      {/* Add Image Button */}
      <AddImageButton propertyId={propertyId} roomId={roomId} addImage={addImage}>
        <Plus className="w-4 h-4 mr-2" /> Add or Replace Photo
      </AddImageButton>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={images}
            currentIndex={currentImageIndex}
            onClose={closeLightbox}
            onNext={nextImage}
            onPrev={prevImage}
          />
        )}
      </AnimatePresence>
    </>
  );
}