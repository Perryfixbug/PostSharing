import ProfileMeButton from '@/components/profile-me-button'
import { House, Search, SquarePen, UserRoundPlus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Menu  from '@/app/extension-side/menu'

const TopMenu = () => {
  return (
    <div className='container min-w-sm flex flex-col gap-2 items-start px-5 py-1 md:hidden fixed bg-primary z-50'> 
      <div className='flex justify-between w-full'>
        <Link href='/' className="logo text-3xl font-extrabold text-accent">QuacQuac</Link>
        <Menu />
      </div>
      <nav className='flex gap-2 justify-around w-full'>
        <Link href='/' className='flex flex-col items-center w-fit text-md font-medium'>
          <House />
          <span>Home</span>
        </Link>
        <Link href='/search' className='flex flex-col items-center w-fit text-md font-medium'>
          <Search />
          <span>Search</span>
        </Link>
        <Link href='/create' className='flex flex-col items-center w-fit text-md font-medium'>
          <SquarePen />
          <span>Create</span>
        </Link>
        <Link href='/friend' className='flex flex-col items-center w-fit text-md font-medium'>
          <UserRoundPlus />
          <span>Friends</span>
        </Link>
      </nav>
      
    </div>
  )
}

export default TopMenu