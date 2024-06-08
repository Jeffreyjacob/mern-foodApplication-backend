import express from 'express';
import {updateUser,getUser} from '../controllers/user'
import  authMiddleware, { jwtParse } from '../middleware/authMiddleware';
import { validateMyUserRequest } from '../middleware/Validation';

const router = express.Router()

router.route('/').put(authMiddleware,jwtParse,validateMyUserRequest,updateUser)
router.route('/').get(authMiddleware,jwtParse,getUser)

export default router;