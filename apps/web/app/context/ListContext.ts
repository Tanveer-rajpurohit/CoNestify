import { create } from "zustand";

interface selectedListType{
    value:string,
    set:(value:string)=>void;
}

export const selectedListType = create<selectedListType>((set)=>({
    value:"All List",
    set: (value: string) => set({value})
}))