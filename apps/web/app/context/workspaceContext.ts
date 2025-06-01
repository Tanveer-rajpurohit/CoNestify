import { create } from "zustand";

interface WorkspaceId{
    value:string | null,
    set:(value:string)=>void;
}

export const selectedWorkspaceId = create<WorkspaceId>((set)=>({
    value:null,
    set: (value: string) => set({value})
}))