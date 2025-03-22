/* eslint-disable @typescript-eslint/no-unused-vars */
import * as yup from "yup";
import TextInput from "../inputs/textInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { toastAlert, ToastType } from "@/app/_utils/notifications/toast";
import { RiCloseFill } from "react-icons/ri";
import { UserAuthHook } from "@/app/_hooks/user/auth/auth.hook";

const schema = yup.object({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  code: yup
    .string()
    .min(6, "Code must be at least 6 characters")
    .required("Code is required"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
});

export type FormValues = yup.InferType<typeof schema>;

export default function ResetPasswordModal(props: {
  closeModal: () => void;
  successAction: () => void;
  errorAction: () => void;
  email: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);

    const { confirmPassword, ...requestData } = data;

    const response = await UserAuthHook.resetPassword({
      email: props.email,
      ...requestData,
    });
    setIsLoading(false);

    if (response.success) {
      toastAlert({
        message: response.message,
        type: ToastType.success,
      });
      props.successAction();
    } else {
      toastAlert({
        message: response.message,
        type: ToastType.error,
      });
      reset();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-80">
      <div className="relative w-full max-w-lg p-4">
        <div className="relative bg-white rounded-lg shadow-lg">
          <div className="px-6 py-6 lg:px-8">
            <div className="mb-4 flex flex-row justify-between items-start">
              <h3 className="text-xl font-medium text-gray-900 text-center">
                Reset Your Password
              </h3>
              <RiCloseFill
                onClick={props.closeModal}
                size={30}
                className="text-baseGreen-one mb-[20px] cursor-pointer bg-supernova-950 rounded-full flex self-end flex-row justify-end items-end"
              />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <TextInput
                label="Password"
                placeholder="Enter your new password"
                name="password"
                register={register}
                required
                error={errors.password}
              />
              <TextInput
                label="Confirm Password"
                placeholder="Confirm your new password"
                name="confirmPassword"
                register={register}
                required
                error={errors.confirmPassword}
              />

              <TextInput
                label="OTP"
                placeholder="Enter six digit otp"
                name="code"
                register={register}
                required
                error={errors.code}
              />

              <button
                type="submit"
                disabled={!isValid || isLoading}
                className={`
                  w-full rounded-full py-2.5 px-5 text-center text-white
                  ${
                    !isValid
                      ? "bg-baseGreen-one/50 cursor-not-allowed"
                      : isLoading
                      ? "bg-baseGreen-one/50 cursor-wait"
                      : "bg-baseGreen-one hover:bg-baseGreen-one/90"
                  }
                  transition-colors duration-300 ease-in-out
                  flex items-center justify-center
                `}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
