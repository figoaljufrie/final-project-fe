"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { useCreateProperty } from "@/hooks/Inventory/property/mutations/use-property-mutation";
import { useUploadPropertyImages } from "@/hooks/Inventory/images/property/use-property-images";
import { PropertyCategory } from "@/lib/types/enums/enums-type";
import type { CreatePropertyPayload } from "@/lib/types/inventory/property-types";
import CreatePropertyForm from "./property-form";
import ImageUploadForm from "./image-upload-form";

export default function CreatePropertyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"create" | "upload">("create");
  const [createdPropertyId, setCreatedPropertyId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<PropertyCategory>(PropertyCategory.HOUSE);
  const [files, setFiles] = useState<File[]>([]);

  const { mutate: createProperty, isPending: isCreating } = useCreateProperty();
  const { mutate: uploadImages, isPending: isUploading } = useUploadPropertyImages();

  // ✅ Create Property Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreatePropertyPayload = { name, description, category };

    createProperty({ payload }, {
      onSuccess: (data) => {
        setCreatedPropertyId(data.id);
        setStep("upload");
      },
    });
  };

  // ✅ Upload Image Handler
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdPropertyId || files.length === 0) return;

    uploadImages({ propertyId: createdPropertyId, files }, {
      onSuccess: () => {
        resetModal();
      },
    });
  };

  const resetModal = () => {
    setStep("create");
    setFiles([]);
    setCreatedPropertyId(null);
    setName("");
    setDescription("");
    setCategory(PropertyCategory.HOUSE);
    onClose();
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
            className="bg-white/80 border border-white/30 rounded-2xl shadow-xl w-full max-w-md p-6 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {step === "create" ? "Create New Property" : "Upload Property Images"}
              </h2>
              <button
                onClick={resetModal}
                className="text-gray-500 hover:text-gray-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* SLIDE CONTENT */}
            <AnimatePresence mode="wait">
              {step === "create" ? (
                <CreatePropertyForm
                  key="create"
                  name={name}
                  description={description}
                  category={category}
                  setName={setName}
                  setDescription={setDescription}
                  setCategory={setCategory}
                  isCreating={isCreating}
                  handleSubmit={handleSubmit}
                />
              ) : (
                <ImageUploadForm
                  key="upload"
                  files={files}
                  setFiles={setFiles}
                  handleUpload={handleUpload}
                  isUploading={isUploading}
                  goBack={() => setStep("create")}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}