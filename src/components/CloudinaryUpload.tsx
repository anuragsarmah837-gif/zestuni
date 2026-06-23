import React, { useState } from 'react';
import { UploadCloud, Loader2, CheckCircle2, X } from 'lucide-react';

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string) => void;
  label?: string;
  defaultPreview?: string;
  className?: string;
}

export default function CloudinaryUpload({
  onUploadSuccess,
  label = 'Upload Image',
  defaultPreview,
  className = ''
}: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(defaultPreview || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    // Create local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const formData = new FormData();
    formData.append('file', file);
    
    // Fallback preset if not configured in ENV
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    if (!uploadPreset || !cloudName) {
       setError("Cloudinary env variables missing. Please check .env.local.");
       setIsUploading(false);
       return;
    }

    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        onUploadSuccess(data.secure_url);
        setPreview(data.secure_url);
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (err: any) {
      console.error('Upload Error:', err);
      setError(err.message || 'Failed to upload image');
      setPreview(defaultPreview || null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="text-[10px] uppercase font-mono text-neutral-400 font-bold">{label}</label>}
      
      <div className="flex items-center gap-4">
        {/* Preview Avatar/Box */}
        {preview && (
          <div className="relative w-16 h-16 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 overflow-hidden flex-shrink-0 group">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <UploadCloud className="text-white w-5 h-5" />
            </div>
            {/* Hidden overlay input to re-upload easily from image */}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>
        )}

        <div className="flex-1 relative">
           <input
              type="file"
              accept="image/*"
              id={`upload-${label.replace(/\s+/g, '-')}`}
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
           />
           <label
             htmlFor={`upload-${label.replace(/\s+/g, '-')}`}
             className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-semibold cursor-pointer transition-colors w-max
               ${error ? 'border-red-500 text-red-500 bg-red-50' : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900'}
             `}
           >
             {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
             ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  {preview ? 'Replace Image' : 'Select File'}
                </>
             )}
           </label>
           
           {error && (
             <span className="flex items-center gap-1 text-[10px] text-red-500 mt-2 font-mono">
               <X className="w-3 h-3" /> {error}
             </span>
           )}
           {preview && !error && !isUploading && (
             <span className="flex items-center gap-1 text-[10px] text-green-500 mt-2 font-mono">
               <CheckCircle2 className="w-3 h-3" /> Uploaded to Cloudinary
             </span>
           )}
        </div>
      </div>
    </div>
  );
}
