// mongopassword = xAZcKhLw2hvuBTsK
//mongoUserName = deepsadhukhan1234


import mongoose from "mongoose"
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!)
        console.log("Mongodb Connected!")
    } catch (error) {
        console.log(error)
    }

}

export default connectDB