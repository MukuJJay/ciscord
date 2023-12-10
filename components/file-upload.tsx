import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";

import Image from "next/image";
import { X } from "lucide-react";

interface FileUploadProps {
  endpoint: "serverImage" | "messageFile";
  onChange: (url?: string) => void;
  value: string;
}

export const FileUpload = ({ endpoint, onChange, value }: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (fileType && fileType !== "pdf") {
    return (
      <div className="h-24 w-24 relative">
        <Image fill src={value} alt="Upload" className="rounded-full" />
        <button
          onClick={() => onChange("")}
          className="absolute right-0 top-0 bg-rose-400 rounded-full p-1 shadow-s0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};
