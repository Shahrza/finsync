import SignOutBtn from "../auth/SignOutBtn";
import { ModeToggle } from "./ModeToggle";

type Props = {
  fullName: string;
};

const Header = async ({ fullName }: Props) => {
  return (
    <div className="shadow-md bg-white dark:bg-zinc-900">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="text-2xl text-stone-800 font-semibold dark:text-white">
          FinSync
        </div>
        <div className="flex items-center">
          <div className="text-stone-800 mr-4 dark:text-white">
            Welcome, <span className="font-semibold">{fullName}</span>
          </div>
          <SignOutBtn className="mr-2 dark:border-stone-400" />
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default Header;
