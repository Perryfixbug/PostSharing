import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const SkeletonProfile = () => {
  return (
    <div className='container flex flex-col px-10 py-5 justify-between gap-2'>
      <div className='base_info flex flex-col space-x-2 items-center gap-2'>
        <Skeleton className='h-50 w-50 rounded-full' />
        <Skeleton className='w-20 h-5 rounded-full' />
        <Skeleton className='w-50 h-5 rounded-full' />
      </div>  
      <div className='flex flex-col gap-2'>
        <Skeleton className='w-15 h-5 rounded-full' />
        <Skeleton className='w-25 h-5 rounded-full' />
        <Skeleton className='w-23 h-5 rounded-full' />
      </div>
      
        <Skeleton className='w-15 h-5 rounded-full' />
        <div className='flex flex-col bg-primary rounded-md p-5 gap-2'>
            <div className='flex gap-2'>
                <Skeleton className='w-15 h-15 rounded-full' />
                <Skeleton className='w-15 h-10'/>
            </div>
            <Skeleton className='w-50 h-5 rounded-full' />
            <Skeleton className='w-100 h-5 rounded-full' />
            <Skeleton className='w-100 h-5 rounded-full' />
            <div className='flex justify-between'>
                <Skeleton className='w-20 h-5 rounded-full' />
                <Skeleton className='w-20 h-5 rounded-full' />
                <Skeleton className='w-20 h-5 rounded-full' />
            </div>
        </div>
    
    </div>
  )
}

const SkeletonCreate = ()=>{
    return(
        <div className='container flex flex-col bg-primary py-5 px-10 space-y-2 rounded-md'>
            <div className="info container flex gap-2 items-center">
                <Skeleton className='h-8 w-8 rounded-full'/>
                <Skeleton className='w-20 h-5 rounded-full'/>
            </div>
            <div className='flex flex-col gap-2'>
                <Skeleton className='w-full h-8 '/>
                <Skeleton className='w-full h-16 '/>
                <Skeleton className='w-full h-8 '/>
            </div>
        </div>
    )
}

export { SkeletonProfile, SkeletonCreate }