import {Author} from "../author/author";

export interface CommentDetailsDto {
  _id: string,
  text: string,
  createdAt: number,
  author: Author,
  photoId: number
}
