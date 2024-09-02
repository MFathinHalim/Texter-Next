// app/api/posts/[postId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Posts from '@/Controllers/postControl'; // Adjust the import path as needed

// Create a singleton instance of your Posts controller
const postsInstance = Posts.getInstances(); // Ensure this method returns the singleton instance

export async function GET(req: NextRequest) {
  try {
    // Extract postId from the URL path
    const url = new URL(req.url);
    const postId = url.pathname.split('/').pop(); // Extract postId from the URL path
    if (!postId) {
      return NextResponse.json({ error: 'postId is required.' }, { status: 400 });
    }

    // Fetch post data from your Posts controller
    const posts = await postsInstance.getData(postId, 0, 0); // Adjust method call as necessary
    //@ts-ignore
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching post data:', error);
    return NextResponse.json({ error: 'An error occurred while fetching the post.' }, { status: 500 });
  }
}
