import { NextRequest, NextResponse } from 'next/server';
import Users from '@/Controllers/userControl';

const userClass = Users.getInstances();

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  const { username } = params;
  const myname = req.nextUrl.searchParams.get('myname') || "";

  try {
    const user = await userClass.checkUserDetails(username, myname);
    if (user) {
      return NextResponse.json({
        user,
        searchTerm: ""
      });
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
