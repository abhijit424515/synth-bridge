import React from "react";
import io from "socket.io-client";
import { useState } from "react";
import ChatMessage from "./ChatMessage";
import { useEffect } from "react";
import { SOCKETDOMAIN } from "../../global/Functions";
import { project_id } from "../../global/Functions";
import toast from "react-hot-toast";
import PulseLoader from "react-spinners/PulseLoader";
import PropagateLoader from "react-spinners/PropagateLoader";

// Create a socket connection using the DOMAIN constant
const sc = io(SOCKETDOMAIN);

// Define the ChatWindow component
export default function ChatWindow({
  isImprovementLoading,
  setIsImprovementLoading,
  ...props
}) {
  const [messages, setMessages] = useState([]); // State for storing chat messages
  const [newMessage, setNewMessage] = useState(""); // State for storing the new message input
  const [_id, set_id] = useState("");
  const [isMessageLoading, setIsMessageLoading] = useState(false);

  const updateMessages = (newMessage, type) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { content: newMessage, type },
    ]);
  };

  useEffect(() => {
    const copy = localStorage.getItem("project_id")
      ? localStorage.getItem("project_id")
      : project_id;
    set_id(copy);
    // Set up event listeners for socket events

    sc.on(
      "connect",
      () => {
        console.log(`connected: ${sc.id}`);
        if (_id !== "" && _id !== undefined) sc.emit("init", _id);
      },
      []
    );
    sc.on("disconnect", () => console.log(`disconnected`));
    sc.on("init", (data) => {
      setMessages(JSON.parse(data).history);
    });
    sc.on(
      "message",
      (message) => {
        const newMessage = JSON.parse(message).response;
        setIsMessageLoading(false);
        updateMessages(newMessage, "ai");
        setIsImprovementLoading(true);
        sc.emit("improve", newMessage);
        // setIsImprovementLoading(true);
      },
      []
    );

    sc.on("improve", (additionals) => {
      const response = JSON.parse(additionals);
      setIsImprovementLoading(false);
      // const improvedMessage = response.message;
      const tools = response.tools.reverse();
      props.setTools((prevTools) => {
        const toolsCopy = [...prevTools, ...tools];
        const uniqueArray = [...new Set(toolsCopy)];
        return uniqueArray;
      });
    });
    sc.on("error", (err) => {
      toast.error(err.message);
      console.log(err);
    });

    sc.emit("init", _id);
  }, []);

  // Function to handle sending a new message
  const handleSendMessage = () => {
    setIsMessageLoading(true);
    if (newMessage.trim() !== "") {
      const data = { message: newMessage, _id: _id };
      sc.emit("message", JSON.stringify(data));
      updateMessages(newMessage, "human");
      setNewMessage("");
    }
  };
  // Render the ChatWindow component
  return (
    <div className="chat-window flex flex-col h-full rounded-md min-w-full bg-slate-100 border border-gray-300 p-6 max-h-[82vh]">
      <div className="messages flex-1 overflow-y-scroll bg-white rounded-t-md no-scrollbar max-h-[70vh]">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {isMessageLoading ? (
          <div className="p-4">
            <PulseLoader color="#228BE6" size={10} />
          </div>
        ) : null}
        {isImprovementLoading ? (
          <div className="p-4">
            <PropagateLoader color="#228BE6" size={10} />
          </div>
        ) : null}
      </div>
      <div className="p-1 rounded-b-xl border border-gray-300">
        <div className="input-container rounded-xl bg-white flex">
          <textarea
            className="rounded-xl p-3 w-full focus:outline-none"
            style={{ resize: "none" }}
            type="text"
            rows={2}
            placeholder="Type your query here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            className="bg-gray-800 text-white font-semibold mr-2 my-2 px-8 rounded-md hover:bg-gray-700 focus:outline-none right-0"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
