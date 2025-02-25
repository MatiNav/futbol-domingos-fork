import { useState, useRef } from "react";

const imgType = "image/jpg";

export default function UploadProfileImgButton({
  onImageChosen,
  onImageUploaded,
}: {
  onImageChosen: (file: File) => void;
  onImageUploaded: (imageUrl: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setFile(event.target.files[0]);
      onImageChosen(event.target.files[0]);
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
        body: JSON.stringify({ fileType: imgType }),
      });

      const { url } = await response.json();

      const uploadResponse = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": imgType,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

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
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="absolute bottom-0 right-0 p-2 rounded-full bg-[rgb(11,40,24)] hover:bg-green-500 transition-colors shadow-lg"
        title="Edit profile picture"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      </button>

      {file && (
        <div className="absolute -bottom-12 right-[10px] flex items-center gap-2">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="bg-green-600 text-white py-1 px-3 rounded-lg text-sm hover:bg-green-700 transition-colors shadow-md flex items-center gap-1"
          >
            {isUploading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </>
            ) : (
              <span>Guardar</span>
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="absolute -bottom-12 right-0">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
