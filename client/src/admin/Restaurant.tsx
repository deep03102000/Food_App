import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { restaurantFromSchema, RestaurantFromSchema } from "@/schema/resturantSchema";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { Loader2 } from "lucide-react";
import React, { FormEvent, useEffect, useState } from "react";

const Restaurant = () => {
    const [input, setInput] = useState<RestaurantFromSchema>({
        restaurantName: "",
        city: "",
        state: "",
        deliveryTime: 0,
        cuisines: [],
        imageRestaurant: undefined
    });

    const [errors, setErrors] = useState<Partial<RestaurantFromSchema>>({});
    const { loading, restaurant, updateRestaurant, createRestaurant, getRestaurant } = useRestaurantStore();

    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setInput({ ...input, [name]: type === "number" ? Number(value) : value });
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = restaurantFromSchema.safeParse(input);
        if (!result.success) {
            const fieldError = result.error.formErrors.fieldErrors;
            setErrors(fieldError as Partial<RestaurantFromSchema>);
            return;
        }

        // API implementation starts here
        try {
            const formData = new FormData();
            formData.append("restaurantName", input.restaurantName);
            formData.append("city", input.city);
            formData.append("state", input.state);
            formData.append("deliveryTime", input.deliveryTime.toString());
            formData.append("cuisines", JSON.stringify(input.cuisines));

            if (input.imageRestaurant) {
                formData.append("imageRestaurant", input.imageRestaurant);
            }

            if (restaurant) {
                await updateRestaurant(formData);
            } else {
                await createRestaurant(formData);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                 await getRestaurant();
                  // Debugging line
                if (restaurant) {
                    setInput({
                        restaurantName: restaurant.restaurantName || "",
                        city: restaurant.city || "",
                        state: restaurant.state || "",
                        deliveryTime: restaurant.deliveryTime || 0,
                        cuisines: restaurant.cuisines ? restaurant.cuisines.map((cuisine: string) => cuisine) : [],
                        imageRestaurant: undefined,
                    });
                }
                
            } catch (error) {
                console.error("Error fetching restaurant data:", error);
            }
        };

        fetchRestaurant();
    }, []); // Include getRestaurant in dependencies

    return (
        <div className="max-w-6xl mx-auto my-10">
            <h1 className="font-extrabold text-2xl mb-5">
                {restaurant? 'Update Restaurant': 'Add Restaurant'}
                </h1>
            <form onSubmit={submitHandler}>
                <div className="md:grid grid-cols-2 space-y-2 gap-6 md:space-y-0">
                    <div>
                        <Label>Restaurant</Label>
                        <Input
                            type="text"
                            name="restaurantName"
                            value={input.restaurantName}
                            onChange={changeEventHandler}
                            placeholder="Enter your restaurant name" />
                        {errors.restaurantName && <span className="text-sm text-red-500 font-medium">{errors.restaurantName}</span>}
                    </div>
                    <div>
                        <Label>City</Label>
                        <Input
                            type="text"
                            name="city"
                            value={input.city}
                            onChange={changeEventHandler}
                            placeholder="Enter your city name" />
                        {errors.city && <span className="text-sm text-red-500 font-medium">{errors.city}</span>}
                    </div>
                    <div>
                        <Label>State</Label>
                        <Input
                            type="text"
                            name="state"
                            value={input.state}
                            onChange={changeEventHandler}
                            placeholder="Enter your state name" />
                        {errors.state && <span className="text-sm text-red-500 font-medium">{errors.state}</span>}
                    </div>
                    <div>
                        <Label>Delivery Time</Label>
                        <Input
                            type="number"
                            value={input.deliveryTime}
                            onChange={changeEventHandler}
                            name="deliveryTime"
                            placeholder="Enter your delivery time" />
                        {errors.deliveryTime && <span className="text-sm text-red-500 font-medium">{errors.deliveryTime}</span>}
                    </div>
                    <div>
                        <Label>Cuisines</Label>
                        <Input
                            type="text"
                            value={input.cuisines.join(", ")} // Join cuisines array for input value
                            onChange={(e) => setInput({ ...input, cuisines: e.target.value.split(",") })}
                            name="cuisines"
                            placeholder="e.g. Indian, Italian, Mexican" />
                        {errors.cuisines && <span className="text-sm text-red-500 font-medium">{errors.cuisines}</span>}
                    </div>
                    <div>
                        <Label>Upload Restaurant Banner</Label>
                        <Input
                            onChange={(e) => setInput({ ...input, imageRestaurant: e.target.files?.[0] || undefined })}
                            type="file"
                            accept="image/*"
                            name="imageRestaurant" />
                        {errors.imageRestaurant?.name && <span className="text-sm text-red-500 font-medium">{errors.imageRestaurant.name}</span>}
                    </div>
                </div>
                <div className="text-center mt-4 md:w-fit">
                    {loading ? (
                        <Button disabled className="bg-orange hover:bg-hoverOrange">
                            <Loader2 className="animate-spin mr-2 w-4 h-4" />Please wait
                        </Button>
                    ) : (
                        <Button className="bg-orange hover:bg-hoverOrange">
                            {restaurant ? "Update Your Restaurant" : "Add Your Restaurant"}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Restaurant;
