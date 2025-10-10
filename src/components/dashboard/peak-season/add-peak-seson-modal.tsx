"use client";

import { useForm } from "react-hook-form";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";

interface AddPeakSeasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  create: any;
}

export default function AddPeakSeasonModal({
  isOpen,
  onClose,
  onCreated,
  create,
}: AddPeakSeasonModalProps) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      changeType: "nominal",
      changeValue: 100000,
      applyToAllProperties: true,
    },
  });

  const onSubmit = (data: any) => {
    create.mutate(
      { ...data, propertyIds: [] },
      {
        onSuccess: () => {
          reset();
          onClose();
          onCreated();
        },
        onError: () => toast.error("Failed to create peak season"),
      }
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Add Peak Season
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                {...register("name", { required: true })}
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="e.g. New Year Season"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  {...register("startDate", { required: true })}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  {...register("endDate", { required: true })}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Change Value (Nominal)
              </label>
              <input
                type="number"
                {...register("changeValue", {
                  required: true,
                  valueAsNumber: true,
                })}
                className="w-full border rounded-md px-3 py-2 text-sm"
                min={1}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition"
            >
              Create
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}