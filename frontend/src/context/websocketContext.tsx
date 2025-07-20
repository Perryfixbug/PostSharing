"use client"
import { useAuth } from "@/context/authContext";
import { connectWs, sendMessage } from "@/lib/websocket";
import { MessageType, NotiType } from "@/type/type";
import React, { useState, useContext, createContext, useEffect } from "react";

export const WebsocketContext = createContext<any>(null)
export const useSocket = ()=> useContext(WebsocketContext)

export default function SocketProvider({children}: {children: React.ReactNode}){
    const { isAuth, userInfo, authLoading } = useAuth()
    const [messages, setMessages] = useState<Map<number, MessageType[]>>(new Map()) //New message
    const [noti, setNoti] = useState<NotiType[]>([])

    const getMessageWith = (userId: number) => {
        return messages.get(userId) || []   //UserId chatting with
    }

    useEffect(()=>{
        if(authLoading || !isAuth) return
        connectWs(`/ws/${userInfo.id}`,
            (msg: MessageType)=>{
                const partnerId = msg.sender_id === userInfo.id ? msg.receiver_id : msg.sender_id

                setMessages((prev) => {
                    const updated = new Map(prev)
                    const oldMsgs = updated.get(partnerId) || []
                    // Nếu tin nhắn đã tồn tại, không thêm nữa
                    if (oldMsgs.some(m => m.id === msg.id)) return updated
                    updated.set(partnerId, [...oldMsgs, msg])
                    return updated
                })
            }, 
            (not: NotiType)=>{
                setNoti((prev)=>(
                    [
                        not,
                        ...prev
                    ]
                ))
            }
        )
    },[authLoading, isAuth])

    return(
        <WebsocketContext.Provider value={{sendMessage, getMessageWith, messages, setMessages, noti, setNoti}}>
            {children}
        </WebsocketContext.Provider>
    )
}
