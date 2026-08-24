import Cookies from "js-cookie";

export const cookie = {
  get: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    return Cookies.get(key) ?? null;
  },
  set: (key: string, value: string, days = 365) => {
    if (typeof window === "undefined") return;
    Cookies.set(key, value, {
      expires: days,
      sameSite: "Lax",
      path: "/",
      secure: process.env.NODE_ENV === "production"
    });
  },
  remove: (key: string): void => {
    if (typeof window === "undefined") return;
    Cookies.remove(key);
  }
};
