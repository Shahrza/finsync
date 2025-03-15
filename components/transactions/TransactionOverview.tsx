import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";

type Props = {
  income: number;
  expense: number;
  net: number;
};

const TransactionOverview = ({ income, expense, net }: Props) => {
  return (
    <div className="flex justify-between items-center mb-4 w-[50%]">
      <div className="w-[100%] mr-4 shadow-md rounded-2xl bg-emerald-50 p-4 flex items-end">
        <div className="bg-green-400 rounded-2xl p-4 w-[fit-content] mr-6 shadow-lg">
          <TrendingUp size={24} color="#fff" />
        </div>
        <div>
          <p className="text-2xl font-semibold text-emerald-500">${income}</p>
          <p className="text-sm text-gray-500">Income</p>
        </div>
      </div>

      <div className="w-[100%] mr-4 shadow-md rounded-2xl bg-rose-50 p-4 flex items-end">
        <div className="bg-red-400 rounded-2xl p-4 w-[fit-content] mr-6 shadow-lg">
          <TrendingDown size={24} color="#fff" />
        </div>
        <div>
          <p className="text-2xl font-semibold text-rose-500">${expense}</p>
          <p className="text-sm text-gray-500">Expense</p>
        </div>
      </div>

      <div className="w-[100%] mr-4 shadow-md rounded-2xl bg-sky-50 p-4 flex items-end">
        <div className="bg-sky-400 rounded-2xl p-4 w-[fit-content] mr-6 shadow-lg">
          <DollarSign size={24} color="#fff" />
        </div>
        <div>
          <p className="text-2xl font-semibold text-sky-500">
            {net === 0 ? "0" : net > 0 ? `+$${net}` : `-$${Math.abs(net)}`}
          </p>
          <p className="text-sm text-gray-500">Total</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionOverview;
