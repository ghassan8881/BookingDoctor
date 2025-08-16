// "use client";

// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);

//     try {
//       const result = await signIn("credentials", {
//         email,
//         password,
//         redirect: false,
//       });

//       if (result?.error) {
//         console.error("Login error:", result.error);
//         // Handle specific error messages
//         if (result.error.includes("No user found")) {
//           setError("Invalid email address");
//         } else if (result.error.includes("Incorrect password")) {
//           setError("Wrong password");
//         } else {
//           setError("Login failed. Please try again.");
//         }
//         setIsLoading(false);
//         return;
//       }

//       // Successful login - fetch user details
//       try {
//         const response = await fetch("/api/user");

//         if (!response.ok) {
//           throw new Error("Failed to fetch user data");
//         }

//         const userData = await response.json();

//         // Store user details in localStorage
//         localStorage.setItem(
//           "userData",
//           JSON.stringify({
//             ...userData,
//             // Add any additional client-side data
//             lastLogin: new Date().toISOString(),
//           })
//         );

//         router.push("/");
//       } catch (err) {
//         console.error("Failed to fetch user details:", err);
//         // You might want to setError here if you want to show the error
//         // But proceeding with login anyway
//         router.push("/");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       setError("An unexpected error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
//       <h1 className="text-2xl font-bold mb-6">Login</h1>
//       {error && (
//         <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
//       )}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block mb-1 font-medium">Email:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div>
//           <label className="block mb-1 font-medium">Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={isLoading}
//           className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition ${
//             isLoading ? "opacity-70 cursor-not-allowed" : ""
//           }`}
//         >
//           {isLoading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//       <div className="mt-4 text-center">
//         <p className="text-gray-600">
//           Don't have an account?{" "}
//           <a href="/register" className="text-blue-600 hover:underline">
//             Register
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        console.error("Login error:", result.error);
        // Handle specific error messages
        if (result.error.includes("No user found")) {
          setError("Invalid email address");
        } else if (result.error.includes("Incorrect password")) {
          setError("Wrong password");
        } else {
          setError("Login failed. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      // Successful login - fetch user details
      try {
        const response = await fetch("/api/user");

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();

        // Store user details in localStorage
        localStorage.setItem(
          "userData",
          JSON.stringify({
            ...userData,
            // Add any additional client-side data
            lastLogin: new Date().toISOString(),
          })
        );

        router.push("/");
      } catch (err) {
        console.error("Failed to fetch user details:", err);
        // You might want to setError here if you want to show the error
        // But proceeding with login anyway
        router.push("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
