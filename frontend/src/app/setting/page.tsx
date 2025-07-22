"use client"
import ThemeSwitcher from '@/components/theme-switcher'
import { Button } from '@/components/ui/button'
import { Dialog, DialogHeader, DialogDescription, DialogTitle, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { fetchAPI } from '@/lib/api'
import { DialogTrigger } from '@radix-ui/react-dialog'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type PasswordForm = {
  old_password: string,
  new_password: string,
  rewrite_password: string
}

const ChangePasswordDialog = ()=>{
  const {register, reset, handleSubmit} = useForm<PasswordForm>()
  const [open, setOpen] = useState(false)
  const onsubmit = async(data: PasswordForm)=>{
    try{
      await fetchAPI('/auth/password/change', "POST", data)
      reset()
      toast.success("Password change successfully", {description: "Hehehe"})
    }catch(e){
      console.log(e)
    }finally{

    }
  }
  return(
    <Dialog open={open} onOpenChange={()=>{
      setOpen(!open)
    }}>
      <DialogTrigger asChild className='rounded-lg'>
        <Button variant={"outline"}>Change password</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          <DialogHeader>Change Password</DialogHeader>
          <DialogDescription></DialogDescription>
        </DialogTitle>
        <form 
          onSubmit={handleSubmit(onsubmit)}
          className='flex flex-col gap-1'
        >
          <Input
            type='password'
            placeholder='Old password'
            {...register("old_password", {required: "Password must require"})}
          />
          <Input
            type='password'
            placeholder='New password'
            {...register("new_password", {required: "Password must require"})}
          />
          <Input
            type='password'
            placeholder='Rewrite new password'
            {...register("rewrite_password", {required: "Password must require"})}
          />
          <Button type='submit'>Confirm</Button>
        </form>
        
      </DialogContent>
    </Dialog>
  )
}

const Setting = () => {
  return (
    <div className='container flex flex-col py-5 px-10 space-y-2 bg-primary rounded-md'>
      <header className='font-extrabold text-3xl'>Setting</header>
      <ul className='flex flex-col gap-1'>
        <li><ChangePasswordDialog /></li>
        <li></li>
        <li></li>
        <li><ThemeSwitcher /></li>
      </ul>
    </div>
  )
}

export default Setting