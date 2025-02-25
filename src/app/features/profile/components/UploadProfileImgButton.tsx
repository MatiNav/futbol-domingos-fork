import Image from "next/image";
import { useState } from "react";

export default function UploadProfileImgButton({
  onImageUploaded,
}: {
  onImageUploaded: (imageUrl: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setFile(event.target.files?.[0] || null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("No file selected");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await fetch("/api/user/profile/image", {
        method: "POST",
        body: JSON.stringify({ fileType: "image/png" }),
      });

      const { url } = await response.json();

      const uploadResponse = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file?.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      // Extract the image URL from the upload response
      const imageUrl = url.split("?")[0];
      onImageUploaded(imageUrl);
      setFile(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-6">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {isUploading && <p className="text-white mb-2">Uploading...</p>}
      <div className="flex flex-col items-center gap-4">
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          className="text-white"
        />
        {file && (
          <div className="mt-4">
            <Image
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover"
              width={96}
              height={96}
            />
          </div>
        )}
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200 disabled:opacity-50"
        >
          {isUploading ? "Subiendo..." : "Subir imagen"}
        </button>
      </div>
    </div>
  );
}
