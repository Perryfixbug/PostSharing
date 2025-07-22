'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {Card, CardTitle, CardHeader, CardContent, CardAction} from '@/components/ui/card'
import { useAuth } from '@/context/authContext'
import { Options } from '@/type/type'
import { LogOut, Settings, User } from 'lucide-react'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import ThemeSwitcher from '@/components/theme-switcher'

const UserDialog = ({option, setOption}: {option: string, setOption: any}) => {
  const {logout, userInfo} = useAuth()
  const {push} = useRouter()
  return (
    <div>
        <Button 
          variant="ghost" size="icon" 
          className='rounded-full'
          onClick={()=>{
            if(option === Options.USER){
              setOption(Options.NULL)
            }else{
              setOption(Options.USER)
            }
          }}
        >
            <Avatar>
                <AvatarImage src={userInfo?.avatar || undefined} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        </Button>
        {option === Options.USER && 
        <Card className='md:absolute inset-x-0 md:h-[86vh] my-2 fixed h-full'>
          <CardHeader className='font-medium'>Profile</CardHeader>
          <CardContent className='flex flex-col items-start'>
            <Button 
              variant={"ghost"} 
              className='rounded-full'
              onClick={()=>{
                push('/profile/me')
                setOption("")
              }}
            >
              <User />
              To Profile
            </Button>

            <Button 
              variant={"ghost"} 
              className='rounded-full'
              onClick={()=>{
                push('/setting')
                setOption("")
              }}
            >
              <Settings />
              Setting
            </Button>
            
            <Button 
              variant={"ghost"} 
              className='rounded-full text-red-600'
              onClick={()=>logout()}
            >
              <LogOut />
              <span>Log out</span>
            </Button>
            <ThemeSwitcher />
          </CardContent>
        </Card>
        }
    </div>
  )
}

export default UserDialog