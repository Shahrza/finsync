import { addMonths, format, startOfMonth } from "date-fns";
import { enUS, az } from "date-fns/locale";
import { getLocale, getTranslations } from "next-intl/server";

import { GroupedData, MonthlyOverview } from "@/types";
import {
  getOverviewDataByMonth,
  getOverviewDataByYear,
  getTransactions,
  getCategoryPercentagesByMonth,
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
import CategoryChart from "@/components/charts/CategoryChart";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const Home = async ({ searchParams }: PageProps) => {
  const t = await getTranslations("transaction");
  const chartT = await getTranslations("chart");
  const locale = await getLocale();

  const {
    fromDate = format(startOfMonth(new Date()), "yyyy-MM-dd"),
    toDate = format(startOfMonth(addMonths(new Date(), 1)), "yyyy-MM-dd"),
    ascending = false,
  } = await searchParams;

  const month = new Date(fromDate as string).getMonth() + 1;
  const year = new Date(fromDate as string).getFullYear();

  const dateRange =
    format(new Date(fromDate as string), "MM.yyyy") +
    " - " +
    format(new Date(toDate as string), "MM.yyyy");

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

  const { data: categoryData } = await getCategoryPercentagesByMonth(
    month,
    year
  );

  const localizedYearlyOverview = yearlyOverview.map(
    (item: MonthlyOverview, index: number) => ({
      ...item,
      month: format(new Date(2025, index, 1), "MMMM", {
        locale: locale === "en" ? enUS : az,
      }),
    })
  );

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
          <TransactionChart data={localizedYearlyOverview} />
        </div>
      )}
      {hasTransactions && (
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="w-full">
            <CategoryChart
              data={categoryData.income}
              label={chartT("income_by_category")}
              dateRange={dateRange}
            />
          </div>
          <div className="w-full">
            <CategoryChart
              data={categoryData.expense}
              label={chartT("expense_by_category")}
              dateRange={dateRange}
            />
          </div>
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
