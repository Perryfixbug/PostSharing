import { PostType } from '@/type/type'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'
import Option from '@/components/option'
import { aliasFullname } from '@/lib/utils'

const Post = ({post_data}: {post_data: PostType}) => {
  return (
    <div className='container flex flex-col'>
        <div className='container flex justify-between'>
          <div className='base_info flex space-x-2 items-center'>
              <Avatar className='h-12 w-12 rounded-full border-2 border-primary shadow-lg'>
                  <AvatarImage src={post_data.user?.avatar || undefined} />
                  <AvatarFallback>{aliasFullname(post_data.user.fullname)}</AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <Link className='text-2xl font-bold' href={`/profile/${post_data.user.id}`}>{post_data.user.fullname}</Link>
                <span className='create_date text-[12px] font-thin'>{(new Date(post_data.create_date)).toLocaleDateString()}</span>
              </div>
          </div>
          {/* <Option post_data={post_data}/> */}
        </div>
        <div className='main_content flex flex-col'>
          <span className='text-3xl font-bold'>#{post_data.title}</span>
          <p className=''>{post_data.content}</p>
        </div>
    </div>
  )
}

export default Post;