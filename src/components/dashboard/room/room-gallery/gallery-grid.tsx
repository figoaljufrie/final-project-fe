import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { LocalImage } from "@/hooks/Inventory/images/room/use-room-image-handler";

interface GalleryGridProps {
  allPreviewImages: LocalImage[];
  openLightbox: (index: number) => void;
}

export default function GalleryGrid({ allPreviewImages, openLightbox }: GalleryGridProps) {
  if (allPreviewImages.length === 0) return null;

  return (
    <div className="grid grid-cols-4 gap-3 rounded-xl overflow-hidden">
      {/* Main image */}
      <motion.div
        onClick={() => openLightbox(0)}
        className="col-span-2 row-span-2 relative group cursor-pointer rounded-lg overflow-hidden shadow-lg"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative w-full h-full min-h-[300px]">
          <Image src={allPreviewImages[0].url} alt="Main room view" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          {allPreviewImages[0].isPrimary && (
            <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
              <Star className="w-3 h-3 fill-current" /> Primary
            </div>
          )}
          {allPreviewImages[0].isNew && (
            <div className="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              New
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
        </div>
      </motion.div>

      {/* Thumbnail images */}
      {allPreviewImages.slice(1, 5).map((img, idx) => (
        <motion.div
          key={img.id}
          onClick={() => openLightbox(idx + 1)}
          className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md aspect-square"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Image src={img.url} alt={`Room view ${idx + 2}`} fill className="object-cover" sizes="25vw" />
          {img.isPrimary && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white p-1 rounded-full shadow-lg">
              <Star className="w-3 h-3 fill-current" />
            </div>
          )}
          {img.isNew && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-0.5 rounded-full text-[10px] font-semibold shadow-lg">
              New
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
        </motion.div>
      ))}
    </div>
  );
}