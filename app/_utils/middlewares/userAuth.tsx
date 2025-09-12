/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useUserContext } from "../context/userContext";
import { UserTokenStorage } from "../localStorage/userStorage";
import { LogIn, X, Zap } from "lucide-react";

// Define a more flexible PageProps type
type PageProps = {
  params?: any;
  searchParams?: any;
};

const NotLoggedInModal = () => {
  const router = useRouter();

  const handleCreateAccount = () => {
    // This would normally navigate to a registration or login page
    router.push("/auth/signup");
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-sm w-full text-center border border-slate-700 shadow-2xl">
        <button
          onClick={() => console.log("Close modal")}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
            <Zap size={32} className="text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400 mb-3">
          Access Denied
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          You must be logged in to view this profile. Please create an account
          or log in to continue.
        </p>
        <button
          onClick={handleCreateAccount}
          className="group relative overflow-hidden font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div className="relative flex items-center justify-center gap-2">
            <LogIn size={18} />
            <span>Create an Account</span>
          </div>
        </button>
      </div>
    </div>
  );
};

const authUserWrapper = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return function UserAuthWrapper(props: P) {
    const { user, isUserTokenExpired } = useUserContext();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      const isExpired = isUserTokenExpired();
      if (isExpired) {
        setIsAuthorized(false);
        // router.push("/auth/login");
        return;
      }

      if (user && !user.completedSetup) {
        setIsAuthorized(false);
        //router.push("/auth/setup");
        return;
      }

      setIsAuthorized(true);
    }, [router, user, isUserTokenExpired]);

    if (!isAuthorized) {
      return <NotLoggedInModal />;
    }

    return <Component {...props} />;
  };
};

export default authUserWrapper;
