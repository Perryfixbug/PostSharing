'use client';

import { useAuth } from '@/context/authContext';
import { useSocket } from '@/context/websocketContext';
import { fetchAPI } from '@/lib/api';
import { MessageType, UserType } from '@/type/type';
import { useState, useContext, createContext, useEffect } from 'react';
import { toast } from 'sonner';

export const ChatContext = createContext<any>(null);
export const useChat = () => useContext(ChatContext);

export default function ChatProvider({ children }: { children: React.ReactNode }) {
  const { isAuth, authLoading } = useAuth();
  const [allHistoryChat, setAllHistoryChat] = useState<Map<number, MessageType[]>>(new Map());
  const [partners, setPartners] = useState<UserType[]>([]);
  const { messages, setMessages } = useSocket();

  useEffect(() => {
    if (authLoading || !isAuth) return;
    const fetchAllChat = async () => {
      try {
        const data = await fetchAPI('/message', 'GET');
        if (!Array.isArray(data)) {
          return;
        }
        setPartners(data);

        const history: [number, MessageType[]][] = await Promise.all(
          data.map(async (partner: UserType) => {
            const message = await fetchAPI(`/message/${partner.id}`, 'GET');
            return [partner.id, message.reverse()];
          })
        );
        setAllHistoryChat(new Map(history));
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error(String(err));
        }
      }
    };
    fetchAllChat();
  }, [isAuth, authLoading]);

  //Update history when new message
  useEffect(() => {
    if (messages.size === 0) return;
    setAllHistoryChat((prev: Map<number, MessageType[]>) => {
      const updated = new Map(prev);
      // Lặp qua các tin nhắn mới
      messages.forEach((newMsgs: MessageType[], partnerId: number) => {
        const oldMsgs = updated.get(partnerId) || [];
        updated.set(partnerId, [...oldMsgs, ...newMsgs]);
      });
      return updated;
    });

    setMessages(new Map());
  }, [messages]);

  return (
    <ChatContext.Provider value={{ partners, allHistoryChat, setPartners, setAllHistoryChat }}>
      {children}
    </ChatContext.Provider>
  );
}
