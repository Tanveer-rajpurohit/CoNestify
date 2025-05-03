import { create } from "zustand";

interface UserProfileVisiable {
  value: boolean;
  set: (value: boolean) => void;
}

export const UserProfileVisiable = create<UserProfileVisiable>((set) => ({
  value: false,
  set: (value: boolean) => set({ value }),
}));
