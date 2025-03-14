import { GroupedData, TransactionType } from "@/types";
import TransactionModal from "@/components/transactions/TransactionModal";
import { getTransactions } from "@/lib/actions/transaction";
import { getCategories } from "@/lib/actions/category";
import TransactionListItem from "@/components/transactions/TransactionListItem";
import TransactionOverview from "@/components/transactions/TransactionOverview";

const Home = async () => {
  const { data, error } = await getTransactions();
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
    acc[dayKey].net += item.amount;
    acc[dayKey].transactions.push(transaction);

    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 mt-8">
      <div className="p-4 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <TransactionModal categories={categoryList} />
        </div>
        {Object.entries(groupedData)?.map(([date, data]) => (
          <div key={date} className="mb-4 last:mb-0">
            <TransactionOverview date={date} data={data} />
            {data.transactions.map((transaction) => (
              <TransactionListItem
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
