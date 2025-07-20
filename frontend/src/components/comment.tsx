"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/context/authContext'
import { fetchAPI } from '@/lib/api'
import { aliasFullname, cn } from '@/lib/utils'
import { sendMessage } from '@/lib/websocket'
import { CommentType } from '@/type/type'
import { Send } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Comment = ({comment_data}: {comment_data: CommentType}) => {
    return (
        <div className='flex items-center gap-2' key={comment_data.id} id={comment_data.id.toString()}>
            <Avatar>
                <AvatarImage src={comment_data.user?.avatar || undefined} />
                <AvatarFallback>{aliasFullname(comment_data.user.fullname)}</AvatarFallback>
            </Avatar>
            <div className='bg-muted px-3 py-1 rounded-lg'>
              <Link href={`/profile/${comment_data.user.id}`} className='font-bold'>{comment_data.user.fullname}</Link>
              <p className=''>{comment_data.content}</p>
            </div>
        </div> 
    )
}

const CommentPart = ({post_id, post_user_id}: {post_id: number, post_user_id: number})=>{
    const [comments, setComments] = useState<CommentType[]>([])
    const [newComment, setNewComment] = useState("")
    const {userInfo} = useAuth()
    const [limitOffset, setLimitOffset] = useState<{limit: number, offset: number}>({limit: 4, offset: 0})
    const [more, setMore] = useState(false)
    const [hasMore, setHasMore] = useState(true)

    useEffect(()=>{
        const fetchComment = async ()=>{
        try{
            const data = await fetchAPI(`/comment/${post_id}?limit=${limitOffset.limit}&offset=${limitOffset.offset}`, "GET")
            if(data.length < limitOffset.limit) setHasMore(false)

            setComments((prev: CommentType[])=>[
              ...prev,
              ...data.filter((d: CommentType) => !prev.some(p => p.id === d.id))
            ])

            setLimitOffset((prev: any)=>(
              {...prev,
              offset: prev.offset + prev.limit}
            ))
        }catch(e){
            console.log(e);
        }
        }
        if(hasMore){
          fetchComment()
        }
    }, [post_id, more])

    const handleSubmit = async ()=>{
        if (!newComment.trim()) return;
        
        try{
        const data = await fetchAPI('/comment', "POST", {
            user_id: userInfo.id,
            post_id: post_id,
            content: newComment
        })
        sendMessage({
            type: "noti",
            noti_type: "Comment",
            content: `${userInfo.fullname} has commented on your post \n "${newComment}" `,
            to: post_user_id,
            link: `/post/${post_id}#${data.id}`
        })
        setComments(prev=>[...prev, data])
        setNewComment("")
        }catch(e){
            console.log(e)
        }
    }


    return(
        <div className='flex flex-col gap-2 '>
          <div className='comment flex flex-col gap-2 my-2'>
            {comments && comments.map((comment: CommentType)=>(
              <Comment key={comment.id} comment_data={comment}/>
            ))}
          </div>
          <div className={cn('space-y-2 text-sm text-primary-foreground/70 hover:text-primary-foreground cursor-pointer', hasMore?"":"hidden")}
            onClick={()=>setMore(!more)}
          >View more...</div>
          <form 
            onSubmit={(e)=>{
              e.preventDefault();
              handleSubmit();
            }}
            className='flex gap-2 items-center justify-between'
          >
            <Input
              placeholder='Add a comment...' 
              className='border-none shadow-none outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-none'
              value={newComment}
              onChange={(e)=>setNewComment(e.target.value)}
            />
            <Button type={"submit"} variant={"ghost"}>
              <Send />
            </Button>
            
          </form>
        </div>
    )
}


export default CommentPart