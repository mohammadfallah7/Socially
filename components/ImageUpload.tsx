"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { Button } from "./ui/button";
import { LucideX } from "lucide-react";

interface IImageUploadProps {
  onChange: (url: string) => void;
  value: string;
  endpoint: "postImage";
}

const ImageUpload: React.FC<IImageUploadProps> = ({
  endpoint,
  onChange,
  value,
}) => {
  if (value) {
    return (
      <div className="relative size-40">
        <img
          src={value}
          alt="Upload"
          className="rounded-md size-40 object-cover"
        />
        <Button
          className="absolute top-0 right-0"
          size="icon"
          onClick={() => onChange("")}
        >
          <LucideX className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res[0].ufsUrl);
      }}
      onUploadError={(error: Error) =>
        console.log(`Error in upload post: ${error}`)
      }
    />
  );
};

export default ImageUpload;
