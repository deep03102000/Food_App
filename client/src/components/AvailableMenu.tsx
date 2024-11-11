import { MenuItem } from "@/types/restaurantType"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter } from "./ui/card"
import { useCartStore } from "@/store/useCartStore"
import { useNavigate } from "react-router-dom"


const AvailableMenu = ({ menus }: { menus: MenuItem[] | undefined }) => {
    const { addToCart } = useCartStore()
    const navigate = useNavigate()
    return (
        <div className="md:p-4">
            <h1 className="text-xl md:text-2xl font-extrabold mb-6">Availabe Menu</h1>
            <div className="grid md:grid-cols-4 space-y-4 md:space-y-0 gap-5">
                {
                   menus && menus.map((menu: MenuItem) => (

                        <div >
                            <Card className="md:max-w-xs mx-auto shadow-lg rounded-lg overflow-hidden">
                                <img className="w-full h-40 object-cover" src={menu.image} alt="" />
                                <CardContent className="p-4">
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{menu.name}</h2>
                                    <p className="text-sm text-gray-600 mt-2">{menu.description}</p>
                                    <h3 className="text-lg font-semibold mt-3">Price: <span className="text-hoverOrange">₹{menu.price}</span></h3>
                                </CardContent>
                                <CardFooter className="p-4">
                                    <Button onClick={() => { addToCart(menu); navigate("/") }} className=" w-full bg-orange hover:bg-hoverOrange">Add to Cart</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    ))
                }



            </div>

        </div>
    )
}

export default AvailableMenu