import { NextRequest, NextResponse } from "next/server";
import Posts from "@/Controllers/postControl"; // Ganti dengan jalur yang sesuai ke PostsClass

/**
 * @param {NextRequest} req
 */
const PostsClass = Posts.getInstances()
export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
  const { postId } = params;
  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const page = parseInt(url.searchParams.get("page") || "1", 10);

  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
  }

  try {
    const { replies, totalPages } = await PostsClass.getReplies(postId, page);
    console.log(replies)

    return NextResponse.json({ replies, totalPages, searchTerm: search });
  } catch (error) {
    console.error("Error fetching replies:", error);
    return NextResponse.json({ error: "Failed to fetch replies" }, { status: 500 });
  }
}
