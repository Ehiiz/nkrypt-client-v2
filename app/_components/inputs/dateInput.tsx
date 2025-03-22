"use client";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
  RegisterOptions,
} from "react-hook-form";

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

export default function DateInput<T extends FieldValues>({
  label,
  placeholder,
  name,
  register,
  required = false,
  error,
  validationRules,
}: InputProps<T>) {
  return (
    <div className="w-full flex flex-col">
      <label
        htmlFor={name}
        className="text-baseBrown-four text-[14px] font-[400]"
      >
        {label}
      </label>{" "}
      <input
        type="date"
        id={name}
        {...register(name, {
          required: required ? `${label} is required` : false,
          ...validationRules,
        })}
        className="sm:max-w-[442px] w-full text-black rounded-[25px] placeholder:text-baseGreen-two h-[52px] px-[20px] mt-[3px] outline-none border border-baseGreen-two"
        placeholder={placeholder}
        // aria-invalid={error ? "true" : "false"}
      />
      {error && (
        <p className="text-red-500 text-[12px] mt-[5px]">{error.message}</p>
      )}
    </div>
  );
}
