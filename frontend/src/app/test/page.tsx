"use client"
import { SkeletonCreate, SkeletonProfile } from '@/components/skeletons'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/authContext'
import { useLoading } from '@/context/loadingContext'
import { fetchAPI } from '@/lib/api'
import { uploadImage } from '@/lib/upload'
import { UserType } from '@/type/type'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { Pen } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

// export interface UserType {
//   id: number;
//   fullname: string;
//   phone: string;
//   email: string;
//   address: string | null;
//   description: string | null;
//   gender: string | null;
//   dob: string | null;
//   list_friend: [number] | null; 
//   avatar: string | null,
//   background: string | null
// }


const Test = () => {
    return (
        <div className='h-full'>Hello</div>
    )
}

export default Test