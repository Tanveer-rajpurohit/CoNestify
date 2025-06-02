import { create } from "zustand";

interface WorkspaceId{
    value:string | null,
    set:(value:string)=>void;
}

export const selectedWorkspaceId = create<WorkspaceId>((set)=>({
    value:null,
    set: (value: string) => set({value})
}))



interface WorkspaceData {
    id: string;
    name: string;
    description?: string | null;
    inviteLink?: string | null;
    createdAt: string;
    channels: WorkspaceChannel[];
    members: WorkspaceMember[];
}

interface WorkspaceUser {
    id: string;
    name?: string | null;
    email: string;
    image: string;
}
interface WorkspaceMember {
    id: string;
    user: WorkspaceUser;
    role: string;
    joinedAt: string;
}
interface WorkspaceChannel {
    id: string;
    name: string;
    description?: string | null;
    isPrivate: boolean;
}

type WorkspaceContext = {
    data: WorkspaceData;
    setData: (data: Partial<WorkspaceData>) => void;
};

export const workspaceContext = create<WorkspaceContext>((set) => ({
    data: {
        id: "",
        name: "",
        description: null,
        inviteLink: null,
        createdAt: "",
        channels: [],
        members: [],
    },
    setData: (data: Partial<WorkspaceData>) =>
        set((state) => ({
            data: { ...state.data, ...data },
        })),
}));

type currentUserId ={
    value:string|null,
    set: (value:string)=>void;
}

export const currentUserId = create<currentUserId>((set)=>({
    value: null,
    set: (value: string) => set({value})
}))

interface SelectedCommunicationData {
  value: WorkspaceChannel | WorkspaceMember | string | null;
  type: "chat" | "meet" | "channel" | "dm";
}

interface SelectedCommunicationStore {
  data: SelectedCommunicationData;
  set: (data: SelectedCommunicationData) => void;
}

export const selectedCommunication = create<SelectedCommunicationStore>((set) => ({
  data: {
    value: null,
    type: "channel",
  },
  set: (data) => set({ data }),
}));

export interface MessageTypes {
    id: string;
    content: string;
    createdAt: string;
    type: string;
    senderId: string;
    sender: WorkspaceUser;
    channelId: string | null;
    workspaceId: string;
    receiverId: string | null;
    canvas: { id: string; title: string } | null;
    canvasId: string | null;
    doc: { id: string; title: string } | null;
    docId: string | null;
    fileId: string | null;
    list: { id: string; title: string } | null;
    listId: string | null;
}

interface AllMessagesStore {
    data: MessageTypes[];
    set: (data: MessageTypes[]) => void;
}

export const allMessages = create<AllMessagesStore>((set) => ({
    data: [],
    set: (data: MessageTypes[]) => set({ data }),
}));
