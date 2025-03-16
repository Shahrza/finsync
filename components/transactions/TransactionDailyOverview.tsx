type Props = {
  date: string;
  data: {
    expense: number;
    income: number;
    net: number;
  };
};

const TransactionOverview = ({ date, data }: Props) => {
  return (
    <div className="flex justify-between items-center text-sm px-4 mb-2">
      <div className="text-gray-600 dark:text-gray-100">{date}</div>
      <div className="font-semibold">
        <span className="mr-4 text-emerald-500">${data.income}</span>
        <span className="text-rose-500">${data.expense}</span>
      </div>
    </div>
  );
};

export default TransactionOverview;
