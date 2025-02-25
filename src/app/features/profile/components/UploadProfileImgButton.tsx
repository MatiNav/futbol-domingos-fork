import Image from "next/image";
import { useState } from "react";

export default function UploadProfileImgButton() {
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
      setError("Failed to upload image");
      setIsUploading(false);
      return;
    }

    setIsUploading(false);
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      {isUploading && <p>Uploading...</p>}
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
      />
      {file && (
        <div className="mt-4">
          <Image
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="max-w-[200px] rounded-lg"
            width={200}
            height={200}
          />
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={!file}
        className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200 disabled:opacity-50"
      >
        Upload
      </button>
    </div>
  );
}
