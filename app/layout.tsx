import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ToastProvider from "./_utils/context/toastContext";
import { UserContextProvider } from "./_utils/context/userContext";

const carbonic = localFont({
  src: [
    {
      path: "./fonts/POICarbonicTrial-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/POICarbonicTrial-ThinItalic.otf",
      weight: "100",
      style: "italic",
    },
    {
      path: "./fonts/POICarbonicTrial-ExtraLight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/POICarbonicTrial-ExtraLightItalic.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "./fonts/POICarbonicTrial-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/POICarbonicTrial-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./fonts/POICarbonicTrial-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/POICarbonicTrial-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/POICarbonicTrial-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/POICarbonicTrial-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/POICarbonicTrial-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/POICarbonicTrial-SemiBoldItalic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "./fonts/POICarbonicTrial-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/POICarbonicTrial-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/POICarbonicTrial-ExtraBold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/POICarbonicTrial-ExtraBoldItalic.otf",
      weight: "800",
      style: "italic",
    },
  ],
  variable: "--font-carbonic",
});

const aeonik = localFont({
  src: [
    {
      path: "./fonts/AeonikTRIAL-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/AeonikTRIAL-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./fonts/AeonikTRIAL-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/AeonikTRIAL-RegularItalic.otf",
      weight: "400",
      style: "italic",
    },

    {
      path: "./fonts/AeonikTRIAL-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/AeonikTRIAL-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-aeonik",
});

export const metadata: Metadata = {
  title: "Nkrypt Social",
  description: "Krypt, Share, Live",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${aeonik.variable} bg-[#2E3238] ${carbonic.variable} min-h-screen antialiased`}
      >
        <ToastProvider>
          <UserContextProvider>{children}</UserContextProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
