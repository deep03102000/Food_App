import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { Order } from "../models/order.model";
import Stripe from "stripe";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type CheckoutSessionRequest = {
  cartItems: {
    menuId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  deliveryDetails: {
    name: string;
    email: string;
    address: string;
    city: string;
  };
  restaurantId: string;
};

// Controller to get all orders for a specific user
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch orders for the user, populating 'user' and 'restaurant' fields
    const orders = await Order.find({ user: req.id })
      .populate("user")
      .populate("restaurant");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Get order Internal Server Error",
    });
  }
};

// Controller to create a Stripe checkout session and an order
export const createCheckoutSession = async (req: Request, res: Response): Promise<any> => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;

    // Find restaurant by ID and populate 'menus' field
    const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId).populate('menus');
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found."
      });
    }

    // Calculate total amount for the order by summing up (price * quantity) for each cart item
    const totalAmount = checkoutSessionRequest.cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    // Create a new order instance
    const order: any = new Order({
      restaurant: restaurant._id,
      user: req.id,
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      status: "pending",
      totalAmount // Add totalAmount to order
    });

    // Prepare line items for the Stripe checkout session
    const menuItems = restaurant.menus;
    const lineItems = createLineItems(checkoutSessionRequest, menuItems);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: ['GB', 'US', 'CA' ]
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/order/status`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        orderId: order._id.toString(),
        images: JSON.stringify(menuItems.map((item: any) => item.image))
      }
    });

    // Check if session was created successfully
    if (!session.url) {
      return res.status(400).json({ success: false, message: "Error while creating session" });
    }

    // Save the order to the database
    await order.save();

    // Send session URL in response
    return res.status(200).json({
      session
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const stripeWebhook = async (req: Request, res: Response): Promise<any> => {
  let event;

  try {
      const signature = req.headers["stripe-signature"];

      // Construct the payload string for verification
      const payloadString = JSON.stringify(req.body, null, 2);
      const secret = process.env.WEBHOOK_ENDPOINT_SECRET!;

      // Generate test header string for event construction
      const header = stripe.webhooks.generateTestHeaderString({
          payload: payloadString,
          secret,
      });

      // Construct the event using the payload string and header
      event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error: any) {
      console.error('Webhook error:', error.message);
      return res.status(400).send(`Webhook error: ${error.message}`);
  }

  // Handle the checkout session completed event
  if (event.type === "checkout.session.completed") {
      try {
          const session = event.data.object as Stripe.Checkout.Session;
          const order = await Order.findById(session.metadata?.orderId);

          if (!order) {
              return res.status(404).json({ message: "Order not found" });
          }

          // Update the order with the amount and status
          if (session.amount_total) {
              order.totalAmount = session.amount_total;
          }
          order.status = "confirmed";

          await order.save();
      } catch (error) {
          console.error('Error handling event:', error);
          return res.status(500).json({ message: "Internal Server Error" });
      }
  }
  // Send a 200 response to acknowledge receipt of the event
  res.status(200).send();
};

// Function to create line items for Stripe checkout session based on cart items and restaurant menu items
export const createLineItems = (checkoutSessionRequest: CheckoutSessionRequest, menuItems: any) => {
  // Map cart items to line items format required by Stripe
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find((item: any) => item._id.toString() === cartItem.menuId);
    if (!menuItem) throw new Error(`Menu item id not found`);

    return {
      price_data: {
        currency: 'inr',
        product_data: {
          name: menuItem.name,
          images: [menuItem.image],
        },
        unit_amount: menuItem.price * 100 // Amount in cents/paisa
      },
      quantity: cartItem.quantity,
    };
  });

  // Return line items array for Stripe session
  return lineItems;
};
