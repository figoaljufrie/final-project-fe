import api from "@/lib/api"; // Assuming '@/lib/api' is your Axios instance
import type {
  CreatePropertyPayload,
  GeocodingResult,
  NearbyProperty,
  NearbyPropertyQuery,
  PropertyDetail,
  PropertyListItem,
  PropertySearchQuery,
  PropertySearchResponse,
  UpdatePropertyPayload,
} from "@/lib/types/inventory/property-types";

export async function createProperty(
  payload: CreatePropertyPayload,
  files?: File[]
): Promise<PropertyDetail> {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("category", payload.category);

  if (files && files.length > 0) {
    files.forEach((file) => formData.append("images", file));
  }

  const { data } = await api.post("/tenant/properties", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function updateProperty(
  propertyId: number,
  payload: UpdatePropertyPayload,
  files?: File[]
): Promise<PropertyDetail> {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null)
      formData.append(key, String(value));
  });

  if (files && files.length > 0) {
    files.forEach((file) => formData.append("images", file));
  }

  const { data } = await api.patch(
    `/tenant/properties/${propertyId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data.data;
}

export async function deleteProperty(propertyId: number): Promise<void> {
  await api.delete(`/tenant/properties/${propertyId}`);
}

export async function searchProperties(
  params: PropertySearchQuery
): Promise<PropertySearchResponse> {
  const { data } = await api.get("properties/search", { params });
  return data.data;
}

export async function getPropertyDetails(
  propertyId: number,
  checkInDate?: string,
  checkoutDate?: string
): Promise<PropertyDetail> {
  const params: { checkInDate?: string; checkOutDate?: string } = {};

  if (checkInDate) params.checkInDate = checkInDate;
  if (checkoutDate) params.checkOutDate = checkoutDate;

  const { data } = await api.get(`/properties/${propertyId}`, { params });

  return data.data;
}

export async function getPropertyCalendar(
  propertyId: number,
  month: number,
  year: number
): Promise<Record<string, unknown>> {
  const { data } = await api.get(`/properties/${propertyId}/calendar`, {
    params: { month, year },
  });
  return data.data;
}

export async function getTenantProperties(): Promise<PropertyListItem[]> {
  const { data } = await api.get("/tenant/properties");
  return data.data;
}

export const getPublicProperties = async (
  filters: PropertySearchQuery
): Promise<PropertySearchResponse> => {
  const { data } = await api.get("/properties/search", { params: filters });
  return data.data;
};

//Search for properties near a specific coordinate
export async function searchNearbyProperties(
  params: NearbyPropertyQuery
): Promise<NearbyProperty[]> {
  const { data } = await api.get("/properties/nearby", {
    params: {
      latitude: params.latitude,
      longitude: params.longitude,
      radius: params.radius || 10,
      limit: params.limit || 20,
    },
  });
  return data.data;
}

/**
 * @param address*/
export async function geocodeAddress(
  address: string
): Promise<GeocodingResult> {
  const { data } = await api.get("/properties/geocode", {
    params: { address },
  });
  return data.data;
}

//Reverse geocode coordinates to get address
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<GeocodingResult> {
  const { data } = await api.get("/properties/reverse-geocode", {
    params: { latitude, longitude },
  });
  return data.data;
}

//Get user's current location using browser geolocation API

//Note: This requires HTTPS and user permission
export async function getCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
  accuracy: number;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}
