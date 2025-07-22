'use client'
import React, { useState, useReducer } from 'react'
import ChatDialog from '@/app/extension-side/chat-dialog'
import NotificationDialog from '@/app/extension-side/notification-dialog'
import UserDialog from '@/app/extension-side/user-dialog'
import { useAuth } from '@/context/authContext'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import ThemeSwitcher from '@/components/theme-switcher'


const Menu = () => {
  const [option, setOption] = useState("")
  const { isAuth } = useAuth()
  const { push } = useRouter()

  return (
    <div className=''>
      {isAuth ?
      <div className='menu flex justify-end space-x-4 items-center relative'>
        <ChatDialog option={option} setOption={setOption} />
        <NotificationDialog option={option} setOption={setOption} />
        <UserDialog option={option} setOption={setOption} />
      </div>
      :<div className='login-menu flex justify-end gap-2 items-center relative' >
        <ThemeSwitcher />
        <Button 
          // id='login-button'
          className='rounded-full' 
          variant={"default"} 
          onClick={()=>push('/login')}
        >
          Login
        </Button>
        {/* <Button 

          className='rounded-full'  
          variant={"default"}
          onClick={()=>push('/signup')}
        >
          Register
        </Button> */}
      </div>  
    }
        
    </div>
  )
}

export default Menu