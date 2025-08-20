"use client";

import { useEffect, useState } from "react";

export function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("userData");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  const updateUser = (newUserData) => {
    localStorage.setItem("userData", JSON.stringify(newUserData));
    setUser(newUserData);
  };

  const clearUser = () => {
    localStorage.removeItem("userData");
    setUser(null);
  };

  return { user, updateUser, clearUser };
}
