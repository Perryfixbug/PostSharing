'use client';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/authContext';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type FormValues = {
  email: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const { login } = useAuth();

  const onSubmit = async (data: FormValues) => {
    try {
      await login(data.email, data.password);
      reset();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error(String(err));
      }
    }
  };
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
            width={10}
            height={10}
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-secondary">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-secondary">
                Email address
              </label>
              <Input
                id="email"
                type="input"
                required
                autoComplete="email"
                {...register('email', { required: 'Email is required' })}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-secondary">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <Input
                id="password"
                type="password"
                required
                autoComplete="password"
                {...register('password', { required: 'Password is required' })}
              />
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Log in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?{' '}
            <a href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
