import api from "@/lib/api"; // Assuming '@/lib/api' is your Axios instance
import type {
  CreatePropertyPayload, // Assuming you define this type for updates
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
