import {CommentSaveDto} from "../../dto/comment/commentSaveDto";
import Comment, {IComment} from "../../model/comment";
import {CommentDetailsDto} from "../../dto/comment/commentDetailsDto";
import axios from 'axios';

/**
 * Creates a new comment in the database.
 *
 * @param commentDto - The data for the comment to be created.
 * @returns A Promise that resolves to the ID of the newly created comment.
 * @throws An error if the comment data is invalid or the creation fails.
 */
export const createComment = async (
  commentDto: CommentSaveDto
): Promise<string> => {
  await validateComment(commentDto);

  const comment = await new Comment(commentDto).save();
  return comment._id;
};

/**
 * Retrieves comments for a specific photo sorted by date.
 *
 * @param photoId - The ID of the photo to retrieve comments for.
 * @param size - The maximum number of comments to retrieve.
 * @param from - The number of comments to skip before starting to retrieve.
 * @returns A Promise that resolves to an array of CommentDetailsDto or null if no comments were found.
 */
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

/**
 * Converts an array of IComment objects to an array of CommentDetailsDto objects.
 * @param comments - The array of IComment objects to convert.
 * @returns An array of CommentDetailsDto objects.
 */
const toDetailsDtoList = (comments: IComment[]): CommentDetailsDto[] => {
  return comments.map(comment => toDetailsDto(comment));
};

/**
 * Converts an IComment object to a CommentDetailsDto object.
 * @param comment - The IComment object to convert.
 * @returns A CommentDetailsDto object.
 */
const toDetailsDto = (comment: IComment): CommentDetailsDto => {
  return {
    _id: comment._id,
    text: comment.text,
    createdAt: comment.createdAt,
    author: comment.author,
    photoId: comment.photoId,
  };
};

/**
 * Retrieves the count of comments for each photo ID in the given array.
 *
 * @param photoIds - An array of photo IDs.
 * @returns An object with photo IDs as keys and the count of comments as values.
 */
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
    acc[id] =  Array.from(result).find(r => r.photoId === id)?.count || 0;
    return acc;
  }, {} as Record<number, number>);
};

/**
 * Validates a comment by checking if it contains all the necessary fields.
 * It also checks if the photo referenced by the comment exists.
 *
 * @param commentDto - The comment data transfer object to validate.
 * @throws {Error} If the commentDto is missing any of the mandatory fields or if the corresponding photo does not exist.
 */
export const validateComment = async (commentDto: CommentSaveDto) => {
  if (!commentDto.text || !commentDto.author || !commentDto.photoId) {
    throw new Error('Missing mandatory fields');
  }

  const photoExists = await checkPhotoExists(commentDto.photoId);
  if (!photoExists) {
    throw new Error('No corresponding Photo object found');
  }
};

/**
 * Checks if a photo with the given ID exists.
 *
 * @param photoId - The ID of the photo to check.
 * @returns {Promise<boolean>} A Promise that resolves to true if the photo exists, false otherwise.
 */
const checkPhotoExists = async (photoId: number): Promise<boolean> => {
  const photoUrl = `http://localhost:8080/api/photos/${photoId}`;
  const response = await axios.get(photoUrl);
  return response.data !== '';
};


