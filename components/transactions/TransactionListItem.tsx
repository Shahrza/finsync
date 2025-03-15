import { Transaction, TransactionType } from "@/types";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { clsx } from "clsx";
import { TransactionDropdownMenu } from "@/components/transactions/TransactionDropdownMenu";
import { categories } from "@/utils/categories";

type Props = {
  transaction: Transaction;
};

const TransactionListItem = ({ transaction }: Props) => {
  return (
    <div
      key={transaction.id}
      className="p-4 rounded-md bg-neutral-100 mb-4 lat:mb-0"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center font-semibold">
          <div
            className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center mr-4",
              categories[transaction.category.value]?.color
            )}
          >
            <DynamicIcon
              size={20}
              color="#fff"
              name={categories[transaction.category.value].icon as IconName}
            ></DynamicIcon>
          </div>
          <div>
            <p className="text-gray-700">{transaction.category.name}</p>
            <p className="text-sm text-gray-500 font-normal">
              {transaction.note}
            </p>
          </div>
        </div>
        <div className="text-right flex items-center">
          <div
            className={`${
              transaction.type === TransactionType.Income
                ? "text-emerald-500"
                : "text-slate-600"
            } font-semibold mr-4`}
          >
            {`${
              transaction.type === TransactionType.Income ? "+" : "-"
            } $${transaction.amount.toFixed(2)}`}
          </div>
          <TransactionDropdownMenu id={transaction.id} />
        </div>
      </div>
    </div>
  );
};

export default TransactionListItem;
