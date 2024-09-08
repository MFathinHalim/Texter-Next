// app/api/get/top/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Users from '@/Controllers/userControl'; // Update the path as needed

// Assuming userControl has a singleton instance method
const userInstance = Users.getInstances();

export async function GET(req: NextRequest) {
  try {
    // Fetch the top users by followers
    const users = await userInstance.getTopUsersByFollowers();
    
    // Return the users as JSON response
    return NextResponse.json({ users: users });
  } catch (error) {
    console.error("Error fetching top users:", error);
    
    // Return an error response
    return NextResponse.json({ error: "Failed to fetch top users" }, { status: 500 });
  }
}
