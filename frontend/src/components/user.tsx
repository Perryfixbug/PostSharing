'use client';

import { newMessageType, UserType } from '@/type/type';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/authContext';
import { fetchAPI } from '@/lib/api';
import { sendMessage } from '@/lib/websocket';
import { aliasFullname } from '@/lib/utils';
import { toast } from 'sonner';

const User = ({ user_data }: { user_data: UserType }) => {
  const { userInfo, isAuth } = useAuth();

  const handleAddFriend = async () => {
    try{
      await fetchAPI(`/friendship/${user_data.id}`, 'POST');
    }catch(err){
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error(String(err));
      }
    }
  };

  const handleSayHi = () => {
    sendMessage({
      type: 'message',
      to: user_data.id,
      content: 'hi',
    } as newMessageType);
    // setPartners((prev: UserType[])=>[
    //     ...prev,
    //     user_data
    // ])
  };

  return (
    <div className="container flex py-5 justify-between items-center flex-wrap">
      <div className="flex gap-2 items-center">
        <Avatar className="h-12 w-12 rounded-full border-2 border-primary shadow-lg">
          <AvatarImage src={user_data?.avatar || undefined} />
          <AvatarFallback>{aliasFullname(user_data.fullname)}</AvatarFallback>
        </Avatar>
        <ul className="flex flex-col items-center">
          <li className="text-2xl font-bold">
            <Link href={`/profile/${user_data.id}`}>{user_data.fullname}</Link>
          </li>
          <li>{user_data.gender}</li>
        </ul>
      </div>
      {isAuth && (
        <div className="flex items-center gap-2">
          <Button
            variant={'default'}
            className="bg-secondary text-secondary-foreground"
            onClick={(e) => {
              e.currentTarget.disabled = true;
              handleSayHi();
            }}
          >
            <MessageCircle />
            Say Hi
          </Button>

          <Button
            variant={'outline'}
            onClick={(e) => {
              e.currentTarget.disabled = true;
              handleAddFriend();
            }}
            disabled={
              userInfo.id == user_data.id ||
              userInfo?.list_friend.find((friend_id: number) => friend_id == user_data.id)
            }
          >
            <UserPlus />
            Add friend
          </Button>
        </div>
      )}
    </div>
  );
};

export default User;
