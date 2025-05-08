import { GroupedData, TransactionType } from "@/types";

export const groupTransactionsByDate = (data: any) => {
  return data.reduce((acc: GroupedData, item) => {
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
    acc[dayKey].transactions.unshift(item);

    return acc;
  }, {});
};
