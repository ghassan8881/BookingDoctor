"use client";

import { routing, usePathname, useRouter } from "../i18n/routing";
import { useParams } from "next/navigation";

export default function LocaleSwitcherSelect({ defaultValue, label }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(e) {
    const nextLocale = e.target.value;
    router.replace(
      // @ts-expect-error -- TypeScript will validate that only known `params`
      // are used in combination with a given `pathname`. Since the two will
      // always match for the current route, we can skip runtime checks.
      { pathname, params },
      { locale: nextLocale }
    );
  }

  return (
    <select
      className="form-control form-control-lg"
      style={{ marginTop: "15px" }}
      id="filter"
      defaultValue={defaultValue}
      onChange={onSelectChange}
    >
      {routing.locales?.map((locale) => (
        <option key={locale} value={locale}>
          {locale.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
