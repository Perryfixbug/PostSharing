"use client"
import { useAuth } from '@/context/authContext'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import React, { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { fetchAPI } from '@/lib/api'
import { toast } from 'sonner'
import {useRouter} from 'next/navigation'
import { useLoading } from '@/context/loadingContext'
import { SkeletonCreate } from '@/components/skeletons'
import AuthFirst from '@/components/auth-first'

type FormValues = {
  title: string,
  content: string
}

const Create = () => {
  const router = useRouter()
  const { userInfo, isAuth, authLoading } = useAuth()
  const {register, handleSubmit, reset } = useForm<FormValues>()

  const onSubmit = async (data: FormValues) =>{
    try{
      const newPost = await fetchAPI('/post', "POST", {title: data.title, content: data.content, user_id: userInfo.id})
      reset()
      toast.success("Create post successfully!", {
        description: `New Post #${newPost.title}`
      })
    }catch(e){
      console.log(e)
    }
  }
  return authLoading ? <SkeletonCreate /> : isAuth ? (
    <div className='container flex flex-col bg-primary py-5 px-10 space-y-2 rounded-md'>
      <div className="info container flex gap-2 items-center">
          <Avatar>
              <AvatarImage src={userInfo?.avatar} />
              <AvatarFallback>{userInfo?.fullname}</AvatarFallback>
          </Avatar>
          <span className='text-3xl font-bold'>{userInfo?.fullname}</span>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-2'>
        <Input 
          placeholder='Title for the post?'
          required
          {...register('title', {required: "Title are required"})}
          className='border-none shadow-none outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-none'
        />
        <Textarea 
          placeholder='Talk about your opinion?'
          required
          {...register('content', {required: "Content are required"})}
          className='border-none shadow-none outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-none'
        />
        <Button 
          type='submit'
          className='bg-secondary text-secondary-foreground hover:bg-secondary/50'
        >Post</Button>
      </form>
    </div>
  ) : <AuthFirst />
}

export default Create