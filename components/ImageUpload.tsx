
import React, { useState, useRef, useCallback } from 'react';
import { CameraIcon, UploadIcon } from './Icons';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onImageSelect(file);
    }
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);
  
  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        onImageSelect(file);
    }
  }, [onImageSelect]);

  return (
    <div 
        className="w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer transition-colors hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        capture="environment"
      />
      {preview ? (
        <div className="relative aspect-video rounded-lg overflow-hidden">
             <img src={preview} alt="Medication preview" className="w-full h-full object-contain" />
             <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                 <p className="text-white font-semibold">Click to change image</p>
             </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-slate-500 dark:text-slate-400">
          <UploadIcon className="h-12 w-12 mb-4" />
          <p className="font-semibold text-lg">Click to upload or drag & drop</p>
          <p className="text-sm">or</p>
          <div className="flex items-center gap-2 mt-2 font-semibold text-sky-600 dark:text-sky-400">
            <CameraIcon className="h-5 w-5" />
            <span>Use your camera</span>
          </div>
        </div>
      )}
    </div>
  );
};
