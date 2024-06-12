import express from 'express';
import authMiddleware, { jwtParse } from '../middleware/authMiddleware';
import Controller from '../controllers/orderController'

const router = express.Router();


router.post("/checkout/create-checkout-session",
    authMiddleware,
    jwtParse,
    Controller.createCheckoutSession
);
router.post("/checkout/webhook",Controller.stripeWebhookHandler)

export default router