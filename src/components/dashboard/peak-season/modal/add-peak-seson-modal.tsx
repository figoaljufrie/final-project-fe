"use client";

import { PriceChangeType } from "@/lib/types/enums/enums-type";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import PeakSeasonFormFields from "./peak-season-form";
import { parseLocalDate, formatLocalDate } from "@/lib/utils/calendar-utils";

export interface PeakSeasonFormData {
  name: string;
  startDate: string;
  endDate: string;
  changeType: "nominal" | "percentage";
  changeValue: number;
  applyToAllProperties: boolean;
  propertyIds: number[];
}

interface CreateMutation {
  mutate: (
    variables: PeakSeasonFormData,
    options?: { onSuccess?: () => void; onError?: (err: unknown) => void }
  ) => void;
}

interface AddPeakSeasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  create: CreateMutation;
  prefillAllProperties?: boolean;
}

export default function AddPeakSeasonModal({
  isOpen,
  onClose,
  onCreated,
  create,
  prefillAllProperties = true,
}: AddPeakSeasonModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PeakSeasonFormData>({
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      changeType: "nominal",
      changeValue: 100000,
      applyToAllProperties: prefillAllProperties,
      propertyIds: [],
    },
  });

  const watchChangeType = watch("changeType");
  const watchApplyToAll = watch("applyToAllProperties");

  const onSubmit: SubmitHandler<PeakSeasonFormData> = (data) => {
    const start = parseLocalDate(data.startDate);
    const end = parseLocalDate(data.endDate);

    if (end < start) {
      toast.error("End date cannot be before start date");
      return;
    }

    const payload: PeakSeasonFormData = {
      ...data,
      startDate: formatLocalDate(start),
      endDate: formatLocalDate(end),
      changeType:
        data.changeType === "nominal"
          ? PriceChangeType.NOMINAL
          : PriceChangeType.PERCENTAGE,
      propertyIds: data.applyToAllProperties
        ? []
        : data.propertyIds.map(Number),
    };

    create.mutate(payload, {
      onSuccess: () => {
        reset();
        onClose();
        onCreated();
      },
      onError: (err: unknown) => {
        console.error("Peak season create error:", err);
        const errorMessage =
          err &&
          typeof err === "object" &&
          "error" in err &&
          typeof err.error === "string"
            ? err.error
            : "Failed to create peak season";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <DialogTitle className="text-lg font-semibold">
              Add Peak Season
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <PeakSeasonFormFields
              register={register}
              watchChangeType={watchChangeType}
              watchApplyToAll={watchApplyToAll}
              errors={errors}
            />
            <button
              type="submit"
              className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition"
            >
              Create
            </button>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
