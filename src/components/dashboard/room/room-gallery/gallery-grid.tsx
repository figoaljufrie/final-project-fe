"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function GalleryGrid({
  images,
  onImageClick,
}: {
  images: string[];
  onImageClick: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2 h-72 rounded-xl overflow-hidden">
      {/* Main Image */}
      <motion.button
        onClick={() => onImageClick(0)}
        className="col-span-2 row-span-2 relative group cursor-pointer"
        whileHover={{ scale: 1.02 }}
      >
        <Image
          src={images[0]}
          alt="Main room view"
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
          onClick={() => onImageClick(index + 1)}
          className="relative group cursor-pointer overflow-hidden"
          whileHover={{ scale: 1.02 }}
        >
          <Image
            src={image}
            alt={`Room view ${index + 2}`}
            fill
            className="object-cover"
            sizes="25vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        </motion.button>
      ))}
    </div>
  );
}