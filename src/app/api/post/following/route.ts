import { NextRequest, NextResponse } from "next/server";
import Posts from "@/Controllers/postControl";
import Users from "@/Controllers/userControl";
import { headers } from "next/headers";

/**
 * @param {NextRequest} req
 */
const postsInstance = Posts.getInstances(); // Assuming `Posts.getInstances` returns a singleton instance
const userInstance = Users.getInstances();
export async function GET(req: NextRequest) {
  const headersList = headers();
  const authHeader = headersList.get("authorization");
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from Bearer
  // Check if token exists
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url || "", "http://localhost"); // Create URL object for query parsing
  const page: number = parseInt(url.searchParams.get("page") || "1", 10);
  const limit: number = 5; // Default limit
  try {
    const checkToken = await userInstance.checkAccessToken(token);
    //@ts-ignore
    const userFollowing = await userInstance.checkWhatUserFollowing(checkToken.id);

    // Fetch posts data
    const posts: any= await postsInstance.getDataByFollowedUsers(userFollowing, page, limit);
    return NextResponse.json({ posts: posts.posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "An error occurred while fetching posts." }, { status: 500 });
  }
}
