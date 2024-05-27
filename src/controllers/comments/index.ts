import log4js from 'log4js';
import httpStatus from 'http-status';
import {Request, Response} from 'express';
import {
  createComment as createCommentApi,
  getCommentsByPhotoIdSortedByDate as getCommentsApi,
  getAllCommentsCountWithPhotoId as getCommentsCountApi,
} from 'src/services/comment';
import {CommentSaveDto} from 'src/dto/comment/commentSaveDto';
import {InternalError} from 'src/system/internalError';
import {CommentQueryDto} from "../../dto/comment/commentQueryDto";


export const addComment = async (req: Request, res: Response) => {
  const comment = new CommentSaveDto(req.body);
  try {
    const id = await createCommentApi({
      ...comment,
    });
    res.status(httpStatus.CREATED).send({
      id,
    });
  } catch (err) {
    const {message, status} = new InternalError(err);
    log4js.getLogger().error(`Error in creating comment.`, err);
    res.status(status).send({message});
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const query = new CommentQueryDto(req.body);

    if (!query.photoId) {
      res.status(httpStatus.BAD_REQUEST).send();
      return;
    }
    const result = await getCommentsApi(query.photoId, query.size, query.from);
    res.send({
      result,
    });
  } catch (err) {
    const {message, status} = new InternalError(err);
    log4js.getLogger().error(`Error in retrieving comments.`, err);
    res.status(status).send({message});
  }
};

export const getCommentsCount = async (req: Request, res: Response) => {
  try {
    const photoIds: number[] = Array.isArray(JSON.parse(req.body.photoIds)) ? JSON.parse(req.body.photoIds) : [JSON.parse(req.body.photoIds)];
    const result = await getCommentsCountApi(photoIds);
    res.send({
      result,
    });
  } catch (err) {
    const {message, status} = new InternalError(err);
    log4js.getLogger().error(`Error in retrieving comments count.`, err);
    res.status(status).send({message});
  }
};
