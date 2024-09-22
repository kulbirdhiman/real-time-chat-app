import React, { useState } from 'react';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentChat, setCurrentChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const chatList = [
    { id: 1, name: "General" },
    { id: 2, name: "Work" },
    { id: 3, name: "Friends" },
  ];

  // Dummy user data
  const allUsers = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Alice Johnson' },
    { id: 4, name: 'Bob Brown' },
  ];

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setMessages([...messages, { text: currentMessage, sender: "You" }]);
      setCurrentMessage('');
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    
    // Filter users based on the search term
    if (searchValue.trim() !== '') {
      const results = allUsers.filter(user =>
        user.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredUsers(results);
    } else {
      setFilteredUsers([]);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Chat List / Search Users */}
      <div className={`w-full md:w-1/4 bg-gray-200 p-4 ${currentChat ? 'hidden md:block' : 'block'}`}>
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <li
                  key={user.id}
                  className="p-2 mb-2 rounded bg-white cursor-pointer hover:bg-blue-100"
                  onClick={() => alert(`Start chat with ${user.name}`)}
                >
                  {user.name}
                </li>
              ))
            ) : (
              <p className="text-gray-500">No users found</p>
            )}
          </ul>
        ) : (
          <ul>
            {chatList.map(chat => (
              <li
                key={chat.id}
                onClick={() => setCurrentChat(chat)}
                className={`p-2 mb-2 rounded cursor-pointer ${currentChat?.id === chat.id ? 'bg-blue-500 text-white' : 'bg-white'}`}
              >
                {chat.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat Window */}
      <div className={`flex flex-col w-full md:w-3/4 bg-white ${currentChat ? 'block' : 'hidden md:block'}`}>
        <div className="flex-grow overflow-y-auto border-b border-gray-300 p-4">
          {currentChat ? (
            messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index} className={`my-2 p-2 ${msg.sender === "You" ? "text-right" : ""}`}>
                  <span className={`inline-block p-2 rounded-lg ${msg.sender === "You" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                    {msg.text}
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
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
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
