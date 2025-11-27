import React, { useEffect } from 'react';
import { baseUrl } from '../../../utils/optimizationFunction';
import cn from '../../../lib/cn';
import { useGetConversationListQuery } from '../../../RTK/services/chatApi';

function ChatSiderbar({ setSelectedUser, socket, currentUserId, selectedUser }) {
  const { data: conversationListData, isLoading, isError, refetch } = useGetConversationListQuery();

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

  return (
    <div className='w-[350px] h-full shadow p-1'>
      <input
        className='w-full p-2 h-[50px] border outline-none border-gray-200 rounded mb-4'
        type="text" placeholder={` Search`}
        onChange={(e) => console.log(e.target.value)} />
      <div className='max-h-[calc(100vh-240px)] hide-scrollbar overflow-y-auto'>
        {isLoading }
        {isError && <p className='text-center text-red-500'>Error loading conversations.</p>}
        {!isLoading && !isError && conversationListData?.data?.length > 0 ? (
          conversationListData.data.map((conversation) => {
            // Find the other participant in the conversation
            const chatPartner = conversation.participants.find(p => p.id !== currentUserId);
            if (!chatPartner) return null;

            return (
              <UserChat 
                key={conversation.conversationId} 
                chatPartner={chatPartner} 
                conversation={conversation} 
                setSelectedUser={setSelectedUser} 
                selectedUser={selectedUser} 
              />
            );
          })
        ) : (
          <p className='text-center text-gray-500'>No conversations found.</p>
        )}
      </div>
    </div>
  )
}

export default ChatSiderbar

const UserChat = ({ chatPartner, conversation, setSelectedUser, selectedUser }) => {
  const name = chatPartner.name;
  const avatar = chatPartner.profileImage ? `${baseUrl}/${chatPartner.profileImage}` : "https://avatar.iran.liara.run/public/13";
  const isActive = selectedUser?._id === chatPartner.id;

  return (
    <div onClick={() => setSelectedUser({ ...chatPartner, _id: chatPartner.id, conversationId: conversation.conversationId })}
      className={cn(
        'flex gap-2 hover:bg-gray-100 p-2 cursor-pointer space-y-2 mb-2 border-b pb-2 border-gray-200 w-full items-center',
        isActive && 'bg-gray-200'
      )}>
      <img className='min-w-12 w-12 h-12 min-h-12 border border-gray-200 shadow object-cover rounded-full' src={avatar} alt={name} />
      <div>
        <p className='text-lg font-semibold'>{name}</p>
        <p className='text-gray-500'>{conversation?.lastMessage?.text || 'Click to start a conversation'}</p>
        {conversation?.unreadCount > 0 && (
          <span className='ml-2 px-2 py-0.5 text-xs font-semibold text-white bg-red-500 rounded-full'>
            {conversation.unreadCount}
          </span>
        )}
      </div>
    </div>
  )
}