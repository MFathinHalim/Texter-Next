import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Retrieve the 'refreshtoken' cookie
  const refreshToken = req.cookies.get('refreshtoken');
  if (!refreshToken?.value) {
    return NextResponse.json({ error: 'No refresh token found' }, { status: 401 });
  }

  // Use the refreshToken as needed
  // For example, verify the token or fetch user data

  return NextResponse.json({ message: 'Refresh token found', token: refreshToken.value });
}
