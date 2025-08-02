// /auth/setup/page.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Fragment } from "react";
import Image from "next/image";
import TextInput from "@/app/_components/inputs/textInput";
import { toastAlert, ToastType } from "@/app/_utils/notifications/toast";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserAuthHook } from "@/app/_hooks/user/auth/auth.hook";
import { useUserContext } from "@/app/_utils/context/userContext";
import { UserTokenStorage } from "@/app/_utils/localStorage/userStorage";
import { profileImagesSelection } from "@/app/constants";
import { Loader2, CheckCircle, ArrowRight } from "lucide-react"; // Updated icons

// Updated schema to require username of at least 3 characters
const schema = yup.object({
  username: yup
    .string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  bio: yup.string().min(2).required("Bio is required"),
  profileImage: yup.string().required("Profile image is required"),
});

export type FormValues = yup.InferType<typeof schema>;

export default function Page() {
  const { setUser } = useUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validName, setValidName] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [nameLoading, setNameLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState("");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const username = watch("username");

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { ...setupData } = data;

    setIsLoading(true);
    const response = await UserAuthHook.completeSetup({
      ...setupData,
    });
    setIsLoading(false);

    if (response.success) {
      setUser(response.data?.user);
      localStorage.setItem("student", JSON.stringify(response.data?.user));
      UserTokenStorage.setUser(response.data!.user);

      // Store seedphrase and show modal
      setSeedPhrase(response.data?.seedPhrase || "");
      setShowModal(true);

      toastAlert({
        message: "Setup successful!",
        type: ToastType.success,
      });
    } else {
      toastAlert({
        message: response.message,
        type: ToastType.error,
      });
      reset();
    }
  };

  const checkValidUserName = async () => {
    if (username && username.length >= 3) {
      setNameLoading(true);
      try {
        const userName = await UserAuthHook.checkUserName({
          username,
        });
        if (userName.data?.available) {
          setValidName(userName.data?.available);
        } else {
          setValidName(false);
        }
      } catch (error) {
        setValidName(true);
      } finally {
        setNameLoading(false);
      }
    } else {
      setValidName(false);
    }
  };

  useEffect(() => {
    checkValidUserName();
  }, [username]);

  useEffect(() => {
    if (selectedImage) {
      setValue("profileImage", selectedImage, { shouldValidate: true });
    }
  }, [selectedImage, setValue]);

  const handleImageSelect = (imagePath: string) => {
    setSelectedImage(imagePath);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-aeonik text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tr from-blue-400/5 to-cyan-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
          <div className="relative bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Save your seed phrase
            </h2>
            <p className="text-sm text-slate-400 text-center">
              This is your recovery phrase. Copy and store it securely. You
              won’t be able to see it again.
            </p>
            <div className="bg-slate-700/60 p-4 rounded-xl text-sm font-mono text-slate-200 whitespace-pre-wrap break-words max-h-40 overflow-y-auto border border-slate-600">
              {seedPhrase}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(seedPhrase);
                  toastAlert({
                    message: "Seed phrase copied!",
                    type: ToastType.success,
                  });
                }}
                className="w-full sm:w-auto bg-slate-700 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-slate-600 transition-colors shadow-lg"
              >
                Copy
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-md p-8 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8 text-center">
          Complete Your Profile
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 flex flex-col items-center mb-4 w-full"
        >
          <div className="w-full">
            <label className="block text-slate-300 font-semibold mb-2">
              Choose a Profile Picture
            </label>
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-4 min-w-max">
                {profileImagesSelection.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => handleImageSelect(img)}
                    className={`
                      relative cursor-pointer rounded-full overflow-hidden
                      border-2 transition-all duration-200 ease-in-out
                      ${
                        selectedImage === img
                          ? "border-purple-500 scale-105 shadow-md"
                          : "border-slate-600 hover:border-purple-400"
                      }
                    `}
                  >
                    <div className="w-16 h-16 relative">
                      <Image
                        src={img}
                        alt={`Avatar ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {selectedImage === img && (
                      <div className="absolute inset-0 bg-purple-500 bg-opacity-20 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {errors.profileImage && (
              <p className="mt-1 text-sm text-red-400">
                {errors.profileImage.message}
              </p>
            )}
          </div>

          <TextInput
            label="Username"
            placeholder="Enter username (at least 3 characters)"
            name="username"
            register={register}
            required
            error={errors.username}
          />
          <div className="flex items-start -mt-4 w-full gap-2 text-sm">
            {nameLoading ? (
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="animate-spin h-4 w-4" />
                <span>Checking availability...</span>
              </div>
            ) : (
              username &&
              username.length >= 3 && (
                <>
                  {validName ? (
                    <p className="text-green-400">Username is available</p>
                  ) : (
                    <p className="text-red-400">Username is already taken</p>
                  )}
                </>
              )
            )}
          </div>

          <TextInput
            label="Bio"
            placeholder="Tell us about yourself"
            name="bio"
            register={register}
            textField={true}
            required
            error={errors.bio}
          />

          <button
            type="submit"
            disabled={!isValid || isLoading || !validName}
            className={`
              w-full min-h-[46px] rounded-lg text-white font-semibold flex items-center justify-center gap-2
              ${
                !isValid || !validName
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
                Complete Setup <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
