"use client";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
  RegisterOptions,
} from "react-hook-form";
import Image from "next/image";
import searchIcon from "@/public/icons/Search 2.svg";

// Create a more flexible type for register options
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
  validationRules?: RegisterOptions<T, Path<T>>;
};

export default function SearchInput<T extends FieldValues>({
  label,
  placeholder,
  name,
  register,
  required = false,
  validationRules,
}: InputProps<T>) {
  return (
    <div className="w-full flex bg-white border border-baseGreen-two px-[20px] rounded-[25px] ">
      <input
        type="text"
        id={name}
        {...register(name, {
          required: required ? `${label} is required` : false,
          ...validationRules,
        })}
        className="bg-white w-full text-black rounded-[25px] placeholder:text-baseGreen-two h-[52px]  outline-none "
        placeholder={placeholder}
        // aria-invalid={error ? "true" : "false"}
      />
      <Image src={searchIcon} alt="Logout Icon" />
    </div>
  );
}
