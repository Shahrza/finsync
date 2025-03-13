import { create } from "zustand";

type State = {
  editingTransactionId: string | null;
};

type Action = {
  setEditingTransactionId: (id: string) => void;
};

const useTransactionStore = create<State & Action>((set) => ({
  editingTransactionId: null,
  setEditingTransactionId: (id: string) => set({ editingTransactionId: id }),
}));

export default useTransactionStore;
