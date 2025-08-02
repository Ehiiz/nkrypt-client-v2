// /_components/auth/verifyAccountModal.tsx
import * as yup from "yup";
import TextInput from "@/app/_components/inputs/textInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { toastAlert, ToastType } from "@/app/_utils/notifications/toast";
import { X, CheckCircle } from "lucide-react"; // Replaced RiCloseFill with a Lucide icon
import { UserAuthHook } from "@/app/_hooks/user/auth/auth.hook";

const schema = yup.object({
  code: yup
    .string()
    .min(6, "Code must be at least 6 characters")
    .required("Code is required"),
});

export type FormValues = yup.InferType<typeof schema>;

export default function VerifyAccountModal(props: {
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
    const response = await UserAuthHook.verifyAccount({
      email: props.email,
      code: data.code,
    });
    setIsLoading(false);

    if (response.success) {
      toastAlert({
        message: response.message,
        type: ToastType.success,
      });
      props.closeModal();
      props.successAction();
    } else {
      toastAlert({
        message: response.message,
        type: ToastType.error,
      });
      reset();
      props.errorAction();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/80 p-4">
      <div className="relative w-full max-w-lg">
        <div className="relative bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8">
          <div className="flex justify-end mb-4">
            <button
              onClick={props.closeModal}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle size={30} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Verify Your Account
            </h3>
            <p className="text-sm text-slate-400 mt-2">
              A verification code has been sent to your email.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <TextInput
              label="Verification Code"
              placeholder="Enter six-digit code"
              name="code"
              register={register}
              required
              error={errors.code}
            />

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`
                w-full min-h-[46px] rounded-lg text-white font-semibold flex items-center justify-center gap-2
                ${
                  !isValid
                    ? "bg-slate-700/60 cursor-not-allowed text-slate-400"
                    : isLoading
                    ? "bg-purple-600/60 cursor-wait"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/25"
                }
                transition-all duration-300 transform hover:scale-105
              `}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
              ) : (
                "Verify Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
