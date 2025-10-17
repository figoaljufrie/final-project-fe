"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { PropertyCategory } from "@/lib/types/enums/enums-type";

interface PropertyFormProps {
  name: string;
  description: string;
  category: PropertyCategory;
  setName: (value: string) => void;
  setDescription: (value: string) => void;
  setCategory: (value: PropertyCategory) => void;
  isCreating: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function CreatePropertyForm({
  name,
  description,
  category,
  setName,
  setDescription,
  setCategory,
  isCreating,
  handleSubmit,
}: PropertyFormProps) {
  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Property Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
          placeholder="e.g., Sunset Villa"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
          placeholder="A Beautiful Place to stay..."
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as PropertyCategory)}
          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
          required
        >
          {Object.values(PropertyCategory).map((cat) => (
            <option key={cat} value={cat} className="capitalize">
              {cat.toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-4 flex justify-end space-x-3">
        <button
          type="submit"
          disabled={isCreating}
          className="inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
        >
          {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Property
        </button>
      </div>
    </motion.form>
  );
}