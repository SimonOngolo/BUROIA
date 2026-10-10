import mongoose, { Schema, models } from "mongoose";
import { appRoles } from "@/lib/roles";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
    role: { type: String, enum: appRoles, default: "CUSTOMER", required: true },
    tenantId: { type: String, required: true, index: true },
    isActive: { type: Boolean, default: true, required: true },
  },
  {
    timestamps: true,
  }
);

const User = models.User || mongoose.model("User", UserSchema);

export default User;
