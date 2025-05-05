import { GroupedData, TransactionType } from "@/types";
import { getTransactions } from "@/lib/actions/transaction";
import { getCategories } from "@/lib/actions/category";

import TransactionModal from "@/components/transactions/TransactionModal";
import TransactionListItem from "@/components/transactions/TransactionListItem";
import TransactionOverview from "@/components/transactions/TransactionOverview";
import TransactionDailyOverview from "@/components/transactions/TransactionDailyOverview";
import { Separator } from "@/components/ui/separator";
import Calendar from "@/components/transactions/calendar";
import { addMonths, format, startOfMonth } from "date-fns";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const Home = async ({ searchParams }: PageProps) => {
  const {
    fromDate = format(startOfMonth(new Date()), "yyyy-MM-dd"),
    toDate = format(startOfMonth(addMonths(new Date(), 1)), "yyyy-MM-dd"),
    ascending = false,
  } = await searchParams;

  const { data, error } = await getTransactions({
    fromDate: fromDate as string,
    toDate: toDate as string,
    ascending: ascending === "true",
  });

  const { data: categoryList } = await getCategories();

  if (!data || error) return;

  const groupedData: GroupedData = data.reduce((acc: GroupedData, item) => {
    const transaction = {
      ...item,
      category: Array.isArray(item.category) ? item.category[0] : item.category,
    };

    const dayKey = new Date(item.date)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, ".");

    if (!acc[dayKey]) {
      acc[dayKey] = {
        income: 0,
        expense: 0,
        net: 0,
        transactions: [],
      };
    }

    if (item.type === TransactionType.Income) {
      acc[dayKey].income += item.amount;
    } else {
      acc[dayKey].expense += Math.abs(item.amount);
    }
    acc[dayKey].net +=
      item.type === TransactionType.Income ? item.amount : -item.amount;
    acc[dayKey].transactions.unshift(transaction);

    return acc;
  }, {});

  const { income, expense, net } =
    Object.keys(groupedData).length !== 0
      ? structuredClone(Object.values(groupedData)).reduce((acc, item) => {
          acc.income += item.income;
          acc.expense += item.expense;
          acc.net += item.net;
          return acc;
        })
      : { income: 0, expense: 0, net: 0 };

  return (
    <div className="container mx-auto px-4 py-8">
      {Object.keys(groupedData).length !== 0 && (
        <TransactionOverview income={income} expense={expense} net={net} />
      )}
      <div className="p-4 bg-white rounded-xl shadow-md dark:bg-zinc-900">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <Calendar />
          <TransactionModal categories={categoryList} />
        </div>
        <Separator className="my-4" />
        {Object.entries(groupedData)?.map(([date, data]) => (
          <div key={date}>
            <div className="mb-4 last:mb-0">
              <TransactionDailyOverview date={date} data={data} />
              {data.transactions.map((transaction) => (
                <TransactionListItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </div>
            {Object.keys(groupedData).length > 1 &&
              Object.keys(groupedData).length - 1 !==
                Object.keys(groupedData).indexOf(date) && (
                <Separator className="mt-6 mb-4" />
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
