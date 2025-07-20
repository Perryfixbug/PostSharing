"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchAPI } from "@/lib/api";
import { UserType } from "@/type/type";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type FormValues = {
  fullname: string,
  email: string,
  phone: string,
  password: string
}

export default function SignUp() {
  const {register, handleSubmit, reset} = useForm<FormValues>()
  const router = useRouter()

  const onsubmit = async (data: FormValues)=>{
    try{
      await fetchAPI("/auth/register", "POST", 
      {
        fullname: data.fullname, 
        email: data.email,
        password: data.password,
        phone: data.phone
      })
      reset()
      router.replace('/login')
    }catch(e){
      console.log(e)
    }
  }
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-secondary">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit(onsubmit)} className="space-y-6">
            <div className="flex flex-col items-start">
              <label htmlFor="fullname" className="block text-sm/6 font-medium text-secondary">
                Fullname
              </label>
              <Input
                id="fullname"
                type="input"
                {...register("fullname", {required: "Fullname is required"})}
                autoComplete="fullname"
              />
            </div>

            <div className="flex flex-col items-start">
              <label htmlFor="email" className="block text-sm/6 font-medium text-secondary">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                {...register("email", {required: "Email is required"})}
                autoComplete="email"
              />
      
            </div>

            <div className="flex flex-col items-start">
              <label htmlFor="phone" className="block text-sm/6 font-medium text-secondary">
                Phone number
              </label>
              <Input
                id="phone"
                type="phone"
                {...register("phone", {required: "phone is required"})}
                autoComplete="phone"
              />
      
            </div>

            
            <div className="flex flex-col items-start">
              <label htmlFor="password" className="block text-sm/6 font-medium text-secondary">
                Password
              </label>
              <Input
                id="password"
                type="password"
                {...register("password", {required: "Password is required"})}
                autoComplete="password"
              />
     
            </div>

            <div>
              <Button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </Button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Had account?{' '}
            <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
