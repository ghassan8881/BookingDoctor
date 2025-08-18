// "use client";

// import { useEffect, useState } from "react";

// export function useUser() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Check if we're on the client side
//     if (typeof window !== "undefined") {
//       const userData = localStorage.getItem("userData");
//       if (userData) {
//         setUser(JSON.parse(userData));
//       }
//     }
//   }, []);

//   const updateUser = (newUserData) => {
//     localStorage.setItem("userData", JSON.stringify(newUserData));
//     setUser(newUserData);
//   };

//   const clearUser = () => {
//     localStorage.removeItem("userData");
//     setUser(null);
//   };

//   return { user, updateUser, clearUser };
// }

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function useUser() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "authenticated") {
        try {
          // احصل على بيانات المستخدم من API باستخدام session.token
          const res = await fetch("/api/user", {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          const userData = await res.json();

          // احفظ في localStorage للتخزين المؤقت
          localStorage.setItem("userData", JSON.stringify(userData));
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          // استخدم البيانات المحفوظة إذا فشل الطلب
          const cachedUser = localStorage.getItem("userData");
          if (cachedUser) setUser(JSON.parse(cachedUser));
        }
      } else if (status === "unauthenticated") {
        setUser(null);
        localStorage.removeItem("userData");
      }
      setLoading(false);
    };

    fetchUserData();
  }, [status, session]);

  const updateUser = (newUserData) => {
    localStorage.setItem("userData", JSON.stringify(newUserData));
    setUser(newUserData);
  };

  const clearUser = () => {
    localStorage.removeItem("userData");
    setUser(null);
  };

  return { user, updateUser, clearUser, loading, status };
}
