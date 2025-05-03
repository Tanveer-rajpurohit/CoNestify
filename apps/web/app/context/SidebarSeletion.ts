import { create } from "zustand";

interface SidebarSelectionState {
  value: string;
  set: (value: string) => void;
}

export const useSidebarSelectionTab = create<SidebarSelectionState>((set) => ({
  value: "",
  set: (value: string) => set({ value }),
}));

interface SidebarSelectionStateCommunication {
  data: {
    value: string;
    type: "chat" | "meet" | "channel" | "dm";
  };
  set: (data: {
    value: string;
    type: "chat" | "meet" | "channel" | "dm";
  }) => void;
}

export const useSidebarSelectionCommunication =
  create<SidebarSelectionStateCommunication>((set) => ({
    data: {
      value: "all-testing",
      type: "channel",
    },
    set: (data) => set({ data }),
  }));
