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
    <div className="flex justify-between items-center">
      <div className="pl-4 pb-2 text-gray-600">{date}</div>
      <div>
        <span className="mr-4">Expense: -{data.expense}</span>
        <span className="mr-4">Income: +{data.income}</span>
        <span>Total: {data.net}</span>
      </div>
    </div>
  );
};

export default TransactionOverview;
