import { ChevronDown } from "lucide-react";
import React from "react"


// Define message type
type Message = {
  id: string;
  user: {
    name: string;
    avatar: string;
    initial: string;
  };
  content: string;
  timestamp: string;
  date: string;
  time: string;
};


const MessageUI = () => {
  
    // Sample message data with dates
    const messageData: Message[] = [
      {
        id: "1",
        user: {
          name: "Tanveer Singh",
          avatar: "",
          initial: "T",
        },
        content: "joined #all-testing.",
        timestamp: "2023-04-14T11:20:00",
        date: "Monday, April 14th",
        time: "11:20 AM",
      },
      {
        id: "2",
        user: {
          name: "Alex Johnson",
          avatar: "",
          initial: "A",
        },
        content: "Hey team, just checking in. How's everyone doing today?",
        timestamp: "2023-04-14T14:35:00",
        date: "Monday, April 14th",
        time: "2:35 PM",
      },
      {
        id: "3",
        user: {
          name: "Sarah Miller",
          avatar: "",
          initial: "S",
        },
        content:
          "I've updated the project timeline. Please take a look when you get a chance.",
        timestamp: "2023-04-14T16:42:00",
        date: "Monday, April 14th",
        time: "4:42 PM",
      },
      {
        id: "4",
        user: {
          name: "Tanveer Singh",
          avatar: "",
          initial: "T",
        },
        content: "testing",
        timestamp: "2023-04-18T19:42:00",
        date: "Yesterday",
        time: "7:42 PM",
      },
      {
        id: "5",
        user: {
          name: "Maria Garcia",
          avatar: "",
          initial: "M",
        },
        content:
          "Just finished the design mockups. Will share them in our next meeting.",
        timestamp: "2023-04-18T20:15:00",
        date: "Yesterday",
        time: "8:15 PM",
      },
    ];
  
    // Group messages by date
    const groupMessagesByDate = (messages: Message[]) => {
      const groups: { [key: string]: Message[] } = {};
  
      messages.forEach((message) => {
        if (!groups[message.date]) {
          groups[message.date] = [];
        }
        (groups[message.date] ?? []).push(message);
      });
      
  
      return groups;
    };
  
    const messageGroups = groupMessagesByDate(messageData);
  
    
  return (
    <>
    {/* Message Timeline - Using forEach loop with date separators */}
    <div className="px-4">
          {Object.entries(messageGroups).map(([date, messages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="relative w-full my-4">
                {/* Line across full width */}
                <div className="absolute top-1/2 left-0 right-0 h-[0.1px] bg-gray-300 z-0" />

                {/* Centered date "badge" floating over the line */}
                <div className="relative z-10 flex justify-center">
                  <div className="bg-white px-4 py-1 rounded-full border text-sm text-gray-600 flex items-center shadow-sm">
                    {date}
                   <ChevronDown className="w-5 h-5 pl-1"/>
                  </div>
                </div>
              </div>

              {/* Messages for this date */}
              {messages.map((msg) => (
                <div key={msg.id} className="flex items-start mb-4">
                  <div className="w-8 h-8 rounded-md bg-purple-700 text-white flex items-center justify-center mr-3 flex-shrink-0">
                    {msg.user.initial}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="font-semibold">{msg.user.name}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        {msg.time}
                      </span>
                    </div>
                    <p className="text-gray-800">
                      {msg.content.includes("#") ? (
                        <>
                          {msg.content.split("#")[0]}
                          <span className="text-purple-600">
                            #{msg.content.split("#")[1]}
                          </span>
                        </>
                      ) : (
                        msg.content
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Add more space at the bottom for scrolling */}
          <div className="h-20"></div>
        </div>
    </>
  )
}
export default MessageUI