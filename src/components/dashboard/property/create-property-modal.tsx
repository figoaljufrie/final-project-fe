import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useCreateProperty } from "@/hooks/Inventory/property/mutations/use-property-mutation";
import { PropertyCategory } from "@/lib/types/enums/enums-type";
import type { CreatePropertyPayload } from "@/lib/types/inventory/property-types";

export default function CreatePropertyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<PropertyCategory>(
    PropertyCategory.HOUSE
  );
  const { mutate: createProperty, isPending } = useCreateProperty();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreatePropertyPayload = { name, description, category };
    createProperty(payload, {
      onSuccess: () => {
        onClose();
        setName("");
        setDescription("");
        setCategory(PropertyCategory.HOUSE);
      },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white/80 border border-white/30 rounded-2-xl shadow-xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Create New Property
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as PropertyCategory)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus: border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
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
                  disabled={isPending}
                  className="inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-non focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
                >
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Property
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
