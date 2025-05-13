import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslations } from "next-intl";

const AuthCardHeader = () => {
  const t = useTranslations("auth");
  return (
    <CardHeader className="text-center mb-2">
      <CardTitle className="text-2xl">FinSync</CardTitle>
      <CardDescription>{t("manage_finances")}</CardDescription>
    </CardHeader>
  );
};

export default AuthCardHeader;
