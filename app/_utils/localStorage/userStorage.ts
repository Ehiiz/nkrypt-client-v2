/* eslint-disable @typescript-eslint/no-explicit-any */
export class UserTokenStorage {
  private static isClient = typeof window !== "undefined";
  static setUserToken = (token: string) => {
    if (!this.isClient) return;
    localStorage.setItem("user-token", JSON.stringify(token));
  };
  static getUserToken = () => {
    if (!this.isClient) return;
    try {
      const user = localStorage.getItem("user-token");
      if (!user) return null;
      return JSON.parse(user);
    } catch {
      return null;
    }
  };
  static setUser = (user: any) => {
    if (!this.isClient) return;
    localStorage.setItem("user", JSON.stringify(user));
  };
  static getUser = () => {
    if (!this.isClient) return;
    const user = localStorage.getItem("user");

    try {
      if (!user) return null;
      return JSON.parse(user);
    } catch {
      return null;
    }
  };

  static clearToken = () => {
    if (!this.isClient) return;
    localStorage.clear();
  };
}
