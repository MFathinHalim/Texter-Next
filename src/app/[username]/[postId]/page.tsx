"use client";

import PostComponent from '@/components/Post';
import { useParams } from 'next/navigation';

export default function PostPage() {
  const params = useParams();
  const postId = params.postId as string;  // Ensure postId is treated as a string
  const username = params.username as string;  // Ensure username is treated as a string

  return (
    <>
      <PostComponent postId={postId} username={username} />
    </>
  );
}
