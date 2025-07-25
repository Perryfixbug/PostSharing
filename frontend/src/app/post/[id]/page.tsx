import CommentPart from '@/components/comment';
import InteractPart from '@/components/interact';
import Post from '@/components/post';
import { fetchAPI } from '@/lib/api';
import React from 'react';

const PostDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const post_data = await fetchAPI(`/post/detail/${id}`);

  return (
    <div className="container flex flex-col p-10 space-y-2 bg-primary rounded-md">
      <Post post_data={post_data} />
      <InteractPart post_id={post_data.id} emotes={post_data?.emotes} />
      <CommentPart post_id={post_data.id} post_user_id={post_data.user_id} />
    </div>
  );
};

export default PostDetail;
