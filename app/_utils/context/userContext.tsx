/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";
import { UserTokenStorage } from "../localStorage/userStorage";
import { IUser } from "@/app/_hooks/user/auth/auth.interface";

type IUserContext = {
  user: IUser | undefined;
  setUser: Dispatch<SetStateAction<any | undefined>>;
  isUserTokenExpired: () => boolean;
};

const UserContext = createContext<IUserContext | null>(null);

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any | undefined>();

  useEffect(() => {
    const user = UserTokenStorage.getUser();

    if (user) {
      setUser(user);
    }
  }, []);

  const isUserTokenExpired = (): boolean => {
    const token = UserTokenStorage.getUserToken();
    if (token === null) {
      return true;
    }

    try {
      const decodedToken = jwtDecode(token);

      const currentTime = Date.now() / 1000;

      if (!decodedToken.exp) {
        return true;
      }

      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isUserTokenExpired,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }

  return context;
}
