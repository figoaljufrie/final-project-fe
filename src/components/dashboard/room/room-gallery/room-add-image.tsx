"use client";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface AddImageButtonProps {
  propertyId: number;
  roomId: number;
  addImage: (file: File) => Promise<void>;
  children: ReactNode;
}

export default function AddImageButton({
  propertyId,
  roomId,
  addImage,
  children,
}: AddImageButtonProps) {
  const handleClick = () => {
    if (!propertyId || !roomId) {
      alert("Property ID or Room ID missing. Try again.");
      return;
    }
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) await addImage(file);
    };
    fileInput.click();
  };

  return (
    <Button variant="outline" className="mt-3" onClick={handleClick}>
      {children}
    </Button>
  );
}
