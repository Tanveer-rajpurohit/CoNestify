import { create } from "zustand";

interface selectedFileType{
    value:string,
    set:(value:string)=>void;
}

export const selectedFileType = create<selectedFileType>((set)=>({
    value:"Recently viewed",
    set: (value: string) => set({value})
}))

interface openedFileData {
    data: {
        id: string;
        name: string;
        type: string;
        data: [];
    } | null;
    set: (data: { id: string; name: string; type: string; data: [] } | null) => void;
    clear: () => void;
}
export const openedFileData = create<openedFileData>((set) => ({
    data: null,
    set: (data) => set({ data }),
    clear: () => set({ data: null }),
}));
