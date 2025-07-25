'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useNoti } from '@/context/notiContext';
import { fetchAPI } from '@/lib/api';
import { cn } from '@/lib/utils';
import { NotiType, Options } from '@/type/type';
import { Bell, CircleSmall } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const PreviewNoti = ({ noti }: { noti: NotiType }) => {
  const router = useRouter();
  const {setAllNoti } = useNoti();

  const handleReadNoti = async () => {
    await fetchAPI(`/notification/${noti.id}`, 'PUT');
    setAllNoti((prevNoti: NotiType[]) =>
      prevNoti.map((n: NotiType) => (n.id === noti.id ? { ...n, is_read: true } : n))
    );

    router.push(noti.link);
  };
  return (
    <div onClick={handleReadNoti} className="relative cursor-pointer hover:bg-muted p-2 rounded-lg">
      {noti.is_read ? (
        <div>
          <p className="text-[12px] font-light">
            {new Date(noti.create_date).toLocaleTimeString()}
          </p>
          <p className="">{noti.content}</p>
        </div>
      ) : (
        <div>
          <p className="text-[12px] font-medium">
            {new Date(noti.create_date).toLocaleTimeString()}
          </p>
          <p className="font-bold">{noti.content}</p>
          <CircleSmall
            className="absolute right-0 top-1/3 rounded-full"
            color="blue"
            fill="blue"
            size={15}
          />
        </div>
      )}
    </div>
  );
};

const NotificationDialog = ({ option, setOption }: { option: string; setOption: any }) => {
  const { allNoti } = useNoti();
  const [newNotiCount, setNewNotiCount] = useState(0);

  useEffect(() => {
    let count = 0;
    allNoti.forEach((noti: NotiType) => {
      count += !noti.is_read ? 1 : 0;
    });
    setNewNotiCount(count);
  }, [allNoti]);

  return (
    <div>
      <Button
        size="icon"
        className={cn(
          'rounded-full relative',
          option == Options.NOTI ? 'bg-accent text-accent-foreground hover:bg-accent/80' : ' '
        )}
        onClick={() => {
          if (option === Options.NOTI) {
            setOption(Options.NULL);
          } else {
            setOption(Options.NOTI);
          }
        }}
      >
        <Bell className="" />
        {newNotiCount > 0 && (
          <Badge className="absolute top-[-5px] right-[-5px] rounded-full bg-destructive">
            {newNotiCount}
          </Badge>
        )}
      </Button>
      {option === Options.NOTI && (
        <Card className="md:absolute inset-x-0 md:h-[86vh] my-2 fixed h-full">
          <CardHeader className="font-medium">Notification</CardHeader>
          <CardContent className="overflow-y-auto max-h-[500px]">
            <div className="flex flex-col gap-1">
              {allNoti.length > 0 &&
                allNoti.map((noti: NotiType) => <PreviewNoti key={noti.id} noti={noti} />)}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationDialog;
