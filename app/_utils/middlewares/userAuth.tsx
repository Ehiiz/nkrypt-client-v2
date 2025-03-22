/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useUserContext } from "../context/userContext";
import { UserTokenStorage } from "../localStorage/userStorage";

// Define a more flexible PageProps type
type PageProps = {
  params?: any;
  searchParams?: any;
};

const authUserWrapper = <P extends PageProps>(
  Component: React.ComponentType<P>
) => {
  return function UserAuthWrapper(props: P) {
    const { user } = useUserContext();
    const router = useRouter();

    useEffect(() => {
      const token = UserTokenStorage.getUserToken();

      if (!token) {
        router.push("/auth/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const currentDate = new Date();

        // JWT exp is in seconds
        if (decodedToken.exp! * 1000 < currentDate.getTime()) {
          router.push("/auth/login");
        }

        if (user && !user.completedSetup) {
          router.push("/auth/setup");
        }
      } catch (error) {
        // Handle invalid token
        router.push("/auth/login");
      }
    }, [router, user]);

    return <Component {...props} />;
  };
};

export default authUserWrapper;
