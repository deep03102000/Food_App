import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            id?: string; // Making id optional, as it might not be set if the token is invalid
        }
    }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token;

        // Check if token exists
        if (!token) {
            res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
            return; // Exit after sending the response
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY!) as jwt.JwtPayload;

        // Check if userId exists in decoded token
        if (!decoded || typeof decoded.userId !== 'string') {
            res.status(401).json({
                success: false,
                message: "Invalid token"
            });
            return; // Exit after sending the response
        }

        // Set user ID in the request object
        req.id = decoded.userId;

        // Proceed to the next middleware
        next(); // No return needed here
    } catch (error) {
        console.error("Authentication error:", error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
        return; // Exit after sending the response
    }
};
