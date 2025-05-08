export enum TransactionType {
  Income = "income",
  Expense = "expense",
}

export type Transaction = {
  id: string;
  amount: number;
  type: TransactionType;
  note: string;
  date: string;
  category: {
    name: string;
    value: string;
  };
};

export type GroupedData = {
  [key: string]: {
    income: number;
    expense: number;
    net: number;
    transactions: Transaction[];
  };
};

export type Category = {
  [key: string]: {
    icon: string;
    color: string;
  };
};

export type MonthlyOverview = {
  month: string;
  income: number;
  expense: number;
};
