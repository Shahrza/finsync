import { useLocale, useTranslations } from "next-intl";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";

export default function LangToggle() {
  const t = useTranslations("locale_switcher");
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={[
        {
          value: "en",
          label: t("en"),
        },
        {
          value: "az",
          label: t("az"),
        },
      ]}
      label={t("label")}
    />
  );
}
