"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import SignOutBtn from "../auth/SignOutBtn";
import LangToggle from "./LangSwitcher";
import { ModeToggle } from "./ModeToggle";
import { Button } from "../ui/button";

type Props = {
  isAuthenticated: boolean;
};

const Header = ({ isAuthenticated }: Props) => {
  const t = useTranslations("layout");
  const pathname = usePathname();
  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-stone-900 shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex justify-between items-center">
          <div className="text-2xl text-stone-800 font-semibold dark:text-white mr-4">
            FinSync
          </div>
          <div>
            <Button variant="link">
              <Link
                href="/"
                className={`text-stone-800 dark:text-white text-md ${
                  pathname === "/" ? "underline text-cyan-800" : ""
                }`}
              >
                {t("home")}
              </Link>
            </Button>
            <Button variant="link">
              <Link
                href="/transactions"
                prefetch={true}
                className={`text-stone-800 dark:text-white mr-4 ${
                  pathname === "/transactions" ? "underline text-cyan-800" : ""
                }`}
              >
                {t("transactions")}
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center">
          <div className="mr-2">
            <LangToggle />
          </div>
          <ModeToggle />
          {isAuthenticated && (
            <SignOutBtn className="ml-2 dark:border-stone-400" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
