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
import { UserAuthHook } from "@/app/_hooks/user/auth/auth.hook";
const schema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(5, "Password must be at least 5 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
});

export type FormValues = yup.InferType<typeof schema>;

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    const response = await UserAuthHook.signUp({
      email: data.email,
      password: data.password,
    });
    setIsLoading(false);

    if (response.success) {
      toastAlert({
        message: response.message,
        type: ToastType.success,
      });
      setShowModal(true);
    } else {
      toastAlert({
        message: response.message,
        type: ToastType.error,
      });
      reset();
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#2E3238]  font-aeonik text-white bg-base-one gap-[20px] sm:grid-cols-2 justify-center items-center px-[20px] py-[54px]">
      {showModal && (
        <Modal>
          <VerifyAccountModal
            closeModal={() => router.push("/auth/login")}
            email={watch("email")}
            successAction={() => router.push("/auth/login")}
            errorAction={() => console.log("error")}
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
            <Link
              href={"/auth/login"}
              className="font-[500] text-[40px] text-[#63626C] mt-[60px]"
            >
              Login
            </Link>
            <Link
              href={"/auth/signup"}
              className="font-[500] text-[40px] text-white mt-[60px]"
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

            <TextInput
              label="Confirm Password"
              placeholder="Enter your password"
              name="confirmPassword"
              register={register}
              required
              error={errors.confirmPassword}
            />

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
                "Sign Up"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
