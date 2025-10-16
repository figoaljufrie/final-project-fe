"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
        onClick={onClose}
      >
        <X size={24} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
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
          onNext();
        }}
      >
        <ChevronRight size={24} />
      </Button>

      <motion.div
        key={currentIndex}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-5xl max-h-[80vh] mx-4 relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[currentIndex]}
          alt="Room view"
          fill
          className="object-contain rounded-lg"
          sizes="80vw"
        />
      </motion.div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </motion.div>
  );
}