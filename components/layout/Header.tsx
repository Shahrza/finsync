"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-stone-900 shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex justify-between items-center">
          <div className="text-2xl text-stone-800 font-semibold dark:text-white mr-4">
            FinSync
          </div>
          {isAuthenticated && (
            <div className="hidden md:flex">
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
                    pathname === "/transactions"
                      ? "underline text-cyan-800"
                      : ""
                  }`}
                >
                  {t("transactions")}
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div
          className={`${
            isAuthenticated ? "md:flex hidden" : ""
          } flex items-center`}
        >
          <div className="mr-2">
            <LangToggle />
          </div>
          <ModeToggle />
          {isAuthenticated && (
            <SignOutBtn className="ml-2 dark:border-stone-400" />
          )}
        </div>

        {isAuthenticated && (
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-stone-800 dark:text-white"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        )}
      </div>

      {isMobileMenuOpen && isAuthenticated && (
        <div className="md:hidden bg-white dark:bg-stone-900 border-t border-gray-200 dark:border-stone-700">
          <div className="container mx-auto p-4 space-y-4">
            <div className="space-y-2">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === "/"
                    ? "bg-stone-100 dark:bg-stone-200 text-stone-800 dark:text-stone-800"
                    : "text-stone-800 dark:text-white hover:bg-gray-100 dark:hover:bg-stone-800"
                }`}
              >
                {t("home")}
              </Link>
              <Link
                href="/transactions"
                onClick={closeMobileMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === "/transactions"
                    ? "bg-stone-100 dark:bg-stone-200 text-stone-800 dark:text-stone-800"
                    : "text-stone-800 dark:text-white hover:bg-gray-100 dark:hover:bg-stone-800"
                }`}
              >
                {t("transactions")}
              </Link>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-stone-700">
              <div className="flex items-end justify-between">
                <LangToggle />
                <ModeToggle />
                <SignOutBtn className="dark:border-stone-400" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
