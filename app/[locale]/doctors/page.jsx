"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "../../../i18n/navigation";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function DoctorsList(props) {
  const t = useTranslations("Home");
  const [doctors, setDoctors] = useState([]);
  const { data: session, status } = useSession();
  const { locale } = props.params;

  useEffect(() => {
    console.log("propsss15", props);
    async function fetchDoctors() {
      const response = await fetch("/api/doctors");
      const data = await response.json();
      setDoctors(data);
    }
    fetchDoctors();
  }, [locale]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") {
    redirect("/login");
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {t("DoctorsList")}
      </h1>

      {doctors.length === 0 ? (
        <p className="text-gray-500">No doctors available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.UserID}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6 flex flex-col items-center text-center"
            >
              {/* صورة رمزية (افتراضية الآن) */}
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold mb-4">
                {doctor.FirstName.charAt(0)}
              </div>

              {/* اسم الطبيب */}
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {locale === "ar"
                  ? `الطبيب ${doctor.FirstName_ar} ${doctor.LastName_ar}`
                  : `Dr. ${doctor.FirstName} ${doctor.LastName}`}
              </h2>

              {/* التخصص أو أي معلومات إضافية */}
              <p className="text-gray-500 mb-4">
                {locale === "ar"
                  ? doctor.Specialty_ar || "تخصص غير محدد"
                  : doctor.Specialty || "Unknown specialty"}
              </p>

              {/* رابط صفحة الطبيب */}
              <Link
                // href={`/doctors/${doctor.UserID}`}
                href={{
                  pathname: `/doctors/${doctor.UserID}`,
                  query: { locale }, // Pass locale as a query param
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {locale === "ar" ? "عرض الملف" : "View Profile"}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
