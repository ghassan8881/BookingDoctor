"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import NavBar from "./NavBar";
import { useTranslations } from "next-intl";
import { useUser } from "../app/hooks/useUser";
import { useLocale } from "next-intl";

export default function Header() {
  const t = useTranslations("Home");
  const locale = useLocale();

  const { data: session, status } = useSession();
  const { user } = useUser();
  console.log(user, "🚀 ~ Header ~ session:13", session);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const loading = status === "loading";

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <NavBar />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {!loading && (
            <>
              {!session ? (
                <>
                  <Link
                    href="/login"
                    className="px-3 py-2 rounded hover:bg-gray-700 transition"
                  >
                    {t("Login")}
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 py-2 rounded hover:bg-gray-700 transition"
                  >
                    {t("Register")}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className="px-3 py-2 rounded hover:bg-gray-700 transition"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="px-3 py-2 rounded hover:bg-gray-700 transition"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="px-3 py-2 rounded hover:bg-gray-700 transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </>
          )}
          {/* // Add this inside the logged-in section of your header */}
          {session && (
            <div className="flex items-center space-x-2">
              <span className="hidden sm:inline">
                {/* Hello, {session.user.name || session.user.email} */}
                {/* Hello, {user.FullName} */}
                {user.Role == "doctor"
                  ? locale == "ar"
                    ? `مرحباً الطبيب ${user.FullName_ar}`
                    : `Hello Dr. ${user.FullName}`
                  : locale == "ar"
                  ? `مرحباً  ${user.FullName_ar}`
                  : `Hello  ${user.FullName}`}
              </span>
              {/* Add user avatar if available */}
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full"
                />
              )}
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-700 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-700 p-4">
          <div className="flex flex-col space-y-2">
            {!loading && (
              <>
                {!session ? (
                  <>
                    <Link
                      href="/login"
                      className="px-3 py-2 rounded hover:bg-gray-600 transition block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="px-3 py-2 rounded hover:bg-gray-600 transition block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className="px-3 py-2 rounded hover:bg-gray-600 transition block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="px-3 py-2 rounded hover:bg-gray-600 transition block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        setMobileMenuOpen(false);
                      }}
                      className="px-3 py-2 rounded hover:bg-gray-600 transition text-left"
                    >
                      Logout
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
