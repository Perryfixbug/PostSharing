"use client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '@/context/authContext'
import { AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Ellipsis, Pen, PenTool, Trash, Trash2 } from 'lucide-react'
import React, { useState } from 'react'

const ReviseDialog = ()=>{
    const handleEditPost = async()=>{
        
    }

    return(
        <Dialog>
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
                
            </DialogContent>
        </Dialog>
    )
}

const RemoveDialog = ()=>{
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
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

const Option = ({owner_id}: {owner_id: number}) => {
    const [dropDown, setDropDown] = useState(false)
    const {userInfo} = useAuth()

    return userInfo?.id == owner_id && (
        <div className='relative'>
        <Button
            className='rounded-full' 
            variant={"ghost"}
            onClick={()=>setDropDown(!dropDown)}>
            <Ellipsis />
        </Button>
        {dropDown && 
        <ul className='absolute bg-background w-80 flex flex-col right-0 gap-2 my-2 rounded-md p-2'>
            <ReviseDialog />
            <RemoveDialog />
        </ul>
        }
        </div>
  )
}

export default Option