import { create } from "zustand";

interface selectedDocsType{
    value:string,
    set:(value:string)=>void;
}

export const selectedDocsType = create<selectedDocsType>((set)=>({
    value:"All Docs",
    set: (value: string) => set({value})
}))