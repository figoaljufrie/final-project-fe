"use client";

import { useTenantProperties } from "@/hooks/Inventory/property/query/use-tenant-properties";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { PeakSeasonFormData } from "./add-peak-seson-modal";

interface Props {
  register: UseFormRegister<PeakSeasonFormData>;
  watchChangeType: "nominal" | "percentage";
  errors: FieldErrors<PeakSeasonFormData>;
  watchApplyToAll?: boolean;
}

export default function PeakSeasonFormFields({
  register,
  watchChangeType,
  errors,
  watchApplyToAll,
}: Props) {
  const { data: tenantProperties } = useTenantProperties();

  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          {...register("name", { required: true })}
          className="w-full border rounded-md px-3 py-2 text-sm"
          placeholder="e.g. New Year Season"
        />
        {errors.name && (
          <span className="text-red-500 text-xs">Name is required</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            {...register("startDate", { required: true })}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
          {errors.startDate && (
            <span className="text-red-500 text-xs">Start date is required</span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            {...register("endDate", { required: true })}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
          {errors.endDate && (
            <span className="text-red-500 text-xs">End date is required</span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Change Type</label>
        <select
          {...register("changeType")}
          className="w-full border rounded-md px-3 py-2 text-sm"
        >
          <option value="nominal">Nominal</option>
          <option value="percentage">Percentage</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Change Value ({watchChangeType === "nominal" ? "Rp" : "%"})
        </label>
        <input
          type="number"
          {...register("changeValue", {
            required: true,
            min: 1,
            valueAsNumber: true,
          })}
          className="w-full border rounded-md px-3 py-2 text-sm"
          min={1}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register("applyToAllProperties")}
          className="h-4 w-4"
        />
        <label className="text-sm">Apply to all properties</label>
      </div>

      {!watchApplyToAll && tenantProperties && tenantProperties.length > 0 && (
        <div className="mt-2">
          <label className="block text-sm font-medium mb-1">
            Select Properties
          </label>
          <div className="max-h-48 overflow-y-auto border rounded-md p-2">
            {tenantProperties.map((property) => (
              <div key={property.id} className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  {...register("propertyIds")}
                  value={property.id}
                  className="h-4 w-4"
                />
                <span>{property.name}</span>
              </div>
            ))}
          </div>
          {errors.propertyIds && (
            <span className="text-red-500 text-xs">
              Please select at least one property
            </span>
          )}
        </div>
      )}
    </>
  );
}
