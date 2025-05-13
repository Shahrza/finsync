import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { getTranslations } from "next-intl/server";

type Props = {
  income: number;
  expense: number;
  net: number;
};

const TransactionOverview = async ({ income, expense, net }: Props) => {
  const t = await getTranslations("transaction");
  return (
    <div className="flex md:flex-nowrap flex-wrap justify-between items-center md:mb-8 mb-4 md:w-[50%] w-[100%]">
      <div className="w-[100%] bg-white rounded-2xl p-4 flex items-end md:mr-4 mr-0 md:mb-0 mb-4 border border-neutral-200 dark:bg-zinc-900 dark:border-zinc-700">
        <div className="bg-green-400 rounded-2xl p-4 w-[fit-content] mr-6 shadow-lg">
          <TrendingUp size={24} color="#fff" />
        </div>
        <div>
          <p className="text-2xl font-semibold text-emerald-500">${income}</p>
          <p className="text-sm text-gray-500">{t("income")}</p>
        </div>
      </div>

      <div className="w-[100%] bg-white rounded-2xl p-4 flex items-end md:mr-4 mr-0 md:mb-0 mb-4 border border-neutral-200 dark:bg-zinc-900 dark:border-zinc-700">
        <div className="bg-red-400 rounded-2xl p-4 w-[fit-content] mr-6 shadow-lg">
          <TrendingDown size={24} color="#fff" />
        </div>
        <div>
          <p className="text-2xl font-semibold text-rose-500">${expense}</p>
          <p className="text-sm text-gray-500">{t("expense")}</p>
        </div>
      </div>

      <div className="w-[100%] bg-white rounded-2xl p-4 flex items-end md:mb-0 mb-4 border border-neutral-200 dark:bg-zinc-900 dark:border-zinc-700">
        <div className="bg-sky-400 rounded-2xl p-4 w-[fit-content] mr-6 shadow-lg">
          <DollarSign size={24} color="#fff" />
        </div>
        <div>
          <p className="text-2xl font-semibold text-sky-500">
            {net === 0 ? "0" : net > 0 ? `+$${net}` : `-$${Math.abs(net)}`}
          </p>
          <p className="text-sm text-gray-500">{t("total")}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionOverview;
