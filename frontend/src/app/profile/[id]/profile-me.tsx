'use client';
import InteractPart from '@/components/interact';
import Option from '@/components/option';
import Post from '@/components/post';
import { SkeletonProfile } from '@/components/skeletons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/authContext';
import { fetchAPI } from '@/lib/api';
import { uploadImage } from '@/lib/upload';
import { aliasFullname, toIsoDate } from '@/lib/utils';
import { PostType, UserType } from '@/type/type';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Pen } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';
import { toast } from 'sonner';

const EditDialog = () => {
  const { userInfo, setUserInfo } = useAuth();
  const { register, handleSubmit, reset, watch } = useForm<UserType>({
    defaultValues: userInfo,
  });
  const [editing, setEditing] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const onsubmit = async (data: UserType) => {
    setLoadingSubmit(true);
    try {
      const payload: any = {};
      if (data.fullname !== userInfo.fullname) payload.fullname = data.fullname;
      if (data.phone !== userInfo.phone) payload.phone = data.phone;
      if (data.email !== userInfo.email) payload.email = data.email;
      if (data?.dob && data.dob !== userInfo.dob) payload.dob = toIsoDate(data.dob);
      if (data?.description && data.description !== userInfo.description)
        payload.description = data.description;
      if (file) {
        const fileUrl = await uploadImage(file);
        payload.avatar = fileUrl;
      } //Up len cloud
      const resData = await fetchAPI(`/user/${userInfo.id}`, 'PUT', payload);
      toast.success('You just have updated your profile', { description: 'Check it now!' });
      setUserInfo(resData);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error(String(err));
      }
    } finally {
      setOpenDialog(false);
      setLoadingSubmit(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      reset(userInfo);
    }
  }, [userInfo, reset]);

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(open) => {
        setOpenDialog(open);

        if (!open) {
          reset(userInfo);
          setEditing('');
          setPreview(null);
        }
      }}
    >
      <DialogTrigger asChild className="flex gap-2 items-center">
        <Button variant={'ghost'}>
          <Pen size={15} />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col gap-5">
          {/* Avatar */}
          <div className="w-full flex items-center justify-center relative">
            <Avatar className="w-50 h-50">
              <AvatarImage
                src={preview || userInfo?.avatar || undefined}
                className="object-cover"
              />
              <AvatarFallback>{aliasFullname(userInfo.fullname)}</AvatarFallback>
            </Avatar>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
            <Pen
              size={20}
              className="absolute top-0 right-0 z-50"
              onClick={() => fileInputRef.current?.click()}
            />
          </div>
          {/* Fullname */}
          <div className="flex justify-between items-center gap-5">
            <div className="flex items-center gap-2 justify-between">
              Fullname:
              {editing == 'fullname' ? (
                <Input
                  id="fullname"
                  type="input"
                  required
                  autoComplete="fullname"
                  {...register('fullname', { required: 'Fullname is required' })}
                  className="w-80"
                />
              ) : (
                <p>{watch('fullname') || userInfo?.fullname}</p>
              )}
            </div>
            <Pen size={20} onClick={() => setEditing(editing != 'fullname' ? 'fullname' : '')} />
          </div>
          {/* Description */}
          <div className="flex justify-between items-center gap-5">
            <div className="flex items-start gap-2 justify-between">
              Description:
              {editing == 'description' ? (
                <Textarea
                  id="description"
                  // type="input"
                  required
                  autoComplete="description"
                  {...register('description')}
                  className="w-80"
                />
              ) : (
                <p>{watch('description') || userInfo?.description}</p>
              )}
            </div>
            <Pen
              size={20}
              onClick={() => setEditing(editing != 'description' ? 'description' : '')}
            />
          </div>
          {/* Email */}
          <div className="flex justify-between items-center gap-5">
            <div className="flex gap-2 items-center justify-between">
              Email:
              {editing == 'email' ? (
                <Input
                  id="email"
                  type="input"
                  required
                  autoComplete="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-80"
                />
              ) : (
                <p>{watch('email') || userInfo?.email}</p>
              )}
            </div>

            <Pen size={20} onClick={() => setEditing(editing != 'email' ? 'email' : '')} />
          </div>
          {/* Phone */}
          <div className="flex justify-between items-center gap-5">
            <div className="flex gap-2 items-center justify-between">
              Phone:
              {editing == 'phone' ? (
                <Input
                  id="phone"
                  type="input"
                  required
                  autoComplete="phone"
                  {...register('phone', { required: 'Phone is required' })}
                  className="w-80"
                />
              ) : (
                <p>{watch('phone') || userInfo?.phone}</p>
              )}
            </div>
            <Pen
              size={20}
              className=""
              onClick={() => setEditing(editing != 'phone' ? 'phone' : '')}
            />
          </div>
          {/* Birthday */}
          <div className="flex justify-between items-center gap-5">
            <div className="flex gap-2 justify-between items-center">
              Birthday:
              {editing == 'birthday' ? (
                <Input
                  id="birthday"
                  type="date"
                  required
                  autoComplete="birthday"
                  {...register('dob')}
                  className="w-80"
                  lang="vi-VN"
                />
              ) : (
                <p>{watch('dob') || new Date(userInfo?.dob).toLocaleDateString('vi-VN')}</p>
              )}
            </div>
            <Pen size={20} onClick={() => setEditing(editing != 'birthday' ? 'birthday' : '')} />
          </div>
          <Button type="submit" disabled={loadingSubmit}>
            {loadingSubmit && (
              <ClipLoader size={25} speedMultiplier={1} color="var(--primary-foreground)" />
            )}
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ProfileMe = () => {
  const { userInfo, isAuth, authLoading } = useAuth();
  const [userPosts, setUserPosts] = useState<PostType[]>([]);

  useEffect(() => {
    if (authLoading || !isAuth || !userInfo?.id) return;
    const fetchUserPost = async () => {
      const data = await fetchAPI(`/post/user/${userInfo.id}`);
      setUserPosts(data);
    };
    fetchUserPost();
  }, [isAuth, authLoading, userInfo]);

  return authLoading ? (
    <SkeletonProfile />
  ) : isAuth ? (
    <div className="container flex flex-col px-10 py-5 justify-between gap-2">
      <div className="base_info flex flex-col space-x-2 items-center">
        <Avatar className="h-50 w-50 rounded-full border-2 border-primary shadow-lg overflow-hidden">
          <AvatarImage src={userInfo?.avatar || undefined} />
          <AvatarFallback>{aliasFullname(userInfo.fullname)}</AvatarFallback>
        </Avatar>
        <span className="text-2xl font-bold">{userInfo?.fullname}</span>
        <p>{userInfo?.description}</p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">Info</span>
          <EditDialog />
        </div>
        <ul className="flex flex-col gap-2">
          <li>Email: {userInfo?.email}</li>
          <li>Phone: {userInfo?.phone}</li>
          {userInfo?.gender && <li>Gender: {userInfo?.gender}</li>}
          {userInfo?.dob && (
            <li>Birthday: {new Date(userInfo?.dob).toLocaleDateString('vi-VN')}</li>
          )}
        </ul>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-2xl font-bold">Posted</span>
        {userPosts &&
          userPosts.map((post: PostType) => (
            <div key={post.id} className="flex flex-col bg-primary rounded-md p-5 relative">
              <Post post_data={post} />
              <Option post_data={post} setUserPosts={setUserPosts} />
              <InteractPart post_id={post.id} emotes={post?.emotes} />
              {/* <CommentPart post_id={post_data.id} post_user_id={post_data.user_id}/> */}
              <Link
                className="space-y-2 text-sm text-primary-foreground/70 hover:text-primary-foreground"
                href={`/post/${post.id}`}
              >
                View all comments...
              </Link>
            </div>
          ))}
      </div>
    </div>
  ) : (
    <p>You should login first</p>
  );
};

export default ProfileMe;
