import React, { useEffect, useState } from 'react';
import { baseUrl } from '../../../utils/optimizationFunction';
import cn from '../../../lib/cn';
import { useGetConversationListQuery } from '../../../RTK/services/chatApi';

function ChatSiderbar({ setSelectedUser, socket, currentUserId, selectedUser }) {
  const { data: conversationListData, isLoading, isError, refetch } = useGetConversationListQuery();
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredConversations = conversationListData?.data?.filter(conversation => {
    const chatPartner = conversation.participants.find(p => p.id !== currentUserId);
    return chatPartner?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className='w-[350px] h-full shadow p-1'>
      <input
        className='w-full p-2 h-[50px] border outline-none border-gray-200 rounded mb-4'
        type="text" placeholder={` Search`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} />
      <div className='max-h-[calc(100vh-240px)] hide-scrollbar overflow-y-auto'>
        {isLoading }
        {isError && <p className='text-center text-red-500'>Error loading conversations.</p>}
        {!isLoading && !isError && filteredConversations?.length > 0 ? (
          filteredConversations.map((conversation) => {
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
  const avatar = chatPartner.profileImage ? `${baseUrl}/${chatPartner.profileImage}` : "https://placehold.net/avatar.svg?text=EJ&bg=212121";
  const isActive = selectedUser?._id === chatPartner.id;

  return (
    <div onClick={() => setSelectedUser({ ...chatPartner, _id: chatPartner.id, conversationId: conversation.conversationId })}
      className={cn(
        'flex gap-2 hover:bg-gray-100 p-2 cursor-pointer space-y-2 mb-2 border-b pb-2 border-gray-200 w-full items-center',
        isActive && 'bg-gray-200'
      )}>
      <img className='min-w-12 w-12 h-12 min-h-12 border border-gray-200 shadow object-cover rounded-full' src={avatar} alt={name} />
      <div>
        <div className='flex justify-center items-center'>
          <p className='text-lg font-semibold'>{name}</p>
         {/* {conversation?.unreadCount > 0 && (
          <div className='ml-2 w-2 h-2 rounded-full bg-amber-500'></div>
        )} */}
        </div>
        <p className='text-gray-500'>{conversation?.lastMessage?.text || 'Click to start a conversation'}</p>
      </div>
    </div>
  )
}