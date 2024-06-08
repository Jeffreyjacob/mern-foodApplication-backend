import express from "express";
import Controller from '../controllers/auth'
import authMiddleware from "../middleware/authMiddleware";

const authRouter = express.Router()

authRouter.route('/').post(authMiddleware,Controller.CreateUser)

export default authRouter;

