import SignOutBtn from "../auth/SignOutBtn";
import LangToggle from "./LangSwitcher";
import { ModeToggle } from "./ModeToggle";
import { getTranslations } from "next-intl/server";

type Props = {
  fullName: string;
};

const Header = async ({ fullName }: Props) => {
  const t = await getTranslations("auth");
  return (
    <div className="shadow-md bg-white dark:bg-zinc-900">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="text-2xl text-stone-800 font-semibold dark:text-white mr-4">
          FinSync
        </div>
        <div className="flex items-center">
          {fullName && (
            <div className="text-stone-800 mr-4 dark:text-white">
              {t("welcome")}, <span className="font-semibold">{fullName}</span>
            </div>
          )}
          <div className="mr-2">
            <LangToggle />
          </div>
          <ModeToggle />
          {fullName && <SignOutBtn className="ml-2 dark:border-stone-400" />}
        </div>
      </div>
    </div>
  );
};

export default Header;
