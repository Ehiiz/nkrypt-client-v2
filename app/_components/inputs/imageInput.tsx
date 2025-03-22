/* eslint-disable @typescript-eslint/no-explicit-any */
// app/_components/inputs/imageInput.tsx
"use client";
import { useState } from "react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import Image from "next/image";

type ImageInputProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  error?: FieldError;
  required?: boolean;
  defaultImage?: string;
};

export default function ImageInput<T extends FieldValues>({
  label,
  name,
  setValue,
  error,
  defaultImage,
}: ImageInputProps<T>) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Set the file for form submission
      setValue(name, file as any);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <input
          type="file"
          id={name}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor={name}
          className="w-full h-full flex items-center justify-center border border-dashed rounded-full cursor-pointer"
        >
          {preview ? (
            <Image
              src={preview}
              alt="Selected"
              className="w-full h-full object-cover rounded-full"
              width={100}
              height={100}
            />
          ) : (
            <span className="text-gray-500 text-2xl">+</span>
          )}
        </label>
      </div>
      <label className="block text-sm mt-[5px] text-baseBrown-three">
        {label}
      </label>

      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
          {error.message}
        </p>
      )}
    </div>
  );
}
