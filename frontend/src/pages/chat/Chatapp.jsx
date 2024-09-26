import React, { useState } from "react";
import { useGetAllUserQuery } from "../../redux/api/userApi";
import {
  useGetAllchatQuery,
  useSendMessageMutation,
} from "../../redux/api/chatApi";
import { useSelector } from "react-redux";

const ChatApp = () => {
  const [message, setMessage] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [id , setId] = useState('')

  const { userInfo } = useSelector((state) => state.auth);
  const { data: chatData } = useGetAllchatQuery();
  const { data: allUsersData } = useGetAllUserQuery();
  const [sendMessage] = useSendMessageMutation();

  // Handling the display of messages in the selected chat
  const messages = currentChat?.messages || [];

  // Function to handle sending messages
  const handleSendMessage = async () => {
    const dd = "66f2a8dfa061bfbb94bf3b38";
    const res = await sendMessage({ message , id: id }).unwrap();
    setMessage("")
    console.log(res);
  };

  // Search functionality for users
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    // Filter users based on the search term
    if (searchValue.trim() !== "") {
      const results = allUsersData?.filter((user) =>
        user.username.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredUsers(results);
    } else {
      setFilteredUsers([]);
    }
  };
  const checkchat = (chat)=>{
    setCurrentChat(chat)
    // console.log(currentChat)
    // console.log(chat)
    console.log()
    const dsa = chat.users.filter((user) => user._id !== userInfo._id).map((user) => setId(user._id))
    console.log(id)
  }
const createChat = async(e)=>{
  setId()
  
}
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Chat List / Search Users */}
      <div
        className={`w-full md:w-1/4 bg-gray-200 p-4 ${
          currentChat ? "hidden md:block" : "block"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Chats</h2>

        {/* Search User Input */}
        <div className="mb-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Display search results if searching, otherwise show chat list */}
        {searchTerm ? (
          <ul>
            {filteredUsers?.length > 0 ? (
              filteredUsers.map((user) => (
                <li
                  key={user._id}
                  className="p-2 mb-2 rounded bg-white cursor-pointer hover:bg-blue-100"
                  onClick={() => {
                    setId(user._id)
                    setCurrentChat({ users: [userInfo, user], messages: [] });

                    // setMessage("...");
                    // handleSendMessage()
                    sendMessage('')
                    setSearchTerm('')
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
                onClick={() => checkchat(chat) }
                className={`p-2 mb-2 rounded cursor-pointer ${
                  currentChat?._id === chat._id
                    ? "bg-blue-500 text-white"
                    : "bg-white"
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

      {/* Chat Window */}
      <div
        className={`flex flex-col w-full md:w-3/4 bg-white ${
          currentChat ? "block" : "hidden md:block"
        }`}
      >
        <div className="flex-grow overflow-y-auto border-b border-gray-300 p-4">
          {currentChat ? (
            messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={msg._id || index}
                  className={`my-2 p-2 ${
                    msg.sender === userInfo._id ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      msg.sender === userInfo._id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
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

        {/* Message Input */}
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
            <button
              className="bg-blue-500 text-white p-2 rounded"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        )}

        {/* Back button for mobile view */}
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
