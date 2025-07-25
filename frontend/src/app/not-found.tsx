import Image from 'next/image';
import React from 'react';

const NotFound = () => {
  return (
    <div className="flex flex-col flex-1 min-h-full justify-center items-center px-6 py-12 lg:px-8">
      <div className="flex flex-col justify-center items-center sm:mx-auto sm:w-full sm:max-w-sm">
        <span className="text-5xl font-bold">Oops!!</span>
        <Image width={200} height={200} src="/duck-svgrepo-com.png" alt="QuacQuac" />
        <span className="text-3xl font-bold ">404 Not found</span>
      </div>
    </div>
  );
};

export default NotFound;
