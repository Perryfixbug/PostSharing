import CommentPart from '@/components/comment';
import InteractPart from '@/components/interact';
import Post from '@/components/post';
import { fetchAPI } from '@/lib/api';
import { PostType } from '@/type/type';
import Link from 'next/link';

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post`, {
    method: 'GET',
    cache: 'no-store', // <- Vô hiệu hóa cache
  });

  const allPosts = await res.json();

  return (
    <div className="container flex flex-col gap-3">
      {allPosts.length != 0 &&
        allPosts.map((post_data: PostType) => (
          <div key={post_data.id} className="homepage container bg-primary p-5 rounded-md">
            <Post post_data={post_data} />
            <InteractPart
              post_id={post_data.id}
              emotes={post_data?.emotes}
            />
            <Link
              className="space-y-2 text-sm text-primary-foreground/70 hover:text-primary-foreground"
              href={`/post/${post_data.id}`}
            >
              View all comments...
            </Link>
            <CommentPart post_id={post_data.id} post_user_id={post_data.user_id} />
          </div>
        ))}
    </div>
  );
}
