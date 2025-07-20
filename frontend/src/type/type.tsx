export interface UserType {
  id: number;
  fullname: string;
  phone: string;
  email: string;
  address: string | null;
  description: string | null;
  gender: string | null;
  dob: string | null;
  list_friend: [number] | null; 
  avatar: string | null,
  background: string | null
}

export interface PostType{
    id: number,
    title: string,
    content: string,
    user_id: number,
    user: UserType,
    create_date: string,
    comments: any,
    emotes: any
}

export interface CommentType{
  id: number,
  user_id: number,
  post_id: number,
  user: UserType,
  content: string,
  create_date: string
}

export interface EmoteType{
  id: number,
  user_id: number,
  post_id: number,
  type: string,
  create_date: string
}

export interface MessageType{
  id: number
  sender_id: number,
  receiver_id: number,
  is_read: boolean,
  create_date: string,
  content: string
}

export const Options = {
  NULL: 'null',
  CHAT: "chat",
  NOTI: "notification",
  USER: "user"
}

export interface newMessageType{
  type: string,
  to: number,
  content: string
}

export interface NotiType{
  id: number,
  type: string,
  content: string,
  create_date: string
  is_read: boolean,
  link: string
}