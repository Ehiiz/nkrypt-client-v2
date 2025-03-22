/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toastAlert, ToastType } from "@/app/_utils/notifications/toast";
import TextInput from "@/app/_components/inputs/textInput";
import Loader from "../loaders/loader";
import { UserAuthHook } from "@/app/_hooks/user/auth/auth.hook";

// Move schema outside component to prevent recreation
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  code: yup
    .string()
    .when("$verifiedEmail", (verifiedEmail: boolean[], schema) =>
      verifiedEmail[0]
        ? schema
            .min(4, "Code must be at least 4 characters")
            .required("Code is required")
        : schema.notRequired()
    ),
  password: yup
    .string()
    .when("$verifiedEmail", (verifiedEmail: boolean[], schema) =>
      verifiedEmail[0]
        ? schema
            .min(7, "Password must be at least 7 characters")
            .required("Password is required")
        : schema.notRequired()
    ),
});

export type FormValues = yup.InferType<typeof schema>;

interface ResetPasswordModalProps {
  closeModal: () => void;
  successAction?: () => void;
}

export default function ResetPasswordModal({
  closeModal,
  successAction,
}: ResetPasswordModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "all",
    context: { verifiedEmail }, // Pass verifiedEmail as context
    defaultValues: {
      email: "",
      code: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsLoading(true);
      const response = await UserAuthHook.verifyEmail({
        email: data.email,
      });

      if (response.success) {
        toastAlert({
          message: "Reset code sent!",
          type: ToastType.success,
        });
        setVerifiedEmail(true);
      } else {
        toastAlert({
          message: response.message,
          type: ToastType.error,
        });
        reset();
      }
    } catch (error) {
      toastAlert({
        message: "An error occurred. Please try again.",
        type: ToastType.error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsLoading(true);
      const response = await UserAuthHook.resetPassword({
        email: data.email,
        code: data.code!,
        password: data.password!,
      });

      if (response.success) {
        toastAlert({
          message: "Password reset successful!",
          type: ToastType.success,
        });
        closeModal();
        successAction?.();
      } else {
        toastAlert({
          message: response.message,
          type: ToastType.error,
        });
        reset();
      }
    } catch (error) {
      toastAlert({
        message: "An error occurred. Please try again.",
        type: ToastType.error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 font-aeonik z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/80">
      {isLoading && <Loader />}
      <div className="relative w-full max-w-lg p-4">
        <div className="relative rounded-lg bg-black shadow-lg">
          <div className="px-6 py-6 lg:px-8">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-xl font-bold font-aeonik text-white ">
                {verifiedEmail ? "Reset Password" : "Verify Email"}
              </h3>
            </div>

            <form
              onSubmit={handleSubmit(verifiedEmail ? resetSubmit : onSubmit)}
              className="flex flex-col items-start space-y-6"
            >
              <TextInput
                label="Email"
                placeholder="Enter your email"
                name="email"
                register={register}
                required
                error={errors.email}
                readonly={verifiedEmail}
              />

              {verifiedEmail && (
                <>
                  <TextInput
                    label="Reset Code"
                    placeholder="Enter the code sent to your email"
                    name="code"
                    register={register}
                    required
                    error={errors.code}
                  />
                  <TextInput
                    label="New Password"
                    placeholder="Enter your new password"
                    name="password"
                    register={register}
                    required
                    error={errors.password}
                  />
                </>
              )}

              <div className="flex w-full flex-row gap-5">
                <button
                  onClick={() => closeModal()}
                  className="w-full rounded-[5px] border border-[#5744B7] px-5 py-2.5 text-center text-baseGreen-two transition-colors duration-300 ease-in-out hover:bg-baseGreen-two/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className={`
                    w-full rounded-[5px] px-5 py-2.5 text-center text-white transition-colors duration-300 ease-in-out
                    ${
                      !isValid
                        ? "bg-[#5744B7]/50 cursor-not-allowed"
                        : isLoading
                        ? "bg-[#5744B7]/50 cursor-wait"
                        : "bg-[#5744B7] hover:bg-baseGreen-one/90"
                    }
                  `}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                  ) : verifiedEmail ? (
                    "Reset Password"
                  ) : (
                    "Send Reset Code"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
