import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  const getMessagesCallback = useCallback(() => {
    if (selectedUser?._id) getMessages(selectedUser._id);
  }, [selectedUser, getMessages]);

  const subscribeToMessagesCallback = useCallback(() => {
    if (subscribeToMessages) subscribeToMessages();
  }, [subscribeToMessages]);

  const unsubscribeFromMessagesCallback = useCallback(() => {
    if (unsubscribeFromMessages) unsubscribeFromMessages();
  }, [unsubscribeFromMessages]);

  useEffect(() => {
    getMessagesCallback();
    subscribeToMessagesCallback();

    return () => unsubscribeFromMessagesCallback();
  }, [getMessagesCallback, subscribeToMessagesCallback, unsubscribeFromMessagesCallback]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const getAvatarSrc = (messageSenderId) => {
    return messageSenderId === authUser._id
      ? authUser.profilePic || "/avatar.png"
      : selectedUser?.profilePic || "/avatar.png";
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <p className="text-center text-gray-500 mt-4">No user selected</p>
      </div>
    );
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img src={getAvatarSrc(message.senderId)} alt="profile pic" />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
