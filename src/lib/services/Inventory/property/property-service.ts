import api from "@/lib/api"; // Assuming '@/lib/api' is your Axios instance
import type {
  CreatePropertyPayload, // Assuming you define this type for updates
  PropertyDetail,
  PropertyListItem,
  PropertySearchQuery,
  PropertySearchResponse,
  UpdatePropertyPayload,
} from "@/lib/types/inventory/property-types"; // Adjust path as necessary

export async function createProperty(
  payload: CreatePropertyPayload
): Promise<PropertyDetail> {
  const { data } = await api.post("/tenant/properties", payload);
  return data.data;
}

export async function updateProperty(
  propertyId: number,
  payload: UpdatePropertyPayload
): Promise<PropertyDetail> {
  const { data } = await api.patch(`/tenant/properties/${propertyId}`, payload);
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
): Promise<any> {
  const { data } = await api.get(`/properties/${propertyId}/calendar`, {
    params: { month, year },
  });
  return data.data;
}

export async function getTenantProperties(): Promise<PropertyListItem[]> {
  const { data } = await api.get("/tenant/properties");
  return data.data;
}
