import { useMemo } from "react";
import { usePropertyDetail } from "./use-property-detail";

export const usePropertyGallery = (propertyId: number) => {
  const { data, isLoading, isError, refetch } = usePropertyDetail(propertyId);

  const images = useMemo(() => {
    return data?.images.map((img) => img.url) ?? [];
  }, [data]);

  return { images, isLoading, isError, refetch };
};
