import { Link } from "react-router-dom"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "./ui/menubar";
import { HandPlatter, Loader2, Menu, Moon, PackageCheck, Salad, ShoppingCart, SquareMenu, Sun, User, UtensilsCrossed } from "lucide-react"


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"

import { Separator } from "./ui/separator";
import { useUserStore } from "@/store/useUserStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { useCartStore } from "@/store/useCartStore";
import { useThemeStore } from "@/store/useThemeStore";



const Navbar = () => {
  const { user, loading, logout } = useUserStore()
  const { cart } = useCartStore()

  const { restaurant } = useRestaurantStore()

  const {setTheme} = useThemeStore()

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between h-14 ">
        <Link to='/' className=" md:mx-5">
          <h1 className="font-bold md:font-extrabold text-2xl sm:font-bold ">Food Express</h1>
        </Link>
        <div className="hidden md:flex items-center gap-10">
          <div className="hidden md:flex items-center gap-6">
            <Link to='/'>Home</Link>
            <Link to='/profile'>Profile</Link>
            <Link to='/order/status'>Order</Link>
            <Link to='/restaurant'>Restaurants</Link>

            {
              user?.admin && (
                <Menubar>
                  <MenubarMenu>
                    <MenubarTrigger>Dashboard</MenubarTrigger>
                    <MenubarContent>
                      <MenubarItem>
                        <Link to='/admin/restaurant'>
                          {restaurant ? 'Update Restaurant' : 'Add Resturant'}
                        </Link>
                      </MenubarItem>
                      <MenubarItem>
                        <Link to='/admin/menu'>Menu</Link>
                      </MenubarItem>
                      <MenubarItem>
                        <Link to='/admin/orders'>Restaurant Orders</Link>
                      </MenubarItem>

                    </MenubarContent>
                  </MenubarMenu>

                </Menubar>
              )
            }
          </div>
          <div className="flex items-center gap-4 md:mx-5 ">
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Link to='/cart' className="relative cursor-pointer">
              <ShoppingCart />
              {
                cart.length > 0 &&
                <Button size={'icon'} className="absolute -inset-3 left-2 text-xs rounded-full h-4 w-4 bg-red-500 hover:bg-red-600">
                  {cart.length}
                </Button>
              }

            </Link>
            <div>
              <Avatar>
                <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div>
              {
                loading ? (
                  <Button className="bg-orange hover:bg-hoverOrange w-30 rounded-lg">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />Plese wait
                  </Button>
                ) : (
                  <Button onClick={logout} className="bg-orange hover:bg-hoverOrange w-30 rounded-lg">Logout</Button>
                )
              }

            </div>

          </div>
        </div>
        <div className="md:hidden lg:hidden">
          {
            <NavbarSheet />
          }
        </div>

      </div>
    </div>
  )
}

export default Navbar

const NavbarSheet = () => {
  const { user, loading, logout } = useUserStore()
  const { restaurant } = useRestaurantStore()
  const { cart } = useCartStore()
  const {setTheme} = useThemeStore()
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={'icon'} className=" mr-2 rounded-full  hover:bg-gray-200 text-black " variant="secondary">
          <Menu size={'24'} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle>Food Express</SheetTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </SheetHeader>
        <Separator />
        <SheetDescription className="flex-1">
          <Link to='/profile' className="flex items-center gap-4 hover:bg-gray-200 px-3 py-3 rounded-lg cursor-pointer hover:text-gray-900 font-medium">
            <User />
            <span className="">Profile</span>
          </Link>
          <Link to='/order/status' className="flex items-center gap-4 hover:bg-gray-200 px-3 py-3 rounded-lg cursor-pointer hover:text-gray-900 font-medium">
            <HandPlatter />
            <span className="">Orders</span>
          </Link>
          <Link to='/restaurant' className="flex items-center gap-4 hover:bg-gray-200 px-3 py-3 rounded-lg cursor-pointer hover:text-gray-900 font-medium">
            <Salad />
            <span className="">Restaurants</span>
          </Link>
          <Link to='/cart' className="flex items-center gap-4 hover:bg-gray-200 px-3 py-3 rounded-lg cursor-pointer hover:text-gray-900 font-medium">
            <ShoppingCart />
            <span className="">Cart ({cart.length})</span>
          </Link>
          {
            user?.admin && (
              <>
                <Link to='/admin/menu' className="flex items-center gap-4 hover:bg-gray-200 px-3 py-3 rounded-lg cursor-pointer hover:text-gray-900 font-medium">
                  <SquareMenu />
                  <span className="">Menu</span>
                </Link>
                <Link to='/admin/restaurant' className="flex items-center gap-4 hover:bg-gray-200 px-3 py-3 rounded-lg cursor-pointer hover:text-gray-900 font-medium">
                  <UtensilsCrossed />
                  <span className="">
                    {restaurant ? 'Update Restaurant' : 'Add Resturant'}
                  </span>
                </Link>
                <Link to='/admin/orders' className="flex items-center gap-4 hover:bg-gray-200 px-3 py-3 rounded-lg cursor-pointer hover:text-gray-900 font-medium">
                  <PackageCheck />
                  <span className="">Restaurant Orders</span>
                </Link>
              </>
            )
          }

        </SheetDescription>
        <SheetFooter className="flex flex-col gap-4">


          <div className="flex flex-row items-center gap-2">
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className="text-lg">{user?.fullname}</h1>
          </div>

          <SheetClose asChild>
            {
              loading ? (<Button className="bg-orange hover:bg-hoverOrange w-30 rounded-lg">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />Plese wait
              </Button>) : (<Button onClick={logout} type="submit">Logout</Button>)
            }

          </SheetClose>

        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}