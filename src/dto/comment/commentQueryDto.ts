import {QueryDto} from "../queryDto";

export class CommentQueryDto extends QueryDto {
  text?: string;
  photoId?: number;

  constructor(query?: Partial<CommentQueryDto>) {
    super();
    if (query) {
      this.text = query.text;
      this.photoId = query.photoId;
      this.skip = query.skip || 0;
      this.limit = query.limit || 10;
    }
  }
}
