import { addMonths, format, startOfMonth } from "date-fns";
import { getTranslations } from "next-intl/server";

import { GroupedData, MonthlyOverview } from "@/types";
import {
  getOverviewDataByMonth,
  getOverviewDataByYear,
  getTransactions,
} from "@/lib/actions/transaction";
import { getCategories } from "@/lib/actions/category";
import { groupTransactionsByDate } from "@/helper/groupTransactionsByDate";

import { Separator } from "@/components/ui/separator";
import TransactionModal from "@/components/transactions/TransactionModal";
import TransactionListItem from "@/components/transactions/TransactionListItem";
import TransactionOverview from "@/components/transactions/TransactionOverview";
import TransactionDailyOverview from "@/components/transactions/TransactionDailyOverview";
import Calendar from "@/components/transactions/Calendar";
import TransactionChart from "@/components/charts/TransactionChart";
import WelcomeMessage from "@/components/WelcomeMessage";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const Home = async ({ searchParams }: PageProps) => {
  const t = await getTranslations("transaction");

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

  if (!data || error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-gray-500">
          {error ? "Error fetching transactions" : "No transactions found"}
        </div>
      </div>
    );
  }

  const { data: monthlyOverview } = await getOverviewDataByMonth(
    format(new Date(fromDate as string), "yyyy-MM-dd")
  );

  const { data: yearlyOverview } = await getOverviewDataByYear(
    format(new Date(fromDate as string), "yyyy")
  );

  const { data: categoryList } = await getCategories();

  const displayYearlyOverview = yearlyOverview.some(
    (item: MonthlyOverview) => item.income !== 0 || item.expense !== 0
  );

  const hasTransactions = data.length > 0;

  const groupedData: GroupedData = groupTransactionsByDate(data);

  return (
    <div className="container mx-auto px-4 py-8">
      <WelcomeMessage />
      {hasTransactions && (
        <TransactionOverview
          income={monthlyOverview.total_income}
          expense={monthlyOverview.total_expense}
          net={monthlyOverview.total_amount}
        />
      )}
      {displayYearlyOverview && (
        <div className="p-4 bg-white rounded-xl shadow-md dark:bg-zinc-900 mb-4">
          <TransactionChart data={yearlyOverview} />
        </div>
      )}
      <div className="block sm:hidden p-4 bg-white rounded-xl shadow-md dark:bg-zinc-900 mb-4">
        <Calendar />
      </div>
      <div className="p-4 bg-white rounded-xl shadow-md dark:bg-zinc-900">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{t("transactions")}</h2>
          <div className="hidden md:block">
            <Calendar />
          </div>
          <TransactionModal categories={categoryList} />
        </div>
        <Separator className="my-4" />
        {!hasTransactions && (
          <div className="text-gray-500">{t("not_found")}</div>
        )}
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
            {hasTransactions &&
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
