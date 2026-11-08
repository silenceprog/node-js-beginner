import { Schema, model } from "mongoose";
import { TAGS } from "../constants/tags.js";

const noteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      require: true,
      trim: true,
    },
    content: {
      type: String,
      require: false,
      trim: true,
    },
    tag: {
      type: String,
      enum: TAGS,
      require: false,
      default: "Todo",
    },
  },
  { timestamps: true },
);

noteSchema.index({ tag: 1 });

export const Note = model("Note", noteSchema);
