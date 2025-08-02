// _components/inputs/textInput.tsx
"use client";
import { useState } from "react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
  RegisterOptions,
} from "react-hook-form";
import { Eye, EyeOff } from "lucide-react"; // Added new icons

export type FlexibleRegisterOptions<T extends FieldValues> = Omit<
  RegisterOptions<T>,
  "deps"
> & {
  deps?: Path<T> | Path<T>[] | undefined;
};

type InputProps<T extends FieldValues> = {
  label: string;
  placeholder: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  required?: boolean;
  error?: FieldError;
  textField?: boolean;
  validationRules?: RegisterOptions<T, Path<T>>;
  readonly?: boolean;
};

export default function TextInput<T extends FieldValues>({
  label,
  placeholder,
  name,
  register,
  required = false,
  error,
  textField = false,
  validationRules,
  readonly = false,
}: InputProps<T>) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const isPasswordField =
    name?.toLowerCase() === "password" ||
    name?.toLowerCase() === "confirmpassword";

  const baseClasses =
    "w-full bg-transparent outline-none transition-colors duration-200";
  const inputClasses = `
    ${baseClasses} h-12 text-white placeholder:text-slate-500
    ${readonly ? "cursor-not-allowed opacity-70" : ""}
  `;
  const textareaClasses = `
    ${baseClasses} py-3 text-white placeholder:text-slate-500
    ${readonly ? "cursor-not-allowed opacity-70" : ""}
  `;

  return (
    <div className="w-full flex flex-col group">
      <div
        className={`relative border-b-2 transition-colors duration-200 ${
          error
            ? "border-red-500"
            : "border-slate-600 focus-within:border-purple-500"
        }`}
      >
        {textField ? (
          <textarea
            id={name}
            {...register(name, {
              required: required ? `${label} is required` : false,
              ...validationRules,
            })}
            rows={5}
            className={`${textareaClasses} resize-none`}
            placeholder={placeholder}
            readOnly={readonly}
          />
        ) : (
          <input
            type={isPasswordField && !showPassword ? "password" : "text"}
            id={name}
            {...register(name, {
              required: required ? `${label} is required` : false,
              ...validationRules,
            })}
            className={inputClasses}
            placeholder={placeholder}
            readOnly={readonly}
          />
        )}
        {isPasswordField && (
          <button
            type="button"
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      <label
        htmlFor={name}
        className={`text-sm mt-2 font-medium transition-colors duration-200 ${
          error
            ? "text-red-500"
            : "text-slate-400 group-focus-within:text-purple-400"
        }`}
      >
        {label}
      </label>
      {error && <p className="text-red-400 text-xs mt-1">{error.message}</p>}
    </div>
  );
}
