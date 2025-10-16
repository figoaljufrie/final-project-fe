import {
  getRoomAvailabilityByDate,
  getRoomAvailabilityRange,
  setRoomAvailability,
} from "@/lib/services/Inventory/availability/availability-service";
import type { SetAvailabilityBody } from "@/lib/types/inventory/availability-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface UseAvailabilityParams {
  propertyId: number;
  roomId: number;
}

/**
 * Custom hook to handle room availability queries and mutations
 */
export function useRoomAvailability({
  propertyId,
  roomId,
}: UseAvailabilityParams) {
  const queryClient = useQueryClient();

  /**
   * Fetch availability range for given from/to dates
   * @param from start date
   * @param to end date
   */
  const useAvailabilityRange = (from: string, to: string) => {
    return useQuery({
      queryKey: ["availabilityRange", roomId, from, to],
      queryFn: () => getRoomAvailabilityRange(propertyId, roomId, from, to),
    });
  };

  /**
   * Fetch availability for a single date
   * @param date the date to fetch
   */
  const useAvailabilityByDate = (date: string) => {
    return useQuery({
      queryKey: ["availabilityByDate", roomId, date],
      queryFn: () => getRoomAvailabilityByDate(propertyId, roomId, date),
      enabled: !!date,
    });
  };

  /**
   * Mutation to update availability
   */
  const updateAvailability = useMutation({
    mutationFn: (payload: SetAvailabilityBody) =>
      setRoomAvailability(propertyId, roomId, payload),
    onSuccess: (_, payload) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["availabilityRange", roomId],
      });
      queryClient.invalidateQueries({
        queryKey: ["availabilityByDate", roomId, payload.date],
      });
    },
  });

  return {
    useAvailabilityRange,
    useAvailabilityByDate,
    updateAvailability,
  };
}
