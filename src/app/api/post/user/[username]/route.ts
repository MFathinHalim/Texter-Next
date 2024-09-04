import { NextRequest, NextResponse } from 'next/server';
import Posts from '@/Controllers/postControl'; // Update with actual import
import Users from '@/Controllers/userControl';

const postsClass = Posts.getInstances();
const userClass = Users.getInstances();

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  const { username } = params;
  const url = new URL(req.url);
  const page: number = parseInt(url.searchParams.get("page") || "1", 10);
  const limit: number = 5; // Default limit
  const myname = url.searchParams.get('search') || '';


  try {
    const user: userType | any = await userClass.checkUserDetails(username, myname?.toString() || "");
    const posts = await postsClass.getData("", page, limit, user.user._id);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
