'use client';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import Post from '@/components/post';
import { PostType } from '@/type/type';

export default function LazyPost({ post_data }: { post_data: PostType }) {
  const { ref, inView } = useInView({
    triggerOnce: true, // chỉ load 1 lần khi vào viewport
    threshold: 0.1, // 10% hiển thị là render
  });

  return (
    <div ref={ref}>
      {inView ? (
        <Post post_data={post_data} />
      ) : (
        <div className="h-[300px] bg-gray-100 rounded animate-pulse" />
      )}
    </div>
  );
}
