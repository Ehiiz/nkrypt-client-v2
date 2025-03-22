"use client";

import "react-toastify/dist/ReactToastify.css";

import React from "react";
import { ToastContainer } from "react-toastify";

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ToastContainer
        className={`bg-transparent rounded-[10px] w-[full] bottom-2 justify-center text-center flex  text-[15px] text-baseGreen-one z-10 font-sans font-[600] h-fit`}
      />
    </>
  );
}
