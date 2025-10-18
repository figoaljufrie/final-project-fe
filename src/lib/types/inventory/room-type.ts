export interface RoomImage {
  id: number;
  url: string;
  publicId: string;
  altText: string | null;
  isPrimary: boolean;
  order: number;
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

export interface RoomForPropertyList {
  id: number;
  basePrice: number;
  capacity: number;
}

export interface RoomWithAvailability extends RoomForPropertyList {
  name: string;
  totalUnits: number;
  calculatedPrice?: number | null;
  isAvailable?: boolean;
  bookedUnits?: number;
  images?: RoomImage[];
  description?: string | null;
}
