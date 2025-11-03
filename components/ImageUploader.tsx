
import React, { useRef, useCallback } from 'react';
import type { ImageFile } from '../types';

interface ImageUploaderProps {
  title: string;
  icon: React.ReactNode;
  image: ImageFile | null;
  onImageSelect: (image: ImageFile | null) => void;
}

const fileToImageFile = (file: File): Promise<ImageFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      resolve({
        dataUrl,
        base64,
        mimeType: file.type,
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ title, icon, image, onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const imageFile = await fileToImageFile(file);
        onImageSelect(imageFile);
      } catch (error) {
        console.error("Error processing file:", error);
        onImageSelect(null);
      }
    }
  }, [onImageSelect]);

  const handleRemoveImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onImageSelect]);

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-300 mb-2">{title}</h3>
      <div
        onClick={handleContainerClick}
        className="relative aspect-square w-full bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-gray-700/50 transition-all duration-300 group overflow-hidden"
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        {image ? (
          <>
            <img src={image.dataUrl} alt={title} className="w-full h-full object-contain" />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-label={`Remove ${title} image`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        ) : (
          <div className="text-center text-gray-500 group-hover:text-indigo-400 transition-colors">
            {icon}
            <p>Click to upload</p>
          </div>
        )}
      </div>
    </div>
  );
};

