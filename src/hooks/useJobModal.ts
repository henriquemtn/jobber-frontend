import { create } from "zustand";

interface JobModalStore {
  isOpen: boolean;
  taskId: number | null; 
  onOpen: (id: number) => void;
  onClose: () => void;
}

const useJobModal = create<JobModalStore>((set) => ({
  isOpen: false,
  taskId: null,
  onOpen: (id: number) => set({ isOpen: true, taskId: id }),
  onClose: () => set({ isOpen: false, taskId: null }),
}));

export default useJobModal;
