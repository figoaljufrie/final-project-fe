export interface RoomImage {
  url: string;
  publicId: string;
  altText: string | null;
  isPrimary: boolean;
}

export interface RoomDetail {
  id: number;
  propertyId: number;
  name: string;
  capacity: number;
  basePrice: number;
  description: string | null;
  totalUnits: number;
  createdAt: Date;
  updatedAt: Date;
  images: RoomImage[];
}

export interface RoomListItem {
  id: number;
  propertyId: number;
  name: string;
  description: string | null;
  capacity: number;
  basePrice: number;
  totalUnits: number;
  image?: string | null;
}

export interface RoomImagePayload {
  file: File;
  altText: string;
  isPrimary: boolean;
  order: number;
}

export interface CreateRoomPayload {
  propertyId: number;
  name: string;
  capacity: number;
  basePrice: number;
  description?: string;
  totalUnits?: number;
  images?: RoomImagePayload[];
}

export interface UpdateRoomPayload {
  name?: string;
  capacity?: number;
  basePrice?: number;
  description?: string;
  totalUnits?: number;
}