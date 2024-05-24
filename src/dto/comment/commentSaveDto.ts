import {Author} from "../author/author";

export class CommentSaveDto {

  text?: string;
  author?: Author;
  photoId?: string;

  constructor(data: Partial<CommentSaveDto>) {
    this.text = data.text;
    this.author = data.author;
    this.photoId = data.photoId;
  }
}
