export interface UploadedImageResult {
  id: number;
  url: string;
  publicId?: string;
  altText?: string;
  isPrimary: boolean;
  order: number;
}

export interface ImageFileInput {
  file: File;
  altText?: string;
  isPrimary: boolean;
  order: number;
}

export interface ImageMetadata {
  isPrimary: boolean;
  order: number;
}
