import express from 'express'
import multer from 'multer';
import  Controller from '../controllers/restuarant';
import authMiddleware, { jwtParse } from '../middleware/authMiddleware';
import { validateMyRestuarantRequest } from '../middleware/Validation';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage:storage,
    limits:{
        fileSize: 5 * 1024 * 1024 //5mb
    }
})

router.route('/').post(
    upload.single("imageFile"),
    validateMyRestuarantRequest,
    authMiddleware,
    jwtParse,
    Controller.createRestuarant)
router.route('/').get(authMiddleware,jwtParse,Controller.GetRestuarant)
router.route('/').put(  upload.single("imageFile"),
validateMyRestuarantRequest,
authMiddleware,
jwtParse,
Controller.UpdateRestuarant
)

export default router;