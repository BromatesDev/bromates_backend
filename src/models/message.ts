import { Document, Schema, model } from "mongoose";

// Define the interface for the message document
interface MessageDocument extends Document {
  sender: Schema.Types.ObjectId; // Reference to the User schema
  recipient: Schema.Types.ObjectId; // Reference to the User schema
  content: string;
  read: boolean;
  timestamp: Date;
}

// Create the schema for the message
const messageSchema = new Schema<MessageDocument>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
const MessageModel = model<MessageDocument>("Message", messageSchema);
export default MessageModel;
