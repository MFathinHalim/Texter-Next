// pages/api/get/followers.ts

import { NextRequest, NextResponse } from "next/server";
import Users from "@/Controllers/userControl"; // Sesuaikan dengan jalur yang benar
import { headers } from "next/headers";

// Singleton Instances (Assuming singleton pattern)
const userInstance = Users.getInstances();

/**
 * @param {NextRequest} req
 */
export async function GET(req: NextRequest) {
  const headersList = headers();
  const authHeader = headersList.get("authorization");
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from Bearer

  // Check if token exists
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse query parameters
  const url = new URL(req.url || "", "http://localhost"); // Create URL object for query parsing
  const search: string = url.searchParams.get("search") || "";

  try {
    // Check token validity
    const checkToken = await userInstance.checkAccessToken(token);

    //@ts-ignore
    const userFollowers = await userInstance.getFollowersDetails(checkToken.id);

    return NextResponse.json({ users: userFollowers, searchTerm: search });
  } catch (error) {
    console.error("Error fetching followers:", error);
    return NextResponse.json({ error: "Failed to fetch followers" }, { status: 500 });
  }
}
