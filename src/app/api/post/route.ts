import { NextRequest, NextResponse } from "next/server";
import Posts from "@/Controllers/postControl";

/**
 * @param {NextRequest} req
 */
const postsInstance = Posts.getInstances(); // Assuming `Posts.getInstances` returns a singleton instance

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters with fallback defaults
    const url = new URL(req.url || "", "http://localhost"); // Create URL object for query parsing
    const page: number = parseInt(url.searchParams.get("page") || "1", 10);
    const limit: number = 5; // Default limit
    const search: string = url.searchParams.get("search") || "";

    // Fetch posts data
    const posts = await postsInstance.getData("", page, limit, undefined, search);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "An error occurred while fetching posts." }, { status: 500 });
  }
}
