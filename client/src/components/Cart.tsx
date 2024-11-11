import { Minus, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./ui/table"
import { useState } from "react"
import CheckoutConfirmPage from "./CheckoutConfirmPage"
import { useCartStore } from "@/store/useCartStore"
import { CartItem } from "@/types/cartType"

const Cart = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [showAlert, setShowAlert] = useState<boolean>(false) // Alert state
  const { cart, decrementQuantity, incrementQuantity, removeFromTheCart } = useCartStore()
  
  // Calculate total amount
  let totalAmount = cart.reduce((acc, ele) => acc + ele.price * ele.quantity, 0)

  // Handle quantity increment with max limit check
  const handleIncrement = (id: string, quantity: number) => {
    if (quantity < 15) {
      incrementQuantity(id)
    } else {
      setShowAlert(true)  // Show alert if max quantity reached
    }
  }

  return (
    <div className="flex flex-col max-w-7xl mx-auto my-10">
      <div className="flex justify-end">
        <Button variant={"link"} className="">Clear All</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Items</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="pl-12">Quantity</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Remove</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cart.map((item: CartItem) => (
            <TableRow key={item._id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={item.image} alt="" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>
                <div className="w-fit flex items-center rounded-full border-gray-100 dark:border-gray-800 shadow-md">
                  <Button onClick={() => decrementQuantity(item._id)} size={"icon"} variant={'outline'} className="rounded-full bg-gray-200"><Minus /></Button>
                  <Button disabled size={'icon'} variant={"ghost"} className="font-semibold">{item.quantity}</Button>
                  <Button onClick={() => handleIncrement(item._id, item.quantity)} size={"icon"} variant={'outline'} className="rounded-full text-white bg-orange hover:bg-hoverOrange hover:text-gray-100"><Plus /></Button>
                </div>
              </TableCell>
              <TableCell>{item.price * item.quantity}</TableCell>
              <TableCell className="text-right">
                <Button onClick={() => removeFromTheCart(item._id)} size={'sm'} className="bg-orange hover:bg-hoverOrange ">Remove</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="text-2xl font-semibold">
            <TableCell colSpan={5}>Total</TableCell>
            <TableCell className="text-right">{totalAmount}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {/* Proceed to checkout button */}
      <div className="flex justify-end mt-4">
        <Button onClick={() => setOpen(true)} className="bg-orange hover:bg-hoverOrange">Proceed to Checkout</Button>
      </div>
      <CheckoutConfirmPage open={open} setOpen={setOpen} />

      {/* Alert message */}
      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-md">
            <p className="text-center">You can order a maximum of 15 quantity per item.</p>
            <h1 className="text-center">Thank You!</h1>
            <Button onClick={() => setShowAlert(false)} className="w-full mt-2 bg-orange hover:bg-hoverOrange">
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
