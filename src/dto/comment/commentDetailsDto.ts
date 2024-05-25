import {Author} from "../author/author";

export interface CommentDetailsDto {
  _id: string,
  text: string,
  createdAt: Date,
  author: Author,
  photoId: number
}
