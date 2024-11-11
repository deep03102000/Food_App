import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import cloudinary from "../utils/cloudinary";
import { generateVerificationCode } from "../utils/generateVerificationCode";
import { generateToken } from "../utils/generateToken";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/email";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullname, email, password, contact } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({
        success: false,
        message: "User already exists with this email address",
      });
      return; // Exit after sending the response to prevent further execution
    }

    const hashedPassword = await bcrypt.hash(password, 16);

    const verificationToken = generateVerificationCode(); // Assuming generateVerificationCode() is defined

    user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      contact: Number(contact),
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours expiration (corrected timestamp)
    });

    generateToken(res, user); // Assuming generateToken() sends a token in the response cookies or headers

    await sendVerificationEmail(email, verificationToken); // Assuming this sends an email

    const userWithoutPassword = await User.findOne({ email }).select(
      "-password"
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Signup Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
      return; // Exit after sending the response
    }

    // Verify the password
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
      return; // Exit after sending the response
    }

    // Generate and send a token (e.g., in cookies or headers)
    generateToken(res, user); // Assuming generateToken is defined and handles token creation

    // Update last login timestamp and save the user
    user.lastLogin = new Date();
    await user.save();

    // Retrieve the user without the password field
    const userWithoutPassword = await User.findOne({ email }).select(
      "-password"
    );

    // Send success response with the user data (excluding password)
    res.status(200).json({
      success: true,
      message: `Welcome Back ${user.fullname}`,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login Internal server error" });
  }
};

export const verifyEmail = async (req: Request, res: Response):Promise<any> => {
  try {
      const { verificationCode } = req.body;
     
      const user = await User.findOne({ verificationToken: verificationCode, verificationTokenExpiresAt: { $gt: Date.now() } }).select("-password");
      

      if (!user) {
          return res.status(400).json({
              success: false,
              message: "Invalid or expired verification token"
          });
      }
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined
      await user.save();

      // send welcome email
      await sendWelcomeEmail(user.email, user.fullname);

      return res.status(200).json({
          success: true,
          message: "Email verified successfully.",
          user,
      })
      
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" })
  }
}


export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("token").status(200).json({
      success: true,
      message: "Logged out successfully",
    });
    return
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Logout Internal server error" });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
     res.status(400).json({
        success: false,
        message: "User doesn't exist",
      });
      return
    }

    const resetToken = crypto.randomBytes(40).toString("hex");
    const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); //1hr

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
    await user.save();

    //send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log(error);
      res.status(500).json({
      success: false,
      message: "Forgot Password Internal server error",
    });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiresAt: { $gt: Date.now },
    });
    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
      return 
    }
    //update new password

    const hashedPassword = await bcrypt.hash(newPassword, 16);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;

    await user.save();
    // send success reset email
    await sendResetSuccessEmail(user.email);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Reset Password Internal server error",
    });
  }
};

export const checkAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.id; // Ensure req.id is set by previous middleware (e.g., isAuthenticated)

    // Check if userId is available
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User ID not found in request",
      });
      return; // Exit if userId is not available
    }

    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      res.status(404).json({ // Change to 404 Not Found
        success: false,
        message: "User not found",
      });
      return; // Exit after sending the response
    }

    // User found, respond with user data
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Check Auth Error:", error); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: "Check Auth Internal server error",
    });
    return; // Exit after sending the response
  }
};


export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.id;
    const { fullname, email, address, city, state, profilePicture } = req.body;

    if (!fullname || !email || !address || !city || !state || !profilePicture) {
      res.status(400).json({
        success: false,
        message: "All profile fields are required",
      });
      return;
    }
    
    //upload image on cloudinary
    let cloudResponse: any;
    cloudResponse = await cloudinary.uploader.upload(profilePicture);
    const updatedData = {
      fullname,
      email,
      address,
      city,
      state,
      profilePicture,
    };

    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");
    res.status(200).json({
      success: true,
      user,
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update Profile Internal server error",
    });
  }
};
