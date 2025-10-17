import { useState } from "react";
import { useUpdateProperty } from "@/hooks/Inventory/property/mutations/use-property-mutation";
import type { PropertyDetail } from "@/lib/types/inventory/property-types";

export function usePropertyUpdate({
  property,
  onUpdated,
}: {
  property: PropertyDetail;
  onUpdated?: () => void;
}) {
  const [formData, setFormData] = useState({
    name: property.name || "",
    description: property.description || "",
    category: property.category || "apartment",
    city: property.city || "",
    province: property.province || "",
    address: property.address || "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const { mutateAsync: updateProperty, isPending } = useUpdateProperty();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProperty({
      propertyId: property.id,
      payload: formData,
      files,
    });
    if (onUpdated) onUpdated();
  };

  return {
    formData,
    files,
    isPending,
    handleChange,
    handleFileChange,
    handleSubmit,
  };
}