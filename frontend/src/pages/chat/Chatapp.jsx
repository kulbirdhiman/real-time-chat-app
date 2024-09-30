import React, { useState, useEffect } from "react";
import { useGetAllUserQuery } from "../../redux/api/userApi";
import {
  useGetAllchatQuery,
  useSendMessageMutation,
} from "../../redux/api/chatApi";
import { useSelector } from "react-redux";
import io from "socket.io-client";

const socket = io("http://localhost:4000"); 

const ChatApp = () => {
  const [message, setMessage] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [id, setId] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const { data: chatData, refetch: refetchChats } = useGetAllchatQuery(); 
  const { data: allUsersData } = useGetAllUserQuery();
  const [sendMessage] = useSendMessageMutation();

  const messages = currentChat?.messages || [];

  useEffect(() => {
    if (currentChat) {
      socket.emit("joinChat", currentChat._id); // Join the chat room

      socket.on("messageReceived", (newMessage) => {
        if (newMessage.chatId === currentChat._id) {
          setCurrentChat((prevChat) => ({
            ...prevChat,
            messages: [...prevChat.messages, newMessage],
          }));
        }
      });
    }
    return () => {
      if (currentChat) {
        socket.emit("leaveChat", currentChat._id);
        socket.off("messageReceived");
      }
    };
  }, [currentChat]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const res = await sendMessage({ message, id }).unwrap(); 
      setMessage("");

      socket.emit("sendMessage", { ...res, chatId: currentChat._id, sender: userInfo._id });
      refetchChats();
      const updatedChat = chatData.find((chat) => chat._id === currentChat._id);
      if (updatedChat) {
        setCurrentChat(updatedChat); 
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    if (searchValue.trim() !== "") {
      const results = allUsersData?.filter((user) =>
        user.username.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredUsers(results);
    } else {
      setFilteredUsers([]);
    }
  };

  const checkChat = (chat) => {
    setCurrentChat(chat);
    const chatUserId = chat.users.filter(
      (user) => user._id !== userInfo._id
    )[0]._id;
    setId(chatUserId);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className={`w-full md:w-1/4 bg-gray-200 p-4 ${currentChat ? "hidden md:block" : "block"}`}>
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        <div className="mb-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {searchTerm ? (
          <ul>
            {filteredUsers?.length > 0 ? (
              filteredUsers.map((user) => (
                <li
                  key={user._id}
                  className="p-2 mb-2 rounded bg-white cursor-pointer hover:bg-blue-100"
                  onClick={() => {
                    setId(user._id);
                    setCurrentChat({ users: [userInfo, user], messages: [] });
                    setSearchTerm("");
                  }}
                >
                  {user.username}
                </li>
              ))
            ) : (
              <p className="text-gray-500">No users found</p>
            )}
          </ul>
        ) : (
          <ul>
            {chatData?.map((chat) => (
              <li
                key={chat._id}
                onClick={() => checkChat(chat)}
                className={`p-2 mb-2 rounded cursor-pointer ${
                  currentChat?._id === chat._id ? "bg-blue-500 text-white" : "bg-white"
                }`}
              >
                {chat.users
                  .filter((user) => user._id !== userInfo._id)
                  .map((user) => user.username)
                  .join(", ")}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={`flex flex-col w-full md:w-3/4 bg-white ${currentChat ? "block" : "hidden md:block"}`}>
        <div className="flex-grow overflow-y-auto border-b border-gray-300 p-4">
          {currentChat ? (
            messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={msg._id || index}
                  className={`my-2 p-2 ${msg.sender === userInfo._id ? "text-right" : "text-left"}`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      msg.sender === userInfo._id ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                    }`}
                  >
                    {msg.message || msg.text}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No messages yet</p>
            )
          ) : (
            <p className="text-gray-500">Select a chat to start messaging</p>
          )}
        </div>

        {currentChat && (
          <div className="flex items-center p-4">
            <input
              type="text"
              className="flex-grow p-2 border border-gray-300 rounded mr-2"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button className="bg-blue-500 text-white p-2 rounded" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        )}

        {currentChat && (
          <button
            className="md:hidden bg-gray-300 p-2 rounded m-4"
            onClick={() => setCurrentChat(null)}
          >
            Back to Chats
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
