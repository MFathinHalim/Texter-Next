import { NextRequest, NextResponse } from 'next/server';
import Users from '@/Controllers/userControl';
import { headers } from 'next/headers';

const userClass = Users.getInstances();

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  const { username } = params;
  // Extract headers
  const url = new URL(req.url || "", "http://localhost"); // Create URL object for query parsing
  const myname: string = url.searchParams.get("myname") || "";
  const isFollowing: boolean | userType = await userClass.checkFollow(username, myname?.toString() || "");
  return NextResponse.json({ isFollowing });

}
