'use client';
import { Input } from '@/components/ui/input';
import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { fetchAPI } from '@/lib/api';
import { PostType, UserType } from '@/type/type';
import Post from '@/components/post';
import User from '@/components/user';
import InteractPart from '@/components/interact';
import Link from 'next/link';

const SearchPage = () => {
  const [type, setType] = useState('');
  const [submit, setSubmit] = useState(false);
  const [input, setInput] = useState('');
  const [searchResult, setSearchResult] = useState<{ post: []; user: [] }>();

  useEffect(() => {
    if (!submit) return;
    async function fetchDataSearch() {
      const data = await fetchAPI(`/search?type=${type}`, 'POST', { data: input });
      setSearchResult(data);
      setSubmit(false);
    }
    fetchDataSearch();
  }, [submit]);

  useEffect(() => {
    setSearchResult(undefined);
  }, [type]);

  return (
    <div className="container flex flex-col py-5 px-10 space-y-2 bg-primary rounded-md">
      <header className="font-extrabold text-3xl">Search</header>
      <div className="flex items-center gap-2">
        <Input
          type="search"
          className="rounded-full"
          placeholder="Search..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <Button variant={'ghost'} className="rounded-full" onClick={() => setSubmit(true)}>
          <Search />
        </Button>
      </div>

      <div className="slection-group flex gap-2 items-center">
        <div
          className={cn(
            'w-18 rounded-full border-2 text-center p-1 cursor-pointer',
            type === '' ? 'bg-secondary text-secondary-foreground' : ''
          )}
          onClick={() => {
            setType('');
          }}
        >
          All
        </div>
        <div
          className={cn(
            'w-18 rounded-full border-2 text-center p-1 cursor-pointer',
            type === 'post' ? 'bg-secondary text-secondary-foreground' : ''
          )}
          onClick={() => {
            setType('post');
          }}
        >
          Post
        </div>
        <div
          className={cn(
            'w-18 rounded-full border-2 text-center p-1 cursor-pointer',
            type === 'people' ? 'bg-secondary text-secondary-foreground' : ''
          )}
          onClick={() => {
            setType('people');
          }}
        >
          People
        </div>
      </div>

      <p>Result</p>
      {searchResult?.user &&
        searchResult.user.map((user: UserType) => <User key={user.id} user_data={user} />)}
      {searchResult?.post &&
        searchResult.post.map((post: PostType) => (
          <div key={post.id} className="bg-muted/20 p-5 rounded-md">
            <Post post_data={post} />
            <InteractPart post_id={post.id} emotes={post?.emotes} />
            {/* <CommentPart post_id={post_data.id} post_user_id={post_data.user_id}/> */}
            <Link
              className="space-y-2 text-sm text-primary-foreground/70 hover:text-primary-foreground"
              href={`/post/${post.id}`}
            >
              View all comments...
            </Link>
          </div>
        ))}
    </div>
  );
};

export default SearchPage;
