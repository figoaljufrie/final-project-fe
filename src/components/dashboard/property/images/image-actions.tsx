import { Trash2, Star, StarOff } from "lucide-react";
import { LocalImage } from "./property-image-uploader";

export default function ImageActions({
  image,
  onDelete,
  onSetPrimary,
}: {
  image: LocalImage;
  onDelete: (imageId: number) => Promise<void>;
  onSetPrimary: (imageId: number) => Promise<void>;
}) {
  const { id, isNew, isPrimary } = image;

  return (
    <div className="absolute inset-0 flex flex-col justify-end p-1 bg-black/20 opacity-0 hover:opacity-100 transition-opacity gap-1">
      {!isNew && (
        <button
          onClick={() => onDelete(id)}
          className="flex items-center justify-center w-6 h-6 bg-red-600 rounded-full text-white hover:bg-red-700"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
      <button
        onClick={() => onSetPrimary(id)}
        className={`flex items-center justify-center w-6 h-6 rounded-full text-white ${
          isPrimary ? "bg-yellow-500" : "bg-gray-600 hover:bg-gray-700"
        }`}
        title="Set as Primary"
      >
        {isPrimary ? <Star className="w-3 h-3" /> : <StarOff className="w-3 h-3" />}
      </button>
    </div>
  );
}