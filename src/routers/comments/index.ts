import express from "express";
import {addComment, getComments, getCommentsCount} from "../../controllers/comments";

const router = express.Router();

router.post("", addComment);
router.get("", getComments);
router.post("/_counts", getCommentsCount);

export default router;
