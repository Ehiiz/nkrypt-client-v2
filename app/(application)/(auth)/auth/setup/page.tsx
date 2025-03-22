/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
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
import { RiCircleLine } from "react-icons/ri";

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

      toastAlert({
        message: "Setup successful!",
        type: ToastType.success,
      });
      router.push("/dashboard");
    } else {
      toastAlert({
        message: response.message,
        type: ToastType.error,
      });
      reset();
    }
  };

  const checkValidUserName = async () => {
    // Only check if username is at least 3 characters
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
      // Reset validation if username is too short
      setValidName(false);
    }
  };

  useEffect(() => {
    checkValidUserName();
  }, [username]);

  // Update the profileImage form value when an image is selected
  useEffect(() => {
    if (selectedImage) {
      setValue("profileImage", selectedImage, { shouldValidate: true });
    }
  }, [selectedImage, setValue]);

  const handleImageSelect = (imagePath: string) => {
    setSelectedImage(imagePath);
  };

  return (
    <div className="w-full min-h-screen grid font-aeonik bg-[#2E3238]   justify-center items-center px-[20px] py-[54px]">
      <div className="w-full flex items-center justify-center">
        <div className="max-w-[442px] w-full ">
          <p className="font-[500] text-[40px] text-white mt-[60px]">
            Complete Setup
          </p>

          {/* Forms */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-[15px] space-y-[20px] flex flex-col items-center mb-[20px] w-full"
          >
            {/* Image Selection Tray */}
            <div className="w-full">
              <label className="block text-white font-medium mb-2">
                Choose Profile Picture
              </label>
              <div className="overflow-x-auto pb-2">
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
                            ? "border-baseGreen-one scale-105"
                            : "border-gray-200 hover:border-gray-300"
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
                        <div className="absolute inset-0 bg-baseGreen-one bg-opacity-20 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {errors.profileImage && (
                <p className="mt-1 text-sm text-red-600">
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
            <div className="flex items-start -mt-4 w-full gap-[5px]">
              {nameLoading && (
                <RiCircleLine className="animate-spin h-[20px] bg-green-400 text-green-400" />
              )}
              {username && username.length >= 3 && (
                <div className="text-sm">
                  {validName ? (
                    <p className="text-green-600">Username is available</p>
                  ) : (
                    <p className="text-red-600">Username is already taken</p>
                  )}
                </div>
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
                sm:max-w-[442px] w-full mt-[80px] min-h-[46px] rounded-[5px] text-white
                ${
                  !isValid || !validName
                    ? "bg-[#5744B7]/50 cursor-not-allowed"
                    : isLoading
                    ? "bg-[#5744B7]/50 cursor-wait"
                    : "bg-[#5744B7] hover:bg-[#5744B7]/90"
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
                "Complete Setup"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
