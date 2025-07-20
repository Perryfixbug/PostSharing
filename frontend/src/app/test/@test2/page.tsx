import Link from 'next/link'
import React from 'react'

const Page1 = () => {
  return (
    <div className='h-full flex-col flex'>
        This is page 2
        <Link href="/test/test4" >Link to some where</Link>
    </div>
  )
}

export default Page1