import Link from 'next/link'
import { House, Search, SquarePen, UserRoundPlus } from 'lucide-react'
import ProfileMeButton from '@/components/profile-me-button'


const NavigationMenu = () => {
  
  return (
    <div className='hidden md:flex flex-col gap-2 p-8 fixed left-0 h-full w-1/4'> 
      <Link href='/' className="logo text-4xl font-extrabold text-accent">QuacQuac</Link>
      <nav className='flex flex-col gap-2'>
        <Link href='/' className='flex items-center w-fit text-2xl gap-2 font-medium'>
          <House />
          <span>Home</span>
        </Link>
        <Link href='/search' className='flex items-center w-fit text-2xl gap-2 font-medium'>
          <Search />
          <span>Search</span>
        </Link>
        <Link href='/create' className='flex items-center w-fit text-2xl gap-2 font-medium'>
          <SquarePen />
          <span>Create</span>
        </Link>
        <Link href='/friend' className='flex items-center w-fit text-2xl gap-2 font-medium'>
          <UserRoundPlus />
          <span>Friends</span>
        </Link>
        <ProfileMeButton />
      </nav>
    </div>
  )
}

export default NavigationMenu