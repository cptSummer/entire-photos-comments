import mongoose, { Document, Schema } from 'mongoose';
import {Author} from "../dto/author/author";

export interface IComment extends Document {
    text: string;
    createdAt: Date;
    author: Author;
    photoId: number;
}

const commentSchema = new Schema({
  author: {
    required: true,
    type: Object,
  },

  text: {
    required: true,
    type: String,
  },

  photoId: {
    required: true,
    type: Number,
  },
},
{
  /**
       * The timestamps option tells mongoose to assign createdAt and updatedAt
       * fields to your schema. The type assigned is Date.
       */
  timestamps: true,
  timezone: 'UTC',
},);

const Comment = mongoose.model<IComment>('comment', commentSchema);

export default Comment;
