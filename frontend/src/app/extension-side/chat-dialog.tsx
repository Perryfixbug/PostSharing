'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { fetchAPI } from '@/lib/api';
import { CircleSmall,  MessageCircle, Send, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { UserType, MessageType, Options, newMessageType } from '@/type/type';
import { Input } from '@/components/ui/input';
import { useSocket } from '@/context/websocketContext';
import { useChat } from '@/context/chatContext';
import { Badge } from '@/components/ui/badge';
import { aliasFullname, cn } from '@/lib/utils';

const PreviewChat = ({
  partner,
  historyChat,
  setChatUsers,
}: {
  partner: UserType;
  historyChat: MessageType[];
  setChatUsers: any;
}) => {
  const [hasUnreadMessage, setHasUnreadMessage] = useState(false);
  const [isYou, setIsYou] = useState(false);

  useEffect(() => {
    setIsYou(historyChat[historyChat.length - 1].sender_id != partner.id);
    setHasUnreadMessage(historyChat.some((chat: MessageType) => !chat.is_read));
  }, [historyChat, partner.id]);

  return (
    <div>
      <div
        className="flex items-center gap-2 relative hover:bg-muted cursor-pointer p-2 rounded-lg"
        onClick={() =>
          setChatUsers((prev: number[]) => {
            const exists = prev.includes(partner.id);
            if (exists) {
              return prev.filter((id) => id !== partner.id);
            } else {
              return [...prev, partner.id];
            }
          })
        }
      >
        <Avatar>
          <AvatarImage src={partner?.avatar || undefined} />
          <AvatarFallback>{aliasFullname(partner.fullname)}</AvatarFallback>
        </Avatar>
        {!hasUnreadMessage || historyChat[historyChat.length - 1]?.sender_id != partner.id ? (
          <div>
            <span className="font-bold">{partner.fullname}</span>
            <p>
              {isYou ? 'you: ' : ''}
              {historyChat[historyChat.length - 1]?.content}
            </p>
          </div>
        ) : (
          <div>
            <span className="font-extrabold">{partner.fullname}</span>
            <p className="font-medium">
              {isYou ? 'you: ' : ''}
              {historyChat[historyChat.length - 1]?.content}
            </p>
            <CircleSmall
              className="absolute right-0 top-1/3 rounded-full"
              color="blue"
              fill="blue"
              size={15}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const Chat = ({
  partner,
  historyChat,
  setChatUsers,
}: {
  partner: UserType;
  historyChat: MessageType[];
  setChatUsers: any;
}) => {
  const [input, setInput] = useState('');
  const { sendMessage } = useSocket();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [historyChat]);

  const handleSendMessage = () => {
    if (!input) return;
    sendMessage({
      type: 'message',
      to: partner.id,
      content: input,
    } as newMessageType);

    setInput('');
  };

  return (
    <Card className="w-80">
      <CardHeader className="flex items-center justify-between">
        <div className="userinfo flex items-center gap-2">
          <Avatar>
            <AvatarImage src={partner?.avatar || undefined} />
            <AvatarFallback>{aliasFullname(partner.fullname)}</AvatarFallback>
          </Avatar>
          <span>{partner.fullname}</span>
        </div>
        <Button
          variant={'ghost'}
          className=""
          onClick={() =>
            setChatUsers((prev: any) => prev.filter((item: any) => item !== partner.id))
          }
        >
          <X />
        </Button>
      </CardHeader>

      <CardContent className="overflow-y-auto h-[300px]" ref={scrollRef}>
        <div className="flex flex-col gap-1">
          {historyChat &&
            historyChat.map((messageData) => (
              <Message key={messageData.id} user={partner} messageData={messageData} />
            ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 items-center">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message.."
        />
        <Button variant={'ghost'} onClick={handleSendMessage}>
          <Send />
        </Button>
      </CardFooter>
    </Card>
  );
};

const Message = ({ user, messageData }: { user: UserType; messageData: MessageType }) => {
  const isMe = messageData.receiver_id === user.id;
  const style = isMe
    ? 'rounded-full bg-accent w-fit py-1 px-2 self-end'
    : 'rounded-full bg-muted w-fit py-1 px-2 self-start';
  return <div className={style}>{messageData.content}</div>;
};

const ChatDialog = ({ option, setOption }: { option: string; setOption: any }) => {
  const { partners, allHistoryChat, setAllHistoryChat } = useChat();
  const [chatUsers, setChatUsers] = useState<any[]>([]);
  const [newMessageCount, setNewMessageCount] = useState(0);

  //Count new Message
  useEffect(() => {
    if (!partners) return;

    let unreadCount = 0;

    partners.forEach((partner: UserType) => {
      const history = allHistoryChat.get(partner.id) || [];
      unreadCount += history.some((msg: MessageType) => !msg.is_read && msg.sender_id == partner.id)
        ? 1
        : 0;
    });

    setNewMessageCount(unreadCount);
  }, [partners, allHistoryChat]);

  //Update read status
  useEffect(() => {
    const updateReadStatus = async () => {
      const updatedUsers: number[] = [];
      const updatePromises: Promise<any>[] = [];

      chatUsers.forEach((userId: number) => {
        const history = allHistoryChat.get(userId);
        if (!history) return;

        const unreadMessages = history.filter(
          (chat: MessageType) => !chat.is_read && chat.sender_id == userId
        );
        if (unreadMessages.length === 0) return;

        unreadMessages.forEach((chat: MessageType) => {
          updatePromises.push(fetchAPI(`/message/${chat.id}`, 'PUT', { is_read: true }));
        });

        updatedUsers.push(userId);
      });

      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);

        // Cập nhật local state sau khi cập nhật DB thành công
        setAllHistoryChat((prev: Map<number, MessageType[]>) => {
          const newChat = new Map(prev);
          updatedUsers.forEach((userId) => {
            const history = newChat.get(userId);
            if (!history) return;
            const newHistory = history.map((chat) => ({ ...chat, is_read: true }));
            newChat.set(userId, newHistory);
          });
          return newChat;
        });
      }
    };

    updateReadStatus();
  }, [chatUsers, allHistoryChat]);

  return (
    <div className="">
      <Button
        size="icon"
        className={cn(
          'rounded-full relative',
          option == Options.CHAT ? 'bg-accent text-accent-foreground hover:bg-accent/80' : ''
        )}
        onClick={() => {
          if (option === Options.CHAT) {
            setOption(Options.NULL);
          } else {
            setOption(Options.CHAT);
          }
        }}
      >
        <MessageCircle className="" />
        {newMessageCount > 0 && (
          <Badge className="absolute top-[-5px] right-[-5px] rounded-full bg-destructive">
            {newMessageCount}
          </Badge>
        )}
      </Button>
      {option === Options.CHAT && (
        <Card className="md:absolute inset-x-0 md:h-[86vh] my-2 fixed h-full">
          <CardHeader className="font-medium">Chatting</CardHeader>
          <CardContent className="flex flex-col">
            {partners &&
              partners.map((partner: UserType) => (
                <PreviewChat
                  key={partner.id}
                  partner={partner}
                  historyChat={allHistoryChat.get(partner.id) || []}
                  setChatUsers={setChatUsers}
                />
              ))}
          </CardContent>
        </Card>
      )}
      <div className="fixed flex md:flex-row-reverse bottom-0 right-4 gap-4 z-50 overflow-y-auto">
        {chatUsers &&
          chatUsers.map((chatUser) => {
            const partner = partners.find((partner: UserType) => partner.id == chatUser);
            if (!partner) return null;
            return (
              <Chat
                key={chatUser}
                partner={partner}
                historyChat={allHistoryChat.get(chatUser) || []}
                setChatUsers={setChatUsers}
              />
            );
          })}
      </div>
    </div>
  );
};

export default ChatDialog;
