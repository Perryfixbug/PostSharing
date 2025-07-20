import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { fetchAPI } from '@/lib/api'
import { UserType } from '@/type/type'
import { MessageCircle, UserMinus, UserPlus} from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Friend = ({friend_data}: {friend_data: UserType}) => {
    const handleAccept = async()=>{
        const res = await fetchAPI(`/friendship/${friend_data.id}`, "PUT")
    } 

    return (
        <div className="container flex py-5 justify-between items-center flex-wrap">
            <div className='flex gap-2 items-center'>
                <Avatar className='h-12 w-12 rounded-full border-2 border-primary shadow-lg'>
                    <AvatarImage src={friend_data?.avatar || undefined}/>
                    <AvatarFallback>{friend_data.fullname}</AvatarFallback>
                </Avatar>
                <ul className='flex flex-col items-center'>
                    <li className='text-2xl font-bold'>
                        <Link href={`/profile/${friend_data.id}`}>{friend_data.fullname}</Link>
                    </li>
                    <li>{friend_data.gender}</li>
                </ul>
            </div>
            <div className='flex items-center gap-2'>
                <Button 
                    variant={"default"}
                    className='bg-secondary text-secondary-foreground text-center'
                    onClick={(e)=>{
                        e.currentTarget.disabled = true
                        handleAccept()
                    }}
                >
                    <UserPlus />
                    Accept
                </Button>

                <Button 
                variant={"outline"}
                className=' text-center'
                >
                    <UserMinus />
                    Decline
                </Button>
            </div>
        </div>
        
  )
}

export default Friend