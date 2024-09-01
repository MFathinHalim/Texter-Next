import { Model, Schema, model, Types } from "mongoose";

const userSchema: Schema<userType> = new Schema<userType>({
  id: String,
  name: String,
  username: String,
  desc: String,
  password: String,
  pp: String,
  ban: Boolean,
  isAdmin: Boolean,
  followers: [{ type: Types.ObjectId, ref: "users" }],
  following: [{ type: Types.ObjectId, ref: "users" }],
  bookmark: [{ type: Types.ObjectId, ref: "posts" }],
  notification: {
    messages: { type: [{ message: String, link: String }], default: [] },
    read: { type: Boolean, default: false },
  },
});

const userModel: Model<userType> = model("users", userSchema);
export { userModel, userSchema };
