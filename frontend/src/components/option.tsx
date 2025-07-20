"use client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '@/context/authContext'
import { AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Ellipsis, Pen, PenTool, Trash, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { PostType } from '@/type/type'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import { ClipLoader } from 'react-spinners'
import { fetchAPI } from '@/lib/api'
import { toast } from 'sonner'

type FormValues = {
    title: string,
    content: string
}


const ReviseDialog = ({post_data, setUserPosts, setDropdown}: {post_data: PostType, setUserPosts: any, setDropdown: any})=>{
    const [editing, setEditing] = useState("")
    const [openDialog, setOpenDialog] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const {register, handleSubmit, reset, watch} = useForm({
        defaultValues: post_data
    })

    const onsubmit = async (data: FormValues)=>{
        setLoadingSubmit(true)
        try{
            const newPost = await fetchAPI(`/post/${post_data.id}`, "PUT", data)
            setUserPosts((prev: PostType[]) => {
                const updatedPosts = [...prev];
                const index = updatedPosts.findIndex(post => post.id === post_data.id);
                if (index !== -1) {
                    updatedPosts[index] = newPost;
                }
                return updatedPosts;
            });
            toast.success("You just have updated post", {"description": `#${newPost.title}`})
        }catch(e){
            console.log(e)
        }finally{
            setLoadingSubmit(false)
            setOpenDialog(false)
            setDropdown(false)
        }
    }

    useEffect(()=>{
        if (post_data) {
            reset(post_data);
        }
    }, [reset, post_data])

    return(
        <Dialog open={openDialog} onOpenChange={(open) => {
            setOpenDialog(open)
            if (!open) {
                reset(post_data)
                setEditing("");
            }
        }}>
            <DialogTrigger className='flex gap-2 items-center hover:bg-muted p-2 rounded-md '>
                <Pen size={20}/>
                <div className='flex flex-col items-start'>
                    <span className='text-sm font-bold'>Revise</span>
                    <p className='text-[10px] text-foreground/50 font-thin'>Edit your post</p>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='flex gap-2 items-center'><Pen size={20} />Edit Post</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <form 
                    onSubmit={handleSubmit(onsubmit)} 
                    className='flex flex-col gap-5'
                >
                    {/* Title */}
                    <div className='flex justify-between items-center gap-5'>
                        <div className='flex items-center gap-2 justify-between'>  
                            {editing=="title" ? 
                            <Input
                                id="title"
                                type="input"
                                required
                                autoComplete="title"
                                {...register('title', {required: 'Title is required'})}
                                className='w-90'
                            />
                            :
                            <p>{watch("title") || post_data.title}</p>  
                            }
                        </div>
                        <Pen size={20} onClick={()=>setEditing(editing!="title" ? "title":"" )}/>
                    </div>
                    {/* Content */}
                    <div className='flex justify-between items-center gap-5'>
                        <div className='flex items-center gap-2 justify-between'>  
                            {editing=="content" ? 
                            <Textarea
                                id="content"
                                required
                                autoComplete="content"
                                {...register('content', {required: 'Content is required'})}
                                className='w-90'
                            />
                            :
                            <p>{watch("content") || post_data.content}</p>  
                            }
                        </div>
                        <Pen size={20} onClick={()=>setEditing(editing!="content" ? "content":"" )}/>
                    </div>
                    <Button type='submit' disabled={loadingSubmit}>
                        {loadingSubmit && <ClipLoader size={25} speedMultiplier={1} color='var(--primary-foreground)'/>}
                        Submit
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

const RemoveDialog = ({post_data, setUserPosts, setDropdown}: {post_data: PostType, setUserPosts: any, setDropdown: any})=>{
    const handleDeletePost = async ()=>{
        try{
            await fetchAPI(`/post/${post_data.id}`, "DELETE")
            setUserPosts((prev: PostType[]) => {
                const updatedPosts = [...prev];
                const index = updatedPosts.findIndex(post => post.id === post_data.id);
                updatedPosts.splice(index, 1)
                return updatedPosts;
            });
            setDropdown(false)
            toast.success("Deleted Post", {description: `${post_data.title}`})
        }catch(e){
            console.log(e)
        }
    }

    return(
        <AlertDialog>
            <AlertDialogTrigger className='flex gap-2 items-center hover:bg-muted p-2 rounded-md '>
                <Trash2 size={20}/>
                <div className='flex flex-col items-start'>
                    <span className='text-sm font-bold'>Remove</span>
                    <p className='text-[10px] text-foreground/50 font-thin'>Delete your post</p>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action will permanently remove your post!</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeletePost}
                    >Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

const Option = ({post_data, setUserPosts}: {post_data: PostType, setUserPosts: any}) => {
    const [dropDown, setDropDown] = useState(false)
    const {userInfo} = useAuth()

    return userInfo?.id == post_data.user_id && (
        <div className='absolute top-2 right-2'>
        <Button
            className='rounded-full' 
            variant={"ghost"}
            onClick={()=>setDropDown(!dropDown)}
            // onBlur={()=>setDropDown(false)}
        >
            
            <Ellipsis />
        </Button>
        {dropDown && 
        <ul className='absolute bg-background w-80 flex flex-col right-0 gap-2 my-2 rounded-md p-2'>
            <ReviseDialog post_data={post_data} setUserPosts={setUserPosts} setDropdown={setDropDown}/>
            <RemoveDialog post_data={post_data} setUserPosts={setUserPosts} setDropdown={setDropDown}/>
        </ul>
        }
        </div>
  )
}

export default Option