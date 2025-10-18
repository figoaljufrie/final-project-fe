"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

const topLocations = [
  {
    id: 1,
    name: "Jakarta",
    properties: 156,
    image: "https://images.unsplash.com/photo-1555899434-94d1526a7abd?auto=format&fit=crop&w=800&q=80",
    gradient: "from-purple-500/80 to-pink-500/80"
  },
  {
    id: 2,
    name: "Bali",
    properties: 243,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    gradient: "from-blue-500/80 to-cyan-500/80"
  },
  {
    id: 3,
    name: "Bandung",
    properties: 89,
    image: "https://images.unsplash.com/photo-1601894273962-db77b6cd02c3?auto=format&fit=crop&w=800&q=80",
    gradient: "from-green-500/80 to-emerald-500/80"
  },
  {
    id: 4,
    name: "Surabaya",
    properties: 112,
    image: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=800&q=80",
    gradient: "from-orange-500/80 to-red-500/80"
  },
  {
    id: 5,
    name: "Yogyakarta",
    properties: 178,
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80",
    gradient: "from-rose-500/80 to-pink-500/80"
  },
];

export default function TopLocations() {
  const router = useRouter();

  const handleLocationClick = (locationName: string) => {
    router.push(`/explore?name=${encodeURIComponent(locationName)}`);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 rounded-full mb-4">
            <TrendingUp className="w-4 h-4 text-rose-600" />
            <span className="text-sm font-semibold text-rose-600">Trending Now</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Top Locations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the most popular destinations and find your perfect stay
          </p>
        </motion.div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {topLocations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => handleLocationClick(location.name)}
              className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Background Image */}
              <Image
                src={location.image}
                alt={location.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${location.gradient} opacity-60 group-hover:opacity-70 transition-opacity`} />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-white" />
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                      {location.name}
                    </h3>
                  </div>
                  <p className="text-white/90 text-sm font-medium">
                    {location.properties} properties
                  </p>
                </motion.div>

                {/* Hover Arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.div>
              </div>

              {/* Decorative Element */}
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {index + 1}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => router.push('/explore')}
            className="px-8 py-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            View All Locations
          </button>
        </motion.div>
      </div>
    </section>
  );
}