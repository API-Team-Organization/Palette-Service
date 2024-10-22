import { create } from "zustand";

interface GridStore {
  grid: number[];
  setGrid: (num: number) => void;
}

interface ModalStore {
  isOpen: boolean
  setOpen: (isOpen: boolean) => void
}

interface Birth {
  year: number
  month: number
  day: number
}

interface BirthStore {
  birth: Birth
  setYear: (year: number) => void
  setMonth: (month: number) => void
  setDay: (day: number) => void
}

export const useGridStore = create<GridStore>((set) => ({
  grid: [],
  setGrid: (num) =>
      set((state) => {
        // 숫자가 이미 리스트에 있는지 확인
        if (state.grid.includes(num)) {
          // 중복된 숫자가 있으면 해당 숫자를 삭제
          return { grid: state.grid.filter((n) => n !== num) };
        } else {
          // 중복된 숫자가 없으면 리스트에 추가
          return { grid: [...state.grid, num] };
        }
      })
}));

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  setOpen: (isOpen: boolean) => set({ isOpen }),
}));

export const useBirthStore = create<BirthStore>((set) => ({
  birth: { year: 0, month: 0, day: 0 },
  setYear: (year: number) => set((state) => ({ birth: { ...state.birth, year } })),
  setMonth: (month: number) => set((state) => ({ birth: { ...state.birth, month } })),
  setDay: (day: number) => set((state) => ({ birth: { ...state.birth, day } })),
}));
