import {z} from "zod"


export const restaurantFromSchema = z.object({
    restaurantName: z.string().nonempty({message: "Restaurant name is required"}),
    city: z.string().nonempty({message:"City name is required"}),
    state: z.string().nonempty({message:"State name is required"}),
    deliveryTime: z.number().min(0,{message:"Delivery time can not be negative"}),
    cuisines:z.array(z.string()),
    imageRestaurant: z.instanceof(File).optional().refine((file)=>file?.size !==0,{message: " Restaurant Image file is required"})
});

export type RestaurantFromSchema = z.infer<typeof restaurantFromSchema>