"use client";
import { useState } from "react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
  RegisterOptions,
} from "react-hook-form";

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

  const baseInputClasses =
    "w-full text-black rounded-[25px] placeholder:text-baseGreen-two mt-[3px] outline-none border border-baseGreen-two";
  const inputClasses = `bg-baseGreen-four ${baseInputClasses} h-[52px] px-[20px] ${
    readonly ? "cursor-not-allowed opacity-70" : ""
  }`;
  const textareaClasses = `py-4 ${baseInputClasses} ${
    readonly ? "cursor-not-allowed opacity-70" : ""
  }`;

  return (
    <div className="w-full flex flex-col">
      <label
        htmlFor={name}
        className="text-baseBrown-four text-[14px] font-[400]"
      >
        {label}
      </label>

      {textField ? (
        <div className="flex items-center gap-[10px]">
          <textarea
            id={name}
            {...register(name, {
              required: required ? `${label} is required` : false,
              ...validationRules,
            })}
            rows={15}
            className={textareaClasses}
            placeholder={placeholder}
            readOnly={readonly}
          />
        </div>
      ) : (
        <div className="relative w-full">
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
          {isPasswordField && (
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-baseGreen-two hover:text-baseGreen-dark focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          )}
        </div>
      )}
      {error && (
        <p className="text-red-500 text-[12px] mt-[5px]">{error.message}</p>
      )}
    </div>
  );
}
