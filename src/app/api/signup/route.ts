import Users from "@/Controllers/userControl";
import { NextRequest } from "next/server";

const userInstance = Users.getInstances();
/**
 * @param {NextRequest} req
 */
export async function POST(req:NextRequest) {
    const body = await req.json();
    const {nama, username, password} = body
    await userInstance.signUp(nama, username, password, "");
    return Response.redirect("/login")
}