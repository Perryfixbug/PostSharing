'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/authContext';
import { aliasFullname } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

const ProfileMeButton = () => {
  const { userInfo } = useAuth();
  return (
    <>
      {userInfo && (
        <Link href="/profile/me" className="flex items-center w-fit text-2xl gap-2 font-bold mt-80">
          <Avatar className="h-8 w-8 rounded-full border-2 border-primary shadow-lg">
            <AvatarImage src={userInfo?.avatar || undefined} />
            <AvatarFallback>{aliasFullname(userInfo.fullname)}</AvatarFallback>
          </Avatar>
          <span>{userInfo.fullname}</span>
        </Link>
      )}
    </>
  );
};

export default ProfileMeButton;
