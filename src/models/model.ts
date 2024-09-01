import { Model, Schema, Types, model, models } from "mongoose";

// Define your schemas and models
const postSchema = new Schema<postType>({
  id: String,
  title: String,
  time: String,
  user: { type: Types.ObjectId, ref: "User" }, // Ensure the reference name matches your model name
  like: {
    users: [{ type: Types.ObjectId, ref: "User", default: [] }], // Changed default to [] to be more appropriate
  },
  replyTo: String,
  img: String,
  repost: { type: Types.ObjectId, ref: "User", default: undefined },
  ogId: String,
  reQuote: { type: Types.ObjectId, ref: "Post", default: undefined }, // Changed ref to "Post" for consistency
});

const userSchema = new Schema<userType>({
  id: String,
  name: String,
  username: String,
  desc: String,
  password: String,
  pp: String,
  ban: Boolean,
  isAdmin: Boolean,
  followers: [{ type: Types.ObjectId, ref: "User" }],
  following: [{ type: Types.ObjectId, ref: "User" }],
  bookmark: [{ type: Types.ObjectId, ref: "Post" }], // Changed ref to "Post" for consistency
  notification: {
    messages: [{ message: String, link: String }], // Corrected type definition
    read: { type: Boolean, default: false },
  },
});

// Check if models are already defined
const userModel = models.User || model<userType>("User", userSchema);
const mainModel = models.Post || model<postType>("Post", postSchema);
const reportModel = models.ReportPost || model<postType>("ReportPost", postSchema);

export { userModel, mainModel, reportModel };
