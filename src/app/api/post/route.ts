import { NextRequest, NextResponse } from "next/server";
import Posts from "@/Controllers/postControl"; // Import Posts controller
import { headers } from "next/headers";
import Users from "@/Controllers/userControl";
import imagekit from "@/utils/imagekit";

const postsInstance = Posts.getInstances(); // Singleton instance dari Posts
const userInstance = Users.getInstances(); // Singleton instance dari Posts

// GET Function: Fetch posts based on query parameters
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url || "", "http://localhost"); // Create URL object to parse query
    const page: number = parseInt(url.searchParams.get("page") || "1", 10);
    const limit: number = 5; // Default limit
    const search: string = url.searchParams.get("search") || "";

    // Fetch posts with pagination and search filter
    const posts = await postsInstance.getData("", page, limit, undefined, search);
    //@ts-ignore
    return NextResponse.json({ posts: posts.posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "An error occurred while fetching posts." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData(); // Parse form data

    const headersList: any = await headers();
    const authHeader = headersList.get("authorization");
    const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
    if (!token) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // Check token validity (replace `checkAccessToken` with your actual function)
    const checkToken = await userInstance.checkAccessToken(token);
    if (!checkToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Construct the post object from form data
    const postDetails = {
      title: formData.get("title") as string,
      pembuat: formData.get("pembuat") as string,
      link: formData.get("link") as string,
      content: formData.get("content") as string,
    };

    const file = formData.get("image") as File | null; // Handle image file
    let imageLink = ""
    // Process image file if present
    if (file) {
      const buffer = await file.arrayBuffer();
      console.log(file)

      // Upload the image to ImageKit (example logic)
      const id = `${postDetails.title}-texter`;

      const uploadResult = await imagekit.upload({
        file: Buffer.from(buffer), // Upload buffer
        fileName: `image-${id}.jpg`,
        useUniqueFileName: false,
        folder: "Texter", // Define your folder structure
      });
      imageLink = uploadResult.url;

      if (!uploadResult || !uploadResult.url) {
        throw new Error("Image upload failed");
      }
    }
    const newPost = await postsInstance.posting(postDetails, checkToken, imageLink);
    
    return NextResponse.json({ post: newPost, message: "Post created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "An error occurred while creating the post." }, { status: 500 });
  }
}
