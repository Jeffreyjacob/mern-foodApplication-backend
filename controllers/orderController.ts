import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Stripe from "stripe";
import Restaurant, { MenuItemType } from "../model/restaurant";
import Order from "../model/order";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);

const FRONTEND_URL = process.env.FRONTEND_URL as string;

type CheckOutSessionRequest = {
    cartItems: {
        menuItemId: string;
        name: string;
        quantity: string;
    }[];
    deliveryDetails: {
        email: string;
        name: string;
        addressLine1: string;
        city: string
    },
    restaurantId: string
}

const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const checkoutSessionRequest: CheckOutSessionRequest = req.body
        const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId)
        if (!restaurant) {
            throw new Error("Restaurant not found")
        }

        const newOrder = new Order({
            restaurant: restaurant,
            user: req.userId,
            status: "placed",
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            cartItems: checkoutSessionRequest.cartItems,
            createdAt: new Date(),
        })

        const lineItem = createLineItems(checkoutSessionRequest, restaurant.menuItem)
        const session = await createSession(lineItem,
            newOrder._id.toString(),
            restaurant.deliveryPrice,
            restaurant._id.toString())
        if (!session.url) {
            return res.status(500).json({ message: "Error creating stipe session" })
        }
        await newOrder.save()
        res.json({ url: session.url })

    } catch (error: any) {
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.raw.message })
    }
}

const createLineItems = (checkoutSessionRequest: CheckOutSessionRequest, menuItem: MenuItemType[]) => {
    const lineitems = checkoutSessionRequest.cartItems.map((cartItem) => {
        const menuitem = menuItem.find((item) => item._id.toString() === cartItem.menuItemId.toString())
        if (!menuitem) {
            throw new Error(`Menu item not found: ${cartItem.menuItemId}`)
        }
        const line_Item: Stripe.Checkout.SessionCreateParams.LineItem = {
            price_data: {
                currency: "gbp",
                unit_amount: menuitem.price,
                product_data: {
                    name: menuitem.name
                },
            },
            quantity: parseInt(cartItem.quantity),
        };
        return line_Item;
    })
    return lineitems
}

const createSession = async (
    lineItem: Stripe.Checkout.SessionCreateParams.LineItem[],
    orderId: string,
    deliveryPrice: number,
    restaurantId: string
) => {
    const sessionData = await STRIPE.checkout.sessions.create({
        line_items: lineItem,
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: "Delivery",
                    type: "fixed_amount",
                    fixed_amount: {
                        amount: deliveryPrice,
                        currency: "gbp"
                    }
                }
            }
        ],
        mode: "payment",
        metadata: {
            orderId,
            restaurantId
        },
        success_url: `${FRONTEND_URL}/order-status?success=true`,
        cancel_url: `${FRONTEND_URL}/detailPage/${restaurantId}?cancelled=true`
    })
    return sessionData;
}


export default {
    createCheckoutSession
}
