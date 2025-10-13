"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePropertyGallery } from "@/hooks/Inventory/property/use-property-gallery";

interface PropertyGalleryProps {
  propertyId: number; // changed to accept propertyId
}

export default function PropertyGallery({ propertyId }: PropertyGalleryProps) {
  const { images, isLoading } = usePropertyGallery(propertyId);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (isLoading || images.length === 0) return null; // wait for images

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-4 gap-2 h-96 rounded-xl overflow-hidden">
        {/* Main Image */}
        <motion.button
          onClick={() => openLightbox(0)}
          className="col-span-2 row-span-2 relative group cursor-pointer"
          whileHover={{ scale: 1.02 }}
        >
          <Image
            src={images[0]}
            alt="Main property view"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        </motion.button>

        {/* Side Images */}
        {images.slice(1, 5).map((image, index) => (
          <motion.button
            key={index}
            onClick={() => openLightbox(index + 1)}
            className="relative group cursor-pointer overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            <Image
              src={image}
              alt={`Property view ${index + 2}`}
              fill
              className="object-cover"
              sizes="25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

            {index === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold">
                  Show All Photos
                </span>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={closeLightbox}
            >
              <X size={24} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <ChevronLeft size={24} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <ChevronRight size={24} />
            </Button>

            <motion.div
              key={currentImageIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-5xl max-h-[80vh] mx-4 relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[currentImageIndex]}
                alt="Property view"
                fill
                className="object-contain rounded-lg"
                sizes="80vw"
              />
            </motion.div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>

            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    openLightbox(index);
                  }}
                  className={`relative w-12 h-8 rounded overflow-hidden border-2 transition-all flex-shrink-0 ${
                    index === currentImageIndex
                      ? "border-white"
                      : "border-transparent opacity-60 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="50px"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
