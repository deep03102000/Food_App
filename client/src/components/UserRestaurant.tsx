import { Globe, MapPin } from "lucide-react";
import { AspectRatio } from "./ui/aspect-ratio"
import { Card, CardContent, CardFooter } from "./ui/card"

import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import HeroImage  from '@/assets/HeroSectionImage-removebg.png';

const UserRestaurant = () => {
  return (
    <div className=" max-w-6xl mx-auto my-10 grid md:grid-cols-3 gap-4">
                        {
                            [1, 2, 3].map(() => (
                                <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 mx-4">
                                    <div className="relative">
                                        <AspectRatio ratio={16 / 6}>
                                            <img src={HeroImage} alt="" className="w-full h-full object-cover" />
                                            <div className="absolute top-2 bg-white dark:bg-gray-700 bg-opacity-70 rounded-lg py-1 px-3">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Featured
                                                </span>
                                            </div>
                                        </AspectRatio>
                                    </div>
                                    <CardContent className="p-4">
                                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Resturant Name</h1>
                                        <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                                            <MapPin size={16} />
                                            <p className="text-sm ">
                                                City: {" "}
                                                <span className="font-medium">Kolkata</span>
                                            </p>
                                        </div>
                                        <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                                            <Globe size={16} />
                                            <p className="text-sm ">
                                                State: {" "}
                                                <span className="font-medium">West Bengal</span>
                                            </p>
                                        </div>
                                        {/**Cuisines */}
                                        <div className="flex gap-2 mt-4 flex-wrap ">
                                            {
                                                ['Indian', 'Chinese', 'Italian'].map((cuisine: string, idx: number) => (
                                                    <Badge key={idx} className="font-medium hover:bg-gray-200 cursor-pointer px-2 py-1 rounded-full shadow-sm " variant={"outline"}>{cuisine}</Badge>
                                                ))
                                            }
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-4 border-t dark:border-t-gray-100 flex justify-end text-white ">
                                        <Link to={`/resturant/${123}`}>
                                            <Button className="bg-orange hover:bg-hoverOrange hover:text-white" variant={"outline"} >View Menu</Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))
                        }

                    </div>
  )
}

export default UserRestaurant