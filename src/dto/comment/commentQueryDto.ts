import {QueryDto} from "../queryDto";

export class CommentQueryDto extends QueryDto {
  text?: string;
  photoId?: number;

  constructor(query?: Partial<CommentQueryDto>) {
    super();
    if (query) {
      this.text = query.text;
      this.photoId = query.photoId;
      this.from = query.from || 0;
      this.size = query.size || 10;
    }
  }
}
