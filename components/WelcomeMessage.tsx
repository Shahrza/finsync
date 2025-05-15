"use client";

import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import { useTranslations } from "next-intl";

const WelcomeMessage = () => {
  const t = useTranslations("auth");
  const user = useContext(UserContext);
  const fullName = user?.user_metadata?.fullName || user?.user_metadata?.email;

  return (
    <>
      {fullName && (
        <div className="text-stone-800 mb-6 ml-1 dark:text-white">
          {t("welcome")}, <span className="font-semibold">{fullName}</span>
        </div>
      )}
    </>
  );
};

export default WelcomeMessage;
