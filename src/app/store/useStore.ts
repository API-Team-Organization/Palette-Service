import {create} from "zustand";

interface GridStore {
  grid: number[];
  setGrid: (num: number) => void;
}

export const useGridStore = create<GridStore>((set) => ({
  grid: [],
  setGrid: (num) => set((state) => ({grid: [...state.grid, num]}))
}));
