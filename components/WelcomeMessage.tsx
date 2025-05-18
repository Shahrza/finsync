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
        <h2 className="text-stone-800 mb-6 ml-1 dark:text-white text-xl md:text-2xl">
          {t("welcome")}, <span className="font-semibold">{fullName}</span>
        </h2>
      )}
    </>
  );
};

export default WelcomeMessage;
