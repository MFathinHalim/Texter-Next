import { NextRequest, NextResponse } from "next/server";
import Posts from "@/Controllers/postControl"; // Import Posts controller
import Users from "@/Controllers/userControl";
import { headers } from "next/headers";

const postsInstance = Posts.getInstances(); // Singleton instance dari Posts
const userInstance = Users.getInstances(); // Singleton instance dari Users

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const headersList: any = await headers();
    const authHeader = headersList.get("authorization");
    const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

    if (!token) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // Check token validity (replace `checkAccessToken` with your actual function)
    const checkToken = await userInstance.checkAccessToken(token);
    if (!checkToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Extract the post ID from the route params
    const postId = params.id;
    if (!postId) return NextResponse.json({ error: "Post ID is required" }, { status: 400 });

    // Call the liking function from postsInstance
    //@ts-ignore
    const updatedPost = await postsInstance.liking(postId, checkToken);

    return NextResponse.json({ post: updatedPost, message: "Post liked successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error liking post:", error);
    return NextResponse.json({ error: "An error occurred while liking the post." }, { status: 500 });
  }
}
