// app/components/explore/mock/map-properties.ts

export interface MapProperty {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  coordinates: { lat: number; lng: number };
  saved: boolean;
}

export const mapProperties: MapProperty[] = [
  { 
    id: 1, 
    name: "Ocean View Villa", 
    location: "Seminyak, Bali", 
    price: 320, 
    rating: 4.9, 
    image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80", 
    coordinates: { lat: -8.6905, lng: 115.1634 }, 
    saved: false 
  },
  { 
    id: 2, 
    name: "Modern Beach House", 
    location: "Canggu, Bali", 
    price: 280, 
    rating: 4.8, 
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80", 
    coordinates: { lat: -8.6470, lng: 115.1374 }, 
    saved: true 
  },
  { 
    id: 3, 
    name: "City Center Loft", 
    location: "Jakarta Central", 
    price: 85, 
    rating: 4.5, 
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80", 
    coordinates: { lat: -6.2088, lng: 106.8456 }, 
    saved: false 
  },
  { 
    id: 4, 
    name: "Tropical Paradise", 
    location: "Ubud, Bali", 
    price: 380, 
    rating: 4.7, 
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80", 
    coordinates: { lat: -8.5069, lng: 115.2624 }, 
    saved: false 
  },
  { 
    id: 5, 
    name: "Backpacker Haven", 
    location: "Yogyakarta", 
    price: 25, 
    rating: 4.0, 
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80", 
    coordinates: { lat: -7.7956, lng: 110.3695 }, 
    saved: false 
  },
];