import React, { useEffect, useState, useRef } from "react";
import { convertDate, formatTime } from "../../../utils/optimizationFunction";
import cn from "../../../lib/cn";
import { FaMessage } from "react-icons/fa6";
import { baseUrl } from "../../../utils/optimizationFunction";
import { useGetConversationQuery } from '../../../RTK/services/chatApi';
import { IoMdSend } from "react-icons/io";

function ChatMainPage({ selectedUser, setSelectedUser, socket, currentUserId, currentUserRole }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const { data: conversationData, isLoading: isLoadingConversation, isFetching: isFetchingConversation, refetch } = useGetConversationQuery(selectedUser?.conversationId, {
    skip: !selectedUser?.conversationId,
  });

  useEffect(() => {
    if (!socket || !currentUserId) return;

    const conversationUpdateListener = (update) => {
      console.log('Received conversation update:', update);
      refetch();
    };

    socket.on(`conversation_update/${currentUserId}`, conversationUpdateListener);

    return () => {
      socket.off(`conversation_update/${currentUserId}`, conversationUpdateListener);
    };
  }, [socket, currentUserId, refetch]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket || !currentUserId) return;

    const messageListener = (message) => {
      const isFromSelectedUser = message.sender.id === selectedUser?._id;
      const isToSelectedUser = message.receiver.id === selectedUser?._id;
      const isFromCurrentUser = message.sender.id === currentUserId;
      const isToCurrentUser = message.receiver.id === currentUserId;

      if ((isFromCurrentUser && isToSelectedUser) || (isFromSelectedUser && isToCurrentUser)) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    socket.on(`message_new/${currentUserId}`, messageListener);

    return () => {
      socket.off(`message_new/${currentUserId}`, messageListener);
    };
  }, [socket, selectedUser, currentUserId]);

  useEffect(() => {
    if (conversationData?.conversation?.messages?.length) {
      setMessages([...conversationData.conversation.messages].reverse());
    } else {
      setMessages([]);
    }
  }, [conversationData, selectedUser]);


  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !socket || !selectedUser || !currentUserId || !currentUserRole) return;

    const messageObject = {
      conversationId: selectedUser?.conversationId || null,
      sender: {
        id: currentUserId,
        role: currentUserRole,
      },
      receiver: {
        id: selectedUser._id,
        role: selectedUser.role,
      },
      text: newMessage,
      images: [],
      video: "",
      videoCover: "",
    };

    ;
    // Emit the message to the server
    socket.emit('message_new', messageObject, (response) => {
      if (response?.success) {
        console.log('✅ Message sent successfully:', response);
        if (response.conversationId && !selectedUser.conversationId) {
          setSelectedUser({ ...selectedUser, conversationId: response.conversationId });
        }
      } else {
        console.error('Server failed to process message:', response?.error);
        alert('Message failed to send. Please check your connection or contact support.');
      }
    });
    setMessages((prevMessages) => [...prevMessages, messageObject]);
    setNewMessage("");
  };


  return (
    <div className="w-full flex flex-col bg-gray-50">
      {selectedUser ? (
        <>
          <div className="h-[60px] border-b border-gray-300 bg-white px-3 flex items-center gap-3 shadow-sm">
            <div>
              <img
                src={selectedUser.profileImage ? `${baseUrl}/${selectedUser.profileImage}` : "https://avatar.iran.liara.run/public/13"}
                alt={selectedUser.authId?.name || selectedUser.name}
                className="w-12 h-12 shadow rounded-full object-cover"
              />
            </div>
            <div>
              <p className="text-lg font-semibold">{selectedUser.authId?.name || selectedUser.name}</p>
              <span className="text-xs text-gray-500">Active now</span>
            </div>
          </div>

          <div className="flex-1 h-[calc(100vh-300px)] min-h-[calc(100vh-300px)] max-h-[calc(100vh-300px)] p-4 overflow-y-auto hide-scrollbar flex flex-col gap-3 bg-gray-100">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-end gap-2",
                    msg.sender.role === currentUserRole ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.sender.role !== currentUserRole && (
                    <img
                      className="w-8 h-8 rounded-full object-cover shadow"
                      src={selectedUser.profileImage ? `${baseUrl}/${selectedUser.profileImage}` : "https://avatar.iran.liara.run/public/15"}
                      alt={selectedUser.name}
                    />
                  )}
                  <div
                    className={cn(
                      "p-3 rounded-2xl text-sm max-w-[60%\} shadow",
                      msg.sender.role === currentUserRole
                        ? "bg-[#F57C00] text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none"
                    )}
                  >
                    <p>{msg.text}</p>
                    <div
                      className={cn(
                        "text-[10px] mt-1 opacity-70",
                        msg.sender.role === currentUserRole ? "text-gray-200" : "text-gray-500"
                      )}
                    >
                      {formatTime(msg.createdAt || new Date().toISOString())}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center h-full justify-center text-center text-gray-500">
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-200 mb-3">
                  <FaMessage className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-lg font-semibold">No messages yet</p>
                <p className="text-sm">Start a conversation with {selectedUser.authId?.name || selectedUser.name}</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="h-[60px] border-t border-gray-300 bg-white flex items-center px-3 gap-2">
            <form className="flex items-center gap-2 w-full" onSubmit={handleSendMessage}>
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                type="text"
                name="message"
                placeholder="Type a message..."
                className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#F57C00] text-sm"
              />
              <button type="submit" className="bg-[#FFB900] text-white px-4 py-2 rounded-full text-md hover:bg-[#ff952b] transition duration-300 cursor-pointer">
                <IoMdSend size={24} />
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center h-full justify-center text-center text-gray-500">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-200 mb-3">
            <FaMessage className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-lg font-semibold">Select a user to start chatting</p>
        </div>
      )}
    </div>
  );
}

export default ChatMainPage;
