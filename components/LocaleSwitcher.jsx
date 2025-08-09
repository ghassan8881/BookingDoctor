import { routing } from "../i18n/routing";
// import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import LocaleSwitcherSelect from "../components/LocaleSwitcherSelect";

export default function LocaleSwitcher() {
  const locale = useLocale();

  return (
    <div className="flex items-center gap-2">
      {/* <Globe className="h-4 w-4 text-muted-foreground" /> */}
      <LocaleSwitcherSelect defaultValue={locale} label={locale}>
        {routing.locales.map((cur) => (
          <option key={cur} value={cur}>
            {cur}
          </option>
        ))}
      </LocaleSwitcherSelect>
    </div>
  );
}
