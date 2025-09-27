// app/components/explore/mock-properties.ts
export interface Property {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  saved: boolean;
  category: string;
  guests: number;
  amenities: string[];
}

export const exploreProperties: Property[] = [
  { id: 1, name: "Ocean View Villa", location: "Seminyak, Bali", price: 320, rating: 4.9, reviews: 128, image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", saved: false, category: "Villa", guests: 8, amenities: ["wifi", "coffee"] },
  { id: 2, name: "Modern Beach House", location: "Canggu, Bali", price: 280, rating: 4.8, reviews: 96, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", saved: true, category: "House", guests: 6, amenities: ["wifi", "coffee"] },
  { id: 3, name: "City Center Loft", location: "Jakarta Central", price: 85, rating: 4.5, reviews: 203, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", saved: false, category: "Apartment", guests: 2, amenities: ["wifi"] },
  { id: 4, name: "Tropical Paradise", location: "Ubud, Bali", price: 380, rating: 4.7, reviews: 112, image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", saved: false, category: "Villa", guests: 4, amenities: ["wifi", "coffee"] },
  { id: 5, name: "Modern Studio", location: "Jakarta Selatan", price: 65, rating: 4.3, reviews: 156, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", saved: false, category: "Apartment", guests: 2, amenities: ["wifi"] },
  { id: 6, name: "Backpacker Haven", location: "Yogyakarta", price: 25, rating: 4.0, reviews: 324, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", saved: false, category: "Hostel", guests: 1, amenities: ["wifi"] },
  { id: 7, name: "Sunset Villa", location: "Jimbaran, Bali", price: 290, rating: 4.6, reviews: 88, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", saved: true, category: "Villa", guests: 6, amenities: ["wifi", "coffee"] },
  { id: 8, name: "Skyline Apartment", location: "Jakarta Pusat", price: 95, rating: 4.4, reviews: 145, image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", saved: true, category: "Apartment", guests: 3, amenities: ["wifi", "coffee"] },
  { id: 9, name: "Social Hub Hostel", location: "Bandung", price: 30, rating: 4.2, reviews: 267, image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", saved: true, category: "Hostel", guests: 1, amenities: ["wifi", "coffee"] }
];