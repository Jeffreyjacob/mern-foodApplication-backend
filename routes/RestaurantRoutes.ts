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
router.get("/:id",param("id")
.isString()
.trim()
.notEmpty()
.withMessage("id paramenter must be a valid string"),
Controller.getRestuarant
)



export default router