// /auth/login/page.tsx
"use client";
import TextInput from "@/app/_components/inputs/textInput";
import Link from "next/link";
import { toastAlert, ToastType } from "@/app/_utils/notifications/toast";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/app/_components/mainModal";
import VerifyAccountModal from "@/app/_components/auth/verifyAccountModal";
import ResetPasswordModal from "@/app/_components/modals/resetPasswordModal";
import { useUserContext } from "@/app/_utils/context/userContext";
import { UserAuthHook } from "@/app/_hooks/user/auth/auth.hook";
import { UserTokenStorage } from "@/app/_utils/localStorage/userStorage";
import { ArrowRight } from "lucide-react"; // Added new icons

const schema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(5, "Password must be at least 5 characters")
    .required("Password is required"),
});

export type FormValues = yup.InferType<typeof schema>;

export default function Page() {
  const { setUser } = useUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    const response = await UserAuthHook.signIn(data);
    setIsLoading(false);

    if (response.success) {
      if (response.data?.user) {
        setUser(response.data?.user);
        UserTokenStorage.setUser(response.data!.user);
        UserTokenStorage.setUserToken(response.data.token);

        toastAlert({
          message: "Sign in successful!",
          type: ToastType.success,
        });
        if (!response.data.completedSetup) {
          router.push("/auth/setup");
        } else {
          router.push("/dashboard");
        }
      } else {
        toastAlert({
          message: response.message,
          type: ToastType.error,
        });
        setShowModal(true);
      }
    } else {
      toastAlert({
        message: response.message,
        type: ToastType.error,
      });
      reset();
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-aeonik text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tr from-blue-400/5 to-cyan-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {showModal && (
        <Modal>
          <VerifyAccountModal
            closeModal={() => setShowModal(false)}
            email={watch("email")}
            errorAction={() => setShowModal(false)}
            successAction={() => setShowModal(false)}
          />
        </Modal>
      )}

      {showForgotModal && (
        <Modal>
          <ResetPasswordModal
            closeModal={() => setShowForgotModal(false)}
            successAction={() => setShowForgotModal(false)}
          />
        </Modal>
      )}

      <div className="relative z-10 w-full max-w-md p-8 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-3xl shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            Nkrypt
          </h1>
          <p className="text-lg text-slate-300">Share, Socialize, Engage</p>
        </div>

        <div className="flex justify-center mb-8 gap-4">
          <p className="text-3xl font-semibold text-white border-b-2 border-purple-500 pb-1 px-4">
            Login
          </p>
          <Link
            href={"/auth/signup"}
            className="text-3xl font-semibold text-slate-400 hover:text-white transition-colors duration-200"
          >
            Sign Up
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <TextInput
            label="Email"
            placeholder="Enter your email address"
            name="email"
            register={register}
            required
            error={errors.email}
          />
          <TextInput
            label="Password"
            placeholder="Enter your password"
            name="password"
            register={register}
            required
            error={errors.password}
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-sm text-slate-400 hover:text-white transition-colors underline"
            >
              Forgot Password?
            </button>
          </div>

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
              <>
                Log in <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
