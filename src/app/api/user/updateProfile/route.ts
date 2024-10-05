import Users from "@/Controllers/userControl";
import { NextRequest, NextResponse } from "next/server";
import imagekit from "@/utils/imagekit"; // Assuming you have ImageKit initialized here
import { headers } from 'next/headers';

const userInstance = Users.getInstances();

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const headersList = headers();
  const authHeader = headersList.get('authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const checkToken = await userInstance.checkAccessToken(token);
  if (!checkToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  //@ts-ignore
  const userId = checkToken.id
  const userData = {
    id: userId,
    name: formData.get("name") as string,
    desc: formData.get("desc") as string,
    //@ts-ignore
    username: checkToken.username, 
  };
  console.log(userData)
  const file = formData.get("image") as File | null; // Image file (optional)

  try {
    let img = ""; // Initialize image URL

    // If there is a file, process and upload it
    if (file) {
      const buffer = await file.arrayBuffer(); // Convert File object to buffer

      // Upload image to ImageKit (replace with your upload logic)
      const uploadResult = await imagekit.upload({
        file: Buffer.from(buffer), // Uploading buffer data
        fileName: `pfp-${userId}.jpg`,
        useUniqueFileName: false,
        folder: "Txtr",
      });

      if (!uploadResult || !uploadResult.url) {
        throw new Error("Image upload failed");
      }

      // Append timestamp to avoid caching issues
      const currentEpochTime = Date.now();
      img = `${uploadResult.url}?updatedAt=${currentEpochTime}`;
    }

    await userInstance.editProfile(userData, img);

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
