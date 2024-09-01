import { NextResponse } from 'next/server';
import Users from '@/Controllers/userControl';
import { headers } from 'next/headers';

const userClass = Users.getInstances();

export async function GET() {
  // Extract headers
  const headersList = headers();
  const authHeader = headersList.get('authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer

  // Check if token exists
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify token and get user ID
    //@ts-ignore
    const id = userClass.checkAccessToken(token).id;

    // Check if ID is valid and not 'System'
    if (!id || id === 'System') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the user is banned
    const checkUser = await userClass.checkIsUserBan(id);

    // Respond with the check result and user data
    return NextResponse.json({
      check: checkUser.ban,
      user: checkUser,
    });
  } catch (error) {
    console.error('Error checking user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
