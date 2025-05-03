import { create } from "zustand";

interface selectedCanvasType{
    value:string,
    set:(value:string)=>void;
}

export const selectedCanvasType = create<selectedCanvasType>((set)=>({
    value:"All canvases",
    set: (value: string) => set({value})
}))