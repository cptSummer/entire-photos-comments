import {CommentSaveDto} from "../../dto/comment/commentSaveDto";
import Comment, {IComment} from "../../model/comment";
import {CommentDetailsDto} from "../../dto/comment/commentDetailsDto";
import axios from 'axios';

export const createComment = async (
  commentDto: CommentSaveDto
): Promise<string> => {
  await validateComment(commentDto);

  const comment = await new Comment(commentDto).save();
  return comment._id;
};

export const getCommentsByPhotoIdSortedByDate = async (
  photoId: number,
  size: number,
  from: number
): Promise<CommentDetailsDto[] | null> => {
  const comments = await Comment
    .find({photoId})
    .sort({createdAt: -1})
    .skip(from)
    .limit(size);
  return comments ? toDetailsDtoList(comments) : null;
};

const toDetailsDtoList = (comments: IComment[]): CommentDetailsDto[] => {
  return comments.map(comment => toDetailsDto(comment));
};

const toDetailsDto = (comment: IComment): CommentDetailsDto => {
  return {
    _id: comment._id,
    text: comment.text,
    createdAt: comment.createdAt,
    author: comment.author,
    photoId: comment.photoId,
  };
};

export const getAllCommentsCountWithPhotoId = async (
  photoIds: number[]
) => {
  const result = await Comment.aggregate([
    {$match: {photoId: {$in: photoIds}}},
    {
      $group: {
        _id: '$photoId',
        count: {$sum: 1},
      },
    },
    {
      $project: {
        _id: 0,
        photoId: '$_id',
        count: 1,
      },
    },
  ]);

  return photoIds.reduce((acc, id) => {
    acc[id] = result.find(r => r.photoId === id)?.count || 0;
    return acc;
  }, {} as Record<number, number>);
};

export const validateComment = async (commentDto: CommentSaveDto) => {
  if (!commentDto.text || !commentDto.author || !commentDto.photoId) {
    throw new Error('Missing mandatory fields');
  }

  const photoExists = await checkPhotoExists(commentDto.photoId);
  if (!photoExists) {
    throw new Error('No corresponding Photo object found');
  }
};

const checkPhotoExists = async (photoId: number): Promise<boolean> => {

  const photoUrl = `http://localhost:8080/api/photos/${photoId}`;
  const response = await axios.get(photoUrl);
  return response.data !== '';
};
