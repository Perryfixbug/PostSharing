"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Friend from '@/components/friend'
import { fetchAPI } from '@/lib/api'
import { cn } from '@/lib/utils'
import { UserType } from '@/type/type'
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import User from '@/components/user'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/authContext'
import AuthFirst from '@/components/auth-first'

const FriendPage = () => {
  const [type, setType] = useState("pending")
  const [submit, setSubmit] = useState(false)
  const [input, setInput] = useState("")
  const [searchResult, setSearchResult] = useState<any[]>([]) 
  const router = useRouter()
  const { isAuth } = useAuth()

  useEffect(()=>{
    if(!isAuth) return
    const fetchFriends = async ()=>{
      const data = await fetchAPI(`/friendship/?type=${type}`)
      setSearchResult(data)
      console.log(data)
    }
    fetchFriends()
  },[type, isAuth])

  return isAuth ? (
    <div className='container flex flex-col py-5 px-10 space-y-2 bg-primary rounded-md'>
      <h1 className='text-3xl font-extrabold'>Friend</h1>
      <div className='flex items-center gap-2'>
        <Input 
          type='search'  
          className='rounded-full'
          placeholder='Search...'
          value={input}
          onChange={(e)=>setInput(e.target.value)}
        />
        <Button 
          variant={"ghost"} className='rounded-full'
          onClick={()=>setSubmit(true)}
        >
          <Search /> 
        </Button>
      </div>

      <div className='slection-group flex gap-2 items-center'>
        <div 
          className= {cn('w-18 rounded-full border-2 text-center p-1 cursor-pointer', type==="pending"?"bg-secondary text-secondary-foreground":"")}
          onClick={()=>{setType("pending")}}
        >Invites</div>
        <div 
          className= {cn('w-18 rounded-full border-2 text-center p-1 cursor-pointer', type==="accepted"?"bg-secondary text-secondary-foreground":"")}
          onClick={()=>{setType("accepted")}}
        >Friends
        </div>
      </div>

      <p>Result</p>
      {searchResult && searchResult.map((friend)=>{
        if(type=="pending") return <Friend key={friend.friend_id} friend_data={friend.info} />
        else if(type == "accepted") return <User key={friend.friend_id} user_data={friend.info}/>
      })
      }
      
    </div>
  ) : <AuthFirst />
}

export default FriendPage