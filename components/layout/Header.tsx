import SignOutBtn from "../auth/SignOutBtn";
import { createClient } from "@/utils/supabase/server";

const Header = async () => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  return (
    <div className="shadow-lg">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="text-2xl text-stone-800 font-semibold">FinSync</div>
        <div className="flex items-center">
          <div className="text-stone-800 mr-4">
            Welcome,{" "}
            <span className="font-semibold">
              {data?.user?.user_metadata.fullName}{" "}
            </span>
          </div>
          <SignOutBtn />
        </div>
      </div>
    </div>
  );
};

export default Header;
