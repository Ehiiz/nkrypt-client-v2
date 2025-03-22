import { Bounce, toast, ToastOptions } from "react-toastify";

export enum ToastType {
  success = "success",
  error = "error",
  info = "info",
}

const toastConfig: ToastOptions = {
  position: "bottom-center",
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  theme: "light",
  transition: Bounce,
  closeButton: false,
  icon: false,
  className: "w-[80%] text-baseGreen-one rounded-[10px]", // Tailwind classes for styling
};

export const toastAlert = (body: { message?: string; type: ToastType }) => {
  switch (body.type) {
    case ToastType.success:
      toast.success(body.message, toastConfig);
      break;
    case ToastType.error:
      toast.error(body.message, toastConfig);
      break;
    case ToastType.info:
      toast.info(body.message, toastConfig);
      break;
    default:
      toast.error(
        body?.message ?? "An error occurred while displaying the toast",
        toastConfig
      );
      break; // or throw an error or log it to the server for debugging purposes.
  }
};
