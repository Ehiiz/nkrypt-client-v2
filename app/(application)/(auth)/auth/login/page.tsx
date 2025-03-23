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
    // Form submission logic
    setIsLoading(true);
    const response = await UserAuthHook.signIn(data);
    setIsLoading(false);

    if (response.success) {
      console.log(response);
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
    <div className="w-full min-h-screen bg-[#2E3238]  font-aeonik text-white  gap-[20px] sm:grid-cols-2 justify-center items-center px-[20px] py-[54px]">
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

      <div className="w-full flex items-center justify-center">
        <div className="max-w-[442px] w-full ">
          <div className="text-[20px]">
            <p>Share</p>
            <p>Socialize</p>
            <p className="text-[50px] font-bold text-[#B2F17E]">Nkrypt</p>
            <p className="text-[14px]">a new way to engage</p>
          </div>

          <div className="flex justify-between">
            <p className="font-[500] text-[40px] text-white mt-[60px]">Login</p>
            <Link
              href={"/auth/signup"}
              className="font-[500] text-[40px] text-[#63626C] mt-[60px]"
            >
              Sign Up
            </Link>
          </div>

          {/* Forms */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-[15px] space-y-[20px] mb-[20px] w-full"
          >
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

            <button
              onClick={() => setShowForgotModal(true)}
              className="text-white/80 cursor-pointer underline"
            >
              Forgot Password
            </button>

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`
                sm:max-w-[442px] w-full mt-[80px] min-h-[46px] rounded-[5px] text-white
                ${
                  !isValid
                    ? "bg-[#5744B7]/50 cursor-not-allowed"
                    : isLoading
                    ? "bg-[#5744B7]/50 cursor-wait"
                    : "bg-[#5744B7] hover:bg-baseGreen-one/90"
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
                "log in"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
