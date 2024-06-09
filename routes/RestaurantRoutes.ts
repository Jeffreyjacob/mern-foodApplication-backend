import express from 'express';
import { param } from 'express-validator';
import Controller from '../controllers/restuarantController'

const router = express.Router();

router.get("/search/:city",
    param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("city parameter must be a valid string"),
    Controller.searchRestuarant
)


export default router