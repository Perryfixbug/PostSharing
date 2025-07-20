"use client"
import React from 'react'
import { PuffLoader } from 'react-spinners'

const Loading = () => {
  return (
    <div className='loading'>
        <PuffLoader 
            size={400}
            loading
            color={'var(--secondary)'}
        />
    </div>
  )
}

export default Loading