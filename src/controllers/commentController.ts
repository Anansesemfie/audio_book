import commentService from "../services/commentService";
import errorHandler from "../utils/error";
import { Request, Response } from "express";

export const postComment = async (req: Request, res: Response) => {
  try {
    const { bookId, comment } = req.body;
    const sessionID = res.locals.sessionId;
    const newComment = await commentService.createComment({
      comment: comment,
      sessionID: sessionID,
      bookID: bookId,
    });
    res.status(201).json({data:newComment});
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const comments = await commentService.getComments(bookId);
    res.status(200).json({data:comments});
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};
