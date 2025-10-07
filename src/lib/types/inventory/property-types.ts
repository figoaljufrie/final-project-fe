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
}

export interface PropertyImage {
  url: string;
  altText: string | null;
  isPrimary: boolean;
}

export interface RoomForPropertyList {
  id: number;
  basePrice: number;
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
  category: PropertyCategory;
  minPrice: number | null;
  image: string | null;
}

export interface PropertySearchQuery {
  page?: number;
  limit?: number;
  name?: string;
  category?: PropertyCategory;
  sortBy?: PropertySortField;
  sortOrder?: PriceSort;
  checkInDate?: string;
  checkoutDate?: string;
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