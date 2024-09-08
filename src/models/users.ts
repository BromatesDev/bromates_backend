import { Document, Model, Schema, model } from "mongoose";

// Define the interface for the user document
interface UserDocument extends Document {
  email: string;
  name: string;
  username: string;
  password: string;
  roles: ("student" | "landlord" | "tenant" | "admin")[];
  firstLogin: boolean;  // Add this line
}

// Create the schema for the user
const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      enum: ["student", "landlord", "tenant", "admin"],
      default: ["student"],
    },
    firstLogin: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
const UserModel = model<UserDocument>("User", userSchema);
export default UserModel;
