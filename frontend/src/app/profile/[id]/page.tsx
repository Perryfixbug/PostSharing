import ProfileMe from '@/app/profile/[id]/profile-me'
import CommentPart from '@/components/comment'
import InteractPart from '@/components/interact'
import Post from '@/components/post'
import { fetchAPI } from '@/lib/api'
import { PostType } from '@/type/type'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import React from 'react'
import { aliasFullname } from '@/lib/utils'

const Profile = async ({params}: {params: Promise<{id: string}>}) => {
  const { id } = await params
  
  if(id === 'me') return <ProfileMe />

  const user = await fetchAPI(`/user/${id}`)
  const userPosts = await fetchAPI(`/post/user/${id}`)

  return (
    <div className='container flex flex-col px-10 py-5 justify-between gap-2'>
      <div className='base_info flex flex-col space-x-2 items-center'>
        <Avatar className='h-50 w-50 rounded-full border-2 border-primary shadow-lg overflow-hidden'>
          <AvatarImage 
            src={user?.avatar || undefined}  
          />
          <AvatarFallback>{aliasFullname(user.fullname)}</AvatarFallback>
        </Avatar>
        <span className='text-2xl font-bold'>{user.fullname}</span>
      </div>  

      <ul className='flex flex-col gap-2'>
        <li className='text-2xl font-bold'>Info</li>
        <li>Email: {user.email}</li>
        <li>Phone: {user.phone}</li>
        {user?.gender &&<li>Gender: {user.gender}</li>}
        {user?.dob && <li>Birthday: {new Date(user.dob).toLocaleDateString()}</li>}
      </ul>
      <div className='flex flex-col gap-2'>
        <span className='text-2xl font-bold'>Posted</span>
        {userPosts && userPosts.map((post: PostType)=>
            <div key={post.id} className='flex flex-col bg-primary rounded-md p-5'>
              <Post post_data={post}/>
              <InteractPart post_id={post.id} emotes={post?.emotes} comments={post?.comments}/>
              {/* <CommentPart post_id={post_data.id} post_user_id={post_data.user_id}/> */}
              <Link 
                className='space-y-2 text-sm text-primary-foreground/70 hover:text-primary-foreground'
                href={`/post/${post.id}`}
              >View all comments...</Link>
            </div>
          )}
      </div>
    </div>
  )
}

export default Profile