import CommentPart from '@/components/comment';
import InteractPart from '@/components/interact';
import Post from '@/components/post';
import { fetchAPI } from '@/lib/api';
import { notFound } from 'next/navigation';
import React from 'react';

const PostDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
  let post_data = null;
  const {id} = await params

  try {
    post_data = await fetchAPI(`/post/detail/${id}`);
  } catch (error) {
    notFound(); // chuyển sang trang 404
  }

  if (!post_data) {
    notFound();
  }

  return (
    <div className="container flex flex-col p-10 space-y-2 bg-primary rounded-md">
      <Post post_data={post_data} />
      <InteractPart post_id={post_data.id} emotes={post_data?.emotes} />
      <CommentPart post_id={post_data.id} post_user_id={post_data.user_id} />
    </div>
  );
};

export default PostDetail;
