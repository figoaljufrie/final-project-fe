"use client";

import { motion } from "framer-motion";

const images = [
  "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1400&q=80",
];

export default function HeroCarousel() {
  return (
    <section className="relative h-[400px] overflow-hidden">
      <motion.div
        className="flex h-full"
        animate={{ x: ["0%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {images.concat(images).map((img, idx) => (
          <div key={idx} className="w-full h-full flex-shrink-0">
            <img
              src={img}
              alt="Hero"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          Find Your Next Stay
        </h1>
      </div>
    </section>
  );
}