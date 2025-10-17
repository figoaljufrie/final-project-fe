import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Star, Trash2 } from "lucide-react";
import { LocalImage } from "@/hooks/Inventory/images/room/use-room-image-handler";

interface LightboxProps {
  allPreviewImages: LocalImage[];
  currentImageIndex: number;
  closeLightbox: () => void;
  nextImage: () => void;
  prevImage: () => void;
  handleSetPrimary: (id: number) => void;
  handleDeleteSingle: (id: number, isNew: boolean) => void;
}

export default function Lightbox({
  allPreviewImages,
  currentImageIndex,
  closeLightbox,
  nextImage,
  prevImage,
  handleSetPrimary,
  handleDeleteSingle,
}: LightboxProps) {
  if (!allPreviewImages[currentImageIndex]) return null;

  const img = allPreviewImages[currentImageIndex];

  return (
    <motion.div
      key="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
      onClick={closeLightbox}
    >
      {/* Close button */}
      <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white hover:bg-white/20 z-20 w-12 h-12" onClick={closeLightbox}>
        <X size={28} />
      </Button>

      {/* Navigation */}
      {allPreviewImages.length > 1 && (
        <>
          <Button variant="ghost" size="icon" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-20 w-12 h-12" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
            <ChevronLeft size={36} />
          </Button>
          <Button variant="ghost" size="icon" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-20 w-12 h-12" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
            <ChevronRight size={36} />
          </Button>
        </>
      )}

      {/* Image */}
      <motion.div
        key={img.id}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-6xl max-h-[85vh] mx-4 relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full">
          <Image src={img.url} alt="Room view" fill className="object-contain" sizes="90vw" />
        </div>
      </motion.div>

      {/* Counter & actions */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/70 px-6 py-3 rounded-full backdrop-blur-sm">
        <span className="text-white text-sm font-medium">{currentImageIndex + 1} / {allPreviewImages.length}</span>

        {!img.isPrimary && !img.isNew && (
          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleSetPrimary(img.id); }} className="text-yellow-400 hover:text-yellow-300 hover:bg-white/10">
            <Star className="w-4 h-4 mr-1" /> Set Primary
          </Button>
        )}

        <Button size="sm" variant="ghost" onClick={(e) => {
          e.stopPropagation();
          handleDeleteSingle(img.id, img.isNew ?? false);
        }} className="text-red-400 hover:text-red-300 hover:bg-white/10">
          <Trash2 className="w-4 h-4 mr-1" /> Delete
        </Button>
      </div>
    </motion.div>
  );
}