import React, { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Loader2 } from "lucide-react"
import { MenuFormSchema, menuSchema } from "@/schema/menuSchema"
import { useMenuStore } from "@/store/useMenuStore"
import { MenuItem } from "@/types/restaurantType"

const EditMenu = ({ selectedMenu, editOpen, setEditOpen }: { selectedMenu: MenuItem, editOpen: boolean, setEditOpen: Dispatch<SetStateAction<boolean>> }) => {

    const [input, setInput] = useState<MenuFormSchema>({
        name: "",
        description: "",
        price: 0,
        image: undefined
    })

    const [errors, setErrors] = useState<Partial<MenuFormSchema>>({})
    const { loading, editMenu } = useMenuStore()

    


    
    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target
        setInput({ ...input, [name]: type == "number" ? Number(value) : value })
    }

    const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setInput({
            ...input,
            image: file || undefined, // Set the selected file or `undefined`
        });
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(input)

        const result = menuSchema.safeParse(input)
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors
            setErrors(fieldErrors as Partial<MenuFormSchema>)
            return

        }

        //api implimentation starts from here
        try {
            const formData = new FormData()
            formData.append("name", input.name)
            formData.append("description", input.description)
            formData.append("price", input.price.toString())
            if (input.image) {
                formData.append("image", input.image);
            }
            await editMenu(selectedMenu._id, formData)
        } catch (error) {
            console.log(error)
        }

    }


    useEffect(() => {

        setInput({
            name: selectedMenu?.name || "",
            description: selectedMenu?.description || "",
            price: selectedMenu?.price || 0,
            image: undefined

        })
    }, [selectedMenu])



    return (
        <div>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Menu</DialogTitle>
                        <DialogDescription className="pr-5">
                            Update the details of your selected menu item below. Make sure to save your changes.
                        </DialogDescription>

                    </DialogHeader>
                    <form onSubmit={submitHandler} action="" className="space-y-2">
                        <div>
                            <Label>Name</Label>
                            <Input
                                className="mt-2"
                                type="text"
                                value={input.name}
                                name="name"
                                onChange={changeEventHandler}
                                placeholder="Enter menu name" />
                            {
                                errors && <span className="text-xs font-medium text-red-600">{errors.name}</span>
                            }
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                className="mt-2"
                                type="text"
                                value={input.description}
                                name="description"
                                onChange={changeEventHandler}
                                placeholder="Enter menu description" />
                            {
                                errors && <span className="text-xs font-medium text-red-600">{errors.description}</span>
                            }
                        </div>
                        <div>
                            <Label>Price in (Rupees)</Label>
                            <Input
                                className="mt-2"
                                type="number"
                                name="price"
                                value={input.price}
                                onChange={changeEventHandler}
                                placeholder="Enter menu Price" />
                            {
                                errors && <span className="text-xs font-medium text-red-600">{errors.price}</span>
                            }
                        </div>
                        <div>
                            <Label>Menu Image</Label>
                            <Input
                                className="mt-2"
                                type="file"
                                name="image"
                                onChange={fileChangeHandler}
                                placeholder="Enter menu image" />
                            {
                                errors && <span className="text-xs font-medium text-red-600">{errors.image?.name}</span>
                            }
                        </div>
                        <DialogFooter>
                            {
                                loading ? (<Button disabled className="mt-4 bg-orange hover:bg-hoverOrange"><Loader2 className="animate-spin mr-2" />Please wait</Button>) : (
                                    <Button className="mt-4 bg-orange hover:bg-hoverOrange">Submit</Button>
                                )
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EditMenu