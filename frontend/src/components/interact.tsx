"use client"
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/authContext'
import { fetchAPI } from '@/lib/api'
import { CommentType, EmoteType } from '@/type/type'
import { CloudRainWind, Forward, Heart, HeartMinus, HeartPlus, MessageCircle, Snowflake, Sun, Thermometer, Wind } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const InteractPart = ({post_id, emotes, comments}:{post_id: number, emotes: [EmoteType], comments: [CommentType]}) => {
  const router = useRouter()
  const {userInfo, authLoading} = useAuth()
  const [currenEmote, setCurrentEmote] = useState("")

  useEffect(()=>{
    if(authLoading) return
    emotes.some((emote: EmoteType)=>{
      if(emote.user_id == userInfo?.id) setCurrentEmote(emote.type)
    })
    
  },[authLoading, userInfo])

  const handleEmote =  async (type: string)=>{
    try{
      const emote_data = {
        post_id: post_id, 
        user_id: userInfo.id,
        type: type,
      }
      const data = await fetchAPI('/emote', "POST", emote_data)
      setCurrentEmote(type)
    }catch(e){
      console.log(e)
    }
  }

  return (
    <div>
      <ul className='meta-data container flex gap-2'>
        <li className='text-sm font-light'>{emotes.length} Emotes</li>
        {/* <li className='text-sm font-light'>{comments.length} Comments</li> */}
      </ul>
      <ul className='function-button flex justify-between flex-wrap'>
          <li className='flex space-x-2 items-center rounded-sm relative group'>
            {!currenEmote && 
            <Button 
              variant="ghost" 
              onClick={()=>handleEmote("hot")}
            >
                <Thermometer />
                <span className=''>Feel</span>
            </Button>}
            {currenEmote=="hot" && <Button variant="ghost">
                <Sun color='var(--accent)' fill='var(--accent)'/>
                <span className='text-accent'>Hot</span>
            </Button>}
            {currenEmote=="cool" && <Button variant="ghost">
                <Wind color='var(--color-green-500)'/>
                <span className='text-green-500'>Cool</span>
            </Button>}
            {currenEmote=="sad" && <Button variant="ghost">
                <CloudRainWind color='var(--secondary)' fill='var(--color-blue-800)'/>
                <span className='text-secondary'>Sad</span>
            </Button>}
            {currenEmote=="freeze" && <Button variant="ghost">
                <Snowflake color='var(--color-blue-200)' fill='var(--color-blue-200)'/>
                <span className='text-blue-200'>Freeze</span>
            </Button>}
            
            <ul className='absolute opacity-0 group-hover:opacity-100 flex flex-col p-2 bg-muted rounded-full duration-300 delay-100 right-full bottom-0'>
              <li className='hover:bg-accent p-2 rounded-full text-center' onClick={()=>handleEmote("hot")}><Sun size={15}/></li>
              <li className='hover:bg-green-500 p-2 rounded-full text-center' onClick={()=>handleEmote("cool")} ><Wind size={15}/></li>
              <li className='hover:bg-secondary p-2 rounded-full text-center' onClick={()=>handleEmote("sad")}><CloudRainWind size={15}/></li>
              <li className='hover:bg-blue-200 p-2 rounded-full text-center' onClick={()=>handleEmote("freeze")}><Snowflake size={15}/></li>
            </ul>
          </li>
          <li className='flex space-x-2 items-center rounded-sm '>
            <Button 
              variant="ghost" 
              onClick={()=> router.push(`/post/${post_id}`)}
            >
                <MessageCircle />
                <span className=''>Comment</span>
            </Button>
          </li>
          <li className='flex space-x-2 items-center rounded-sm'>
            <Button variant="ghost">
                <Forward />
                <span className=''>Share</span>
            </Button>
          </li>
      </ul>
    </div>
  )
}

export default InteractPart