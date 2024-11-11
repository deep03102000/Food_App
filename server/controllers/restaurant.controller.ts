import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { Multer } from "multer";
import uploadImageOnCloudinary from "../utils/imageUpload";
import { Order } from "../models/order.model";
import mongoose from "mongoose";
export const createRestaurant = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { restaurantName, city, state, deliveryTime, cuisines } = req.body;
    const file = req.file;
    const restaurant = await Restaurant.findOne({ user: req.id });
    if (restaurant) {
      res.status(400).json({
        success: false,
        message: "Restaurant already exists for this user",
      });
    }
    if (!file) {
      res.status(400).json({
        success: false,
        message: " Image is required",
      });
    }
    const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);

    await Restaurant.create({
      user: req.id,
      restaurantName,
      city,
      state,
      deliveryTime,
      cuisines: JSON.parse(cuisines),
      imageUrl,
    });
    return res.status(201).json({
      success: true,
      message: "Restaurant Added Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Create Restaurant Internal Server Error",
    });
  }
};

export const getRestaurant = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.id }).populate(
      "menus"
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        restaurant: [],
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,
      restaurant, // Using "restaurant" directly in response
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateRestaurant = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { restaurantName, city, state, deliveryTime, cuisines } = req.body;
    const file = req.file;
    const restaurant = await Restaurant.findOne({ user: req.id });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant Not Found",
      });
    }
    restaurant.restaurantName = restaurantName;
    restaurant.city = city;
    restaurant.state = state;
    restaurant.deliveryTime = deliveryTime;
    restaurant.cuisines = JSON.parse(cuisines);

    if (file) {
      const imageUrl = await uploadImageOnCloudinary(
        file as Express.Multer.File
      );
      restaurant.imageUrl = imageUrl;
    }
    await restaurant.save();

    return res.status(200).json({
      success: true,
      message: "Restaurant Updated Successfully",
      restaurant,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Update Restaurant Internal Server Error",
    });
  }
};

export const getRestaurantOrder = async (req: Request, res: Response): Promise<any> => {
  try {
      const restaurant = await Restaurant.findOne({ user: req.id });
      if (!restaurant) {
          return res.status(404).json({
              success: false,
              message: "Restaurant not found"
          })
      };
      const orders = await Order.find({ restaurant: restaurant._id }).populate('restaurant').populate('user');
      return res.status(200).json({
          success: true,
          orders
      });
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" })
  }
}

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }
    order.status = status;
    await order.save();
    return res.status(200).json({
      success: true,
      status: order.status,
      message: "Order Status Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Update Order Status Internal Server Error",
    });
  }
};

export const searchRestaurant = async (req: Request, res: Response): Promise<any> => {
  try {
      const searchText = req.params.searchText || "";
      const searchQuery = req.query.searchQuery as string || "";
      const selectedCuisines = (req.query.selectedCuisines as string || "").split(",").filter(cuisine => cuisine);
      const query: any = {};
      // basic search based on searchText (name ,city)
      console.log(selectedCuisines);
      
      if (searchText) {
          query.$or = [
              { restaurantName: { $regex: searchText, $options: 'i' } },
              { city: { $regex: searchText, $options: 'i' } },
              { state: { $regex: searchText, $options: 'i' } },
          ]
      }
      // filter on the basis of searchQuery
      if (searchQuery) {
          query.$or = [
              { restaurantName: { $regex: searchQuery, $options: 'i' } },
              { cuisines: { $regex: searchQuery, $options: 'i' } }
          ]
      }
      // console.log(query);
     
      if(selectedCuisines.length > 0){
          query.cuisines = {$in:selectedCuisines}
      }
      
      const restaurants = await Restaurant.find(query);
      return res.status(200).json({
          success:true,
          data:restaurants
      });
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" })
  }
}

export const getSingleRestaurant = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const restaurantId = req.params.id;

    console.log("Received restaurantId:", restaurantId); // Log the received ID

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      console.log("Invalid Restaurant ID format"); // Log invalid ID
      return res.status(400).json({
        success: false,
        message: "Invalid Restaurant ID format",
      });
    }

    const restaurant = await Restaurant.findById(restaurantId).populate({
      path: "menus",
      options: { sort: { createdAt: -1 } },
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      restaurant,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Get Single Restaurant Internal Server Error",
    });
  }
};
