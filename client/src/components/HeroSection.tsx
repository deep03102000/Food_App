import { useState } from "react"
import { Input } from "./ui/input"
import { Search } from "lucide-react"
import { Button } from "./ui/button"
import HeroImage from '@/assets/HeroSectionImage-removebg.png'
import { useNavigate } from "react-router-dom"

const HeroSection = () => {
    const [searchText, setSearchText] = useState<string>('')
    const navigate = useNavigate()
    return (
        <div className="flex flex-col md:flex-row max-w-7xl mx-auto md:p-10 rounded-lg items-center justify-center m-4 gap-20">
            <div className="flex flex-col gap-10 md:w-[40%]">
                <div className="flex flex-col gap-5">
                    <h1 className="font-bold md:font-extrabold md:text-5xl text-4xl">Order Food anytime and anywhere</h1>
                    <p className="text-gray-500 text-2xl md:text-3xl md:font-bold font-medium">Hey! Our Delicious food is waiting for you, we are always near to you</p>
                </div>
                
                <div className="relative mx-4 flex items-center w-full gap-3">

                    <Input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                       placeholder="Search for food, restaurants, and also with city name"
                        className="pl-10 border-2 rounded-3xl shadow-lg"
                    />
                    <Search className="text-gray-500 absolute inset-y-2 left-2" />


                    <Button onClick={()=>navigate(`/search/${searchText}`)} className="bg-orange hover:bg-hoverOrange rounded-lg w-20 hover:text-gray-200 text-sm">Search</Button>


                </div>
                </div>
                <div>
                    <img src={HeroImage}
                    className="object-cover w-full max-h-[500px] max-w-[90%]" />

                </div>
                
            
        </div>
    )
}

export default HeroSection