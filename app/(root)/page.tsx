import { Button } from "@/components/ui/button";
import { categories } from "@/utils/categories";
import { createClient } from "@/utils/supabase/server";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { clsx } from "clsx";
import { GroupedData, TransactionType } from "@/types";

const Home = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transactions")
    .select(`id,amount,type,note,date,category:categories(name,value)`)
    .gte("date", `2025-01-01`)
    .lt("date", "2026-01-01")
    .order("date", { ascending: false });

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
    acc[dayKey].net += item.amount;
    acc[dayKey].transactions.push(transaction);

    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 mt-8">
      <div className="p-4 bg-white rounded shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <Button variant="outline" color="blue">
            + Add Transaction
          </Button>
        </div>
        {Object.entries(groupedData)?.map(([date, data], idx) => (
          <div key={idx} className="mb-4 last:mb-0">
            {" "}
            <div className="flex justify-between items-center">
              <div className="pl-4 pb-2 text-gray-600">{date}</div>
              <div>
                <span className="mr-4">Expense: -{data.expense}</span>
                <span className="mr-4">Income: +{data.income}</span>
                <span>Total: {data.net}</span>
              </div>
            </div>
            {data.transactions.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-md bg-slate-100 mb-4 lat:mb-0"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center font-semibold">
                      <div
                        className={clsx(
                          "w-8 h-8 rounded-full flex items-center justify-center mr-4",
                          categories[t.category.value]?.color
                        )}
                      >
                        <DynamicIcon
                          size={20}
                          color="#fff"
                          name={categories[t.category.value].icon as IconName}
                        ></DynamicIcon>
                      </div>
                      <div>
                        <p>{t.category.name}</p>
                        <p className="text-sm text-gray-500">{t.note}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`${
                        t.type === TransactionType.Income
                          ? "text-green-600"
                          : "text-red-600"
                      } font-semibold`}
                    >
                      {t.amount.toFixed(2)} $
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
