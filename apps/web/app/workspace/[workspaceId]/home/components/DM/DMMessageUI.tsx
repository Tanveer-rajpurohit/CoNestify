import {
  allMessages,
  currentUserId,
  MessageTypes,
  selectedCommunication,
  selectedWorkspaceId,
} from "@context/workspaceContext";
import { useGetMessage } from "app/hook/useGetMessage";
import { ChevronDown, Brush, FileText, ListTodo } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { RingLoader } from "react-spinners";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}


const DMMessageUI = () => {
  const workspaceId = selectedWorkspaceId((state) => state.value);
  const selected = selectedCommunication((state) => state.data) as {
    value?: { user: {
      id: string
    }};
  };

  const Messages = allMessages((state) => state.data) as MessageTypes[];
  const SetMessages = allMessages((state) => state.set);
  const userId = currentUserId((state) => state.value);

  const { DMMessage, loading } = useGetMessage();
  const scrollRef = useRef<HTMLDivElement>(null);

  const isUserAtBottom = () => {
    const el = scrollRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 50; // 50px threshold
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  // On new messages, scroll if user is at bottom
  useEffect(() => {
    if (isUserAtBottom()) {
      scrollToBottom();
    }
  }, [Messages.length]);



  // Group messages by formatted date
  const groupMessagesByDate = (messages: MessageTypes[]) => {
    const groups: { [key: string]: MessageTypes[] } = {};
    if(messages.length === 0) return groups
    messages?.forEach((message) => {
      const groupDate = formatDate(message.createdAt);
      if (!groups[groupDate]) {
        groups[groupDate] = [];
      }
      groups[groupDate].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(Messages);

  useEffect(() => {
    if (workspaceId && selected.value?.user.id) {
      DMMessage(workspaceId, selected.value.user.id).then((data) => {
        SetMessages(data);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, selected.value?.user.id]);

  // File click handler
  const onFileClick = (
    fileId: string,
    workspaceId: string,
    fileType: string
  ) => {
    if (fileType === "canvas") {
      window.location.href = `/workspace/${workspaceId}/canvas/${fileId}`;
    } else if (fileType === "doc") {
      window.location.href = `/workspace/${workspaceId}/docs/${fileId}`;
    } else if (fileType === "list") {
      window.location.href = `/workspace/${workspaceId}/lists/${fileId}`;
    }
  };

  // Helper to render file message
  const renderFileMessage = (msg: MessageTypes) => {
    if (msg.type === "canvas" && msg.canvas) {
      return (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1CB6EB]/10 hover:bg-[#1CB6EB]/20 transition cursor-pointer"
          onClick={() => {
            if (msg.canvas) {
              onFileClick(msg.canvas.id, workspaceId as string, "canvas");
            }
          }}
        >
          <span className="w-8 h-8 flex items-center justify-center rounded-md bg-[#1CB6EB]">
            <Brush className="w-5 h-5 text-white" />
          </span>
          <span className="font-semibold text-[#1CB6EB]">
            {msg.canvas.title || "Untitled Canvas"}
          </span>
        </div>
      );
    }
    if (msg.type === "doc" && msg.doc) {
      return (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#E19B06]/10 hover:bg-[#E19B06]/20 transition cursor-pointer"
          onClick={() => {
            if (msg.doc) {
              onFileClick(msg.doc.id, workspaceId as string, "doc");
            }
          }}
        >
          <span className="w-8 h-8 flex items-center justify-center rounded-md bg-[#E19B06]">
            <FileText className="w-5 h-5 text-white" />
          </span>
          <span className="font-semibold text-[#E19B06]">
            {msg.doc.title || "Untitled Doc"}
          </span>
        </div>
      );
    }
    if (msg.type === "list" && msg.list) {
      return (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#7D7DE3]/10 hover:bg-[#7D7DE3]/20 transition cursor-pointer"
          onClick={() => {
            if (msg.list) {
              onFileClick(msg.list.id, workspaceId as string, "list");
            }
          }}
        >
          <span className="w-8 h-8 flex items-center justify-center rounded-md bg-[#6565c4]">
            <ListTodo className="w-5 h-5 text-white" />
          </span>
          <span className="font-semibold text-[#6565c4]">
            {msg.list.title || "Untitled List"}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div ref={scrollRef} className="px-4">
      {loading || !workspaceId ? (
        <div className="flex flex-col items-center justify-center h-32">
          <RingLoader color="#007A5A" size={40} />
          <p className="text-gray-500 mt-2">Loading chats...</p>
        </div>
      ) : (
        Object.entries(messageGroups).map(([date, messages]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="relative w-full my-4">
              <div className="absolute top-1/2 left-0 right-0 h-[0.1px] bg-gray-300 z-0" />
              <div className="relative z-10 flex justify-center">
                <div className="bg-white px-4 py-1 rounded-full border text-sm text-gray-600 flex items-center shadow-sm">
                  {date}
                  <ChevronDown className="w-5 h-5 pl-1" />
                </div>
              </div>
            </div>
            {/* Messages for this date */}
            {messages.map((msg) => {
              const isOwn = msg.sender?.id === userId;
              return (
                <div
                  key={msg.id}
                  className={`flex items-end mb-6 ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  {/* Avatar */}
                  {!isOwn &&
                    (msg.sender?.image ? (
                      <Image
                        src={msg.sender.image}
                        alt={msg.sender?.name || "User"}
                        height={40}
                        width={40}
                        className="w-10 h-10 rounded-full mr-3 shadow"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-700 text-white flex items-center justify-center mr-3 text-lg font-bold shadow">
                        {msg.sender?.name
                          ? msg.sender.name.charAt(0).toUpperCase()
                          : "?"}
                      </div>
                    ))}

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[70%] px-5 py-3 shadow-md ${
                      isOwn
                        ? "bg-gradient-to-r from-[#00b289] to-[#007A5A] text-white rounded-2xl rounded-br-md ml-2"
                        : "bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-bl-md mr-2"
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      <span className="font-semibold">
                        {msg.sender?.name || "Unknown"}
                      </span>
                      <span
                        className={`text-xs ml-2 ${isOwn ? "text-gray-200" : "text-gray-700"}`}
                      >
                        {msg.sender?.email || ""}
                      </span>
                      <span
                        className={`text-xs ml-2 ${isOwn ? "text-gray-300" : "text-gray-500"}`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {/* Message Content */}
                    {msg.content && (
                      <p className="text-base break-words mb-2">
                        {msg.content}
                      </p>
                    )}
                    {msg.type !== "text" && renderFileMessage(msg)}
                  </div>

                  {/* Avatar for own message */}
                  {isOwn &&
                    (msg.sender?.image ? (
                      <Image
                        src={msg.sender.image}
                        alt={msg.sender?.name || "User"}
                        height={40}
                        width={40}
                        className="w-10 h-10 rounded-full ml-3 shadow"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center ml-3 text-lg font-bold shadow">
                        {msg.sender?.name
                          ? msg.sender.name.charAt(0).toUpperCase()
                          : "?"}
                      </div>
                    ))}
                </div>
              );
            })}
          </div>
        ))
      )}
      <div className="h-20"></div>
    </div>
  );
};

export default DMMessageUI;