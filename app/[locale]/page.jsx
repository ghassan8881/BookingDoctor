"use client";
import { useTranslations } from "next-intl";
import { Link } from "../../i18n/navigation";
import { useState } from "react";
import Image from "next/image";
import heroImage from "../../public/images/doctor-hero.jpg";

export default function Home() {
  const t = useTranslations("Home");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate search loading
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Hero Section with Image */}
      <section className="relative flex-grow">
        <Image
          src="/images/doctor-hero.jpg" 
          alt={t("HeroAltText")}
          className="w-full h-screen object-cover"
          priority
            fill  // Add this for full-width/height images
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center p-4">
          <div className="text-center text-white max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="block">{t("DoctorBookingSystem")}</span>
              <span className="block mt-2 text-blue-300">
                {t("QualityHealthcare")}
              </span>
            </h1>
            <p className="text-xl mb-8">{t("HeroDescription")}</p>

            {/* Search Component */}
            <div className="mt-8 w-full max-w-2xl mx-auto bg-white bg-opacity-90 p-4 rounded-lg shadow-xl">
              <div className="flex">
                <input
                  type="text"
                  placeholder={t("SearchDoctors")}
                  className="flex-grow px-4 py-3 rounded-l-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                />
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition flex items-center"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t("Searching")}
                    </>
                  ) : (
                    t("Search")
                  )}
                </button>
              </div>
            </div>
            <div className="mt-8">
              <Link
                href="/doctors"
                className="px-8 py-3 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 inline-block"
              >
                {t("FindYourDoctor")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
<footer className="bg-blue-900 text-white py-8">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h3 className="text-xl font-bold mb-4">{t("BrandName")}</h3>
        <p className="text-blue-200">{t("Tagline")}</p>
      </div>
      <div>
        <h4 className="font-semibold mb-4">{t("QuickLinks")}</h4>
        <ul className="space-y-2">
          <li>
            <Link href="/doctors" className="hover:text-blue-300 transition">
              {t("FindDoctor")}
            </Link>
          </li>
          <li>
            <Link href="/services" className="hover:text-blue-300 transition">
              {t("Services")}
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-blue-300 transition">
              {t("AboutUs")}
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4">{t("Contact")}</h4>
        <ul className="space-y-2 text-blue-200">
          <li>{t("Address")}</li>
          <li>{t("Phone")}</li>
          <li>{t("Email")}</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4">{t("FollowUs")}</h4>
        {/* Social icons remain the same */}
      </div>
    </div>
    <div className="border-t border-blue-800 mt-8 pt-6 text-center text-blue-300">
      <p>{t("Copyright", { year: new Date().getFullYear() })}</p>
    </div>
  </div>
</footer>    </div>
  );
}