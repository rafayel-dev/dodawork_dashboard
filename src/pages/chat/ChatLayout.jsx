import React, { useEffect, useState, useRef, useCallback } from 'react';
import ChatMainPage from './chat-interface-components/ChatMainPage';
import ChatSiderbar from './chat-interface-components/ChatSiderbar';
import { PageContent, PageLayout } from '../../components/PageLayout';
import { io } from 'socket.io-client';
import { useGetServiceProviderByIdQuery } from '../../RTK/services/dashboard/authorised-teams/admins/serviceProvdiers/serviceProvdiersApi';
import Loading from '../../components/common/Loading';
import { useSelector } from 'react-redux';

function ChatLayout() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [chatProviderId, setChatProviderId] = useState(null);

  const { user: currentUser } = useSelector((state) => state.auth);
  const currentUserId = currentUser?._id;
  const currentUserRole = currentUser?.authId?.role;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get('providerId');
    if (idFromUrl) {
      setChatProviderId(idFromUrl);
    }
  }, []);

  const { data: providerDetails, isLoading, isError } = useGetServiceProviderByIdQuery(chatProviderId, {
    skip: !chatProviderId,
  });

  useEffect(() => {
    if (providerDetails && chatProviderId && !selectedUser) {
      setSelectedUser({ ...providerDetails.data, role: "PROVIDER" });
    }
  }, [providerDetails, chatProviderId, selectedUser]);

  useEffect(() => {
    const SOCKET_SERVER_URL = "http://10.10.20.52:6002";

    if (!currentUserId || !currentUserRole) {
      console.warn("Cannot initialize socket: Missing user info");
      return;
    }

    const newSocket = io(`${SOCKET_SERVER_URL}/?id=${currentUserId}&role=${currentUserRole}`, {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket.IO connected:', newSocket.id);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected. Reason:', reason);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err);
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [currentUserId, currentUserRole]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>Error loading provider details for chat.</p>;
  }

  return (
    <div>
      <PageLayout className="p-0">
        <PageContent>
          <div className='flex gap-1 h-full'>
            <ChatSiderbar setSelectedUser={setSelectedUser} socket={socket} currentUserId={currentUserId} currentUserRole={currentUserRole} selectedUser={selectedUser} />
            <ChatMainPage selectedUser={selectedUser} setSelectedUser={setSelectedUser} socket={socket} currentUserId={currentUserId} currentUserRole={currentUserRole} />
          </div>
        </PageContent>
      </PageLayout>
    </div>
  );
}

export default ChatLayout;