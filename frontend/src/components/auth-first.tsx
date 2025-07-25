'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const AuthFirst = () => {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      const loginButton = document.querySelector('#login-button');
      loginButton?.classList.add(
        'border-2',
        'border-accent',
        'dark:border-2',
        'dark:border-accent'
      );
      setTimeout(() => {
        loginButton?.classList.remove(
          'border-2',
          'border-accent',
          'dark:border-2',
          'dark:border-accent'
        );
      }, 3000);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-full justify-center items-center px-6 py-12 lg:px-8">
      <div className="flex flex-col justify-center items-center sm:mx-auto sm:w-full sm:max-w-sm gap-2">
        <span id="oops" className="text-5xl font-bold">
          Oops!!
        </span>
        <Image width={200} height={200} src="/duck-svgrepo-com.png" alt="QuacQuac" />
        <span className="text-3xl font-bold">You should login first!!</span>
        <Button
          id="login-button"
          className="duration-500 ease-out"
          onClick={() => router.push('/login')}
        >
          To Login
        </Button>
      </div>
    </div>
  );
};

export default AuthFirst;
