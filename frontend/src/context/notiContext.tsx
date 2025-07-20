'use client'

import { useAuth } from "@/context/authContext"
import { useSocket } from "@/context/websocketContext"
import { fetchAPI } from "@/lib/api"
import { NotiType } from "@/type/type"
import { useState, useEffect, useContext, createContext } from "react"

export const NotiContext = createContext<any>(null)
export const useNoti = () => useContext(NotiContext)

export default function NotiProvider ({children}: {children: React.ReactNode}){
    const {isAuth, authLoading} = useAuth()
    const {noti, setNoti} = useSocket()
    const [allNoti, setAllNoti] = useState<NotiType[]>([])

    useEffect(()=>{
        if(authLoading || !isAuth) return
        const fetchAllNoti = async()=>{
            try{
                const data = await fetchAPI("/notification", "GET")
                setAllNoti(data)
            }catch(e){
                console.log(e)
            }
        }
        fetchAllNoti()
    }, [isAuth, authLoading])

    useEffect(()=>{
        if(noti.length === 0) return
        setAllNoti(prev=>{ 
            return(
                [
                    ...noti,
                    ...prev
                ]
            )
        })
        setNoti([])
    }, [noti])

    return(
        <NotiContext.Provider value={{allNoti, setAllNoti}}>
            {children}
        </NotiContext.Provider>
    )
}