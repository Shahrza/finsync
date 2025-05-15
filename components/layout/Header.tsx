import SignOutBtn from "../auth/SignOutBtn";
import LangToggle from "./LangSwitcher";
import { ModeToggle } from "./ModeToggle";

type Props = {
  isAuthenticated: boolean;
};

const Header = async ({ isAuthenticated }: Props) => {
  return (
    <div className="shadow-md bg-white dark:bg-zinc-900">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="text-2xl text-stone-800 font-semibold dark:text-white mr-4">
          FinSync
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
