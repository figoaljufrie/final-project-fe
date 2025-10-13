// "use client";

// import { Button } from "@/components/ui/button";
// // import { MapProperty, mapProperties } from "@/mock-data/explore/mock-map";
// import { motion } from "framer-motion";
// import { Heart, MapPin, Maximize2, Star } from "lucide-react";
// import { useState } from "react";
// import Image from "next/image";

// export default function MapSection() {
//   // const [selectedProperty, setSelectedProperty] = useState<MapProperty | null>(
//   //   null
//   // );
//   // const [properties, setProperties] = useState<MapProperty[]>(mapProperties);
//   const [isFullscreen, setIsFullscreen] = useState(false);

//   const toggleSave = (id: number) => {
//     setProperties((prev) =>
//       prev.map((prop) =>
//         prop.id === id ? { ...prop, saved: !prop.saved } : prop
//       )
//     );
//   };

//   return (
//     <div
//       className={`relative ${
//         isFullscreen ? "fixed inset-0 z-50" : ""
//       } bg-white rounded-lg shadow-lg overflow-hidden`}
//     >
//       {/* Map Header */}
//       <div className="absolute top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-b border-[#D6D5C9] p-4">
//         <div className="flex items-center justify-between">
//           <h3 className="text-lg font-semibold text-[#8B7355]">
//             Property Locations
//           </h3>
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setIsFullscreen(!isFullscreen)}
//               className="border-[#D6D5C9]"
//             >
//               <Maximize2 size={16} />
//               {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Map Container */}
//       <div className="relative h-full pt-16 bg-gradient-to-br from-green-100 to-blue-100">
//         {/* Simulated Map Background */}
//         <div className="absolute inset-0 opacity-30">
//           <div className="w-full h-full bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200"></div>
//           <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
//         </div>

//         {/* Map Markers */}
//         {properties.map((property) => (
//           <motion.div
//             key={property.id}
//             className="absolute cursor-pointer"
//             style={{
//               // Simulate positioning based on coordinates
//               left: `${20 + property.id * 15}%`,
//               top: `${30 + property.id * 8}%`,
//             }}
//             whileHover={{ scale: 1.1 }}
//             onClick={() => setSelectedProperty(property)}
//           >
//             {/* Price Marker */}
//             <div
//               className={`
//               relative px-3 py-1 bg-white rounded-full shadow-lg border-2 transition-all
//               ${
//                 selectedProperty?.id === property.id
//                   ? "border-[#8B7355] bg-[#8B7355] text-white"
//                   : "border-white hover:border-[#8B7355]"
//               }
//             `}
//             >
//               <span className="text-sm font-semibold">${property.price}</span>

//               {/* Marker Point */}
//               <div
//                 className={`
//                 absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45
//                 ${
//                   selectedProperty?.id === property.id
//                     ? "bg-[#8B7355]"
//                     : "bg-white border-r border-b border-[#8B7355]"
//                 }
//               `}
//               ></div>
//             </div>
//           </motion.div>
//         ))}

//         {/* Property Details Popup */}
//         {selectedProperty && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//             className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl border border-[#D6D5C9] overflow-hidden z-10"
//           >
//             <div className="flex">
//               {/* Property Image */}
//               <div className="w-24 h-24 flex-shrink-0">
//                 <Image
//                   src={selectedProperty.image}
//                   alt={selectedProperty.name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>

//               {/* Property Info */}
//               <div className="flex-1 p-4">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h4 className="font-semibold text-gray-800 mb-1">
//                       {selectedProperty.name}
//                     </h4>
//                     <div className="flex items-center gap-1 mb-2">
//                       <MapPin size={12} className="text-gray-400" />
//                       <span className="text-sm text-gray-500">
//                         {selectedProperty.location}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="flex items-center gap-1">
//                         <Star
//                           size={12}
//                           className="fill-yellow-400 text-yellow-400"
//                         />
//                         <span className="text-sm">
//                           {selectedProperty.rating}
//                         </span>
//                       </div>
//                       <div>
//                         <span className="text-lg font-bold text-[#8B7355]">
//                           ${selectedProperty.price}
//                         </span>
//                         <span className="text-sm text-gray-500"> / night</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Save & View Buttons */}
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => toggleSave(selectedProperty.id)}
//                       className="p-2 rounded-full hover:bg-gray-100 transition-colors"
//                     >
//                       <Heart
//                         size={16}
//                         className={`${
//                           selectedProperty.saved
//                             ? "fill-red-500 text-red-500"
//                             : "text-gray-400"
//                         } transition-colors`}
//                       />
//                     </button>
//                     <Button
//                       size="sm"
//                       className="bg-[#8B7355] hover:bg-[#7A6349] text-white"
//                     >
//                       View Details
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Close button */}
//             <button
//               onClick={() => setSelectedProperty(null)}
//               className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
//             >
//               <svg
//                 width="16"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <line x1="18" y1="6" x2="6" y2="18"></line>
//                 <line x1="6" y1="6" x2="18" y2="18"></line>
//               </svg>
//             </button>
//           </motion.div>
//         )}

//         {/* Map Controls */}
//         <div className="absolute top-20 right-4 flex flex-col gap-2 z-10">
//           <Button
//             variant="outline"
//             size="sm"
//             className="w-10 h-10 p-0 bg-white border-[#D6D5C9]"
//           >
//             +
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             className="w-10 h-10 p-0 bg-white border-[#D6D5C9]"
//           >
//             -
//           </Button>
//         </div>

//         {/* Map Legend */}
//         <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-600">
//           <div className="flex items-center gap-2 mb-1">
//             <div className="w-3 h-3 bg-[#8B7355] rounded-full"></div>
//             <span>Selected Property</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-3 h-3 bg-white border-2 border-[#8B7355] rounded-full"></div>
//             <span>Available Properties</span>
//           </div>
//         </div>

//         {/* Fetch Maps API Notice */}
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center opacity-50">
//           <MapPin size={48} className="text-[#8B7355] mx-auto mb-2" />
//           <p className="text-[#8B7355] font-medium">Interactive Map</p>
//           <p className="text-sm text-gray-500">Powered by Maps API</p>
//         </div>
//       </div>
//     </div>
//   );
// }
