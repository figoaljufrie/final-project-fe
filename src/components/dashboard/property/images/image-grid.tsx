import Image from "next/image";
import { LocalImage } from "./property-image-uploader";
import ImageActions from "./image-actions";

export default function ImageGrid({
  images,
  onDelete,
  onSetPrimary,
}: {
  images: LocalImage[];
  onDelete: (imageId: number) => Promise<void>;
  onSetPrimary: (imageId: number) => Promise<void>;
}) {
  const maxImages = 5;

  return (
    <div className="grid grid-cols-5 gap-2 w-full">
      {Array.from({ length: maxImages }).map((_, index) => {
        const img = images[index];
        const isPrimary = img?.isPrimary;

        // ✅ Generate always-unique key to avoid React duplicate key warning
        const uniqueKey = img
          ? `${img.id ?? "temp"}-${index}`
          : `empty-${index}`;

        return (
          <div
            key={uniqueKey}
            className={`relative overflow-hidden rounded-md border flex items-center justify-center bg-gray-100 transition-all ${
              isPrimary ? "col-span-2 row-span-2" : "aspect-square"
            }`}
          >
            {img ? (
              <>
                <Image
                  src={img.url}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized={img.isNew}
                />
                <ImageActions
                  image={img}
                  onDelete={onDelete}
                  onSetPrimary={onSetPrimary}
                />
              </>
            ) : (
              <span className="text-gray-400 text-xs">Empty</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
