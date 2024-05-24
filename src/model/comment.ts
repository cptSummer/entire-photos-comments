import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    authorId: number;
    content: string;
    createdAt: Date;
    photoId: number;
}

const commentSchema = new Schema({
  authorId: {
    required: true,
    type: Number,
  },

  content: {
    required: true,
    type: String,
  },

  createdAt: {
    required: true,
    type: Date,
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

const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;
