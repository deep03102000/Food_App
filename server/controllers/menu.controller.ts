import { Request, Response } from "express";
import uploadImageOnCloudinary from "../utils/imageUpload";
import { Menu } from "../models/menu.model";
import { Restaurant } from "../models/restaurant.model";
import  mongoose  from 'mongoose';


export const addMenu = async(req: Request, res: Response): Promise<any> => {
    try {
        const { name, description, price} = req.body
        const file = req.file
        if(!file){
           return res.status(400).json({
                success: false,
                message: "Image is Required"
            })
            
        }
        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File)
        const menu: any = await Menu.create({
            name,
            description,
            price,
            image: imageUrl
        })
        
        const restaurant = await Restaurant.findOne({user: req.id})
        if(restaurant){
            
            (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id);
            
            await restaurant.save()
            
        }

         return res.status(201).json({
            success: true,
            message: "Menu Added Successfully",
            menu
        })
        
        

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Add Menu Internal Server Error"
        })
        
    }
}

export const editMenu = async (req:Request, res: Response): Promise<any> => {
    try {
        const {id} = req.params
        const {name, description, price} = req.body
        const file = req.file
        const menu = await Menu.findById(id)
        if(!menu){
            return res.status(404).json({
                success: false,
                message: "Menu Not Found"
            })
            
        }
        if(name) menu.name = name
        if(description) menu.description = description
        if(price) menu.price = price

        if(file){
            const ImageUrl = await uploadImageOnCloudinary (file as Express.Multer.File)
            menu.image = ImageUrl
        }
        await menu.save()
        return res.status(201).json({
            success: true,
            message: "Menu Updated Successfully",
            menu
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Edit Menu Internal Server Error"
        })
        
    }
}   

export const deleteMenu = async(req:Request, res: Response): Promise<any> => {
    try {
        const {id} = req.params
        if(!id){
           return res.status(400).json({
                success: false,
                message: "Menu ID is required"
            })
            
        }
        // Find the menu by ID
        const menu = await Menu.findById(id)
        if(!menu){
           return res.status(404).json({
                success: false,
                message: "Menu Not Found"
            })
            
        }
        // Delete the menu
        await Menu.findByIdAndDelete(id)

        return res.status(200).json({
            success: true,
            message: "Menu Deleted Successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Delete Menu Internal Server Error",
        });
    }
}
  