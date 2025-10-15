import { PropertyCategory } from "../enums/enums-type";

export enum PriceSort {
  ASC = "asc",
  DESC = "desc",
}

export enum PropertySortField {
  NAME = "name",
  CREATED_AT = "createdAt",
  PRICE = "price",
}

export interface CreatePropertyPayload {
  name: string;
  description: string;
  category: string;
}

export interface UpdatePropertyPayload {
  name?: string;
  slug?: string;
  description?: string;
  category?: PropertyCategory;
  city?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  published?: boolean;
}

export interface PropertyImage {
  url: string;
  altText: string | null;
  isPrimary: boolean;
}

export interface RoomForPropertyList {
  id: number;
  basePrice: number;
  capacity: number;
}

export interface PropertyDetail {
  id: number;
  tenantId: number;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  latitude: number | null;
  longitude: number | null;
  published: boolean;
  category: PropertyCategory;
  createdAt: Date;
  updatedAt: Date;
  images: PropertyImage[];
  rooms: RoomForPropertyList[];
}

export interface PropertyListItem {
  id: number;
  name: string;
  city: string | null;
  published: boolean;
  category: PropertyCategory;
  minPrice: number | null;
  rooms: RoomForPropertyList[];
  images?: PropertyImage[];
}

export interface PropertySearchQuery {
  page?: number;
  limit?: number;
  name?: string; // free text search
  city?: string; // <-- new
  category?: PropertyCategory;
  sortBy?: PropertySortField;
  sortOrder?: PriceSort;
  checkInDate?: string;
  checkOutDate?: string;
}

export interface PropertySearchResponse {
  properties: PropertyListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  city?: string;
  province?: string;
  country?: string;
}

export interface NearbyPropertyQuery {
  latitude: number;
  longitude: number;
  radius?: number; // in km
  limit?: number;
}

export interface NearbyProperty {
  id: number;
  name: string;
  city: string | null;
  province: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  category: PropertyCategory;
  distance: number; // in km
  minPrice: number | null;
  images: PropertyImage[];
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  city?: string;
  address?: string;
}
