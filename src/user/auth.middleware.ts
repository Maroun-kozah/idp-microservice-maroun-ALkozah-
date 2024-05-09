// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { User ,tokenSchema} from "../user/user.Model"; // Ensure correct path

// Extend Request type to include user for TypeScript
interface AuthRequest extends Request {
    user?: any;  // Ideally, define a more specific type for 'user'
}

export const isAuthenticated = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send("Access denied. No token provided.");
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload;  // Use JwtPayload type for better type safety

        // Create a user object and assign it to req
        if (decoded && decoded.id) { // Assuming the payload has 'id'
            req.user = { id: decoded.id }; 
            next();
        } else {
            throw new Error("Token is valid but does not contain expected data.");
        }
    } catch (error) {
        res.status(400).send("Invalid token.");
    }
};

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }
    try {
        const decoded = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload;

        if (!decoded.id) {
            return res.status(400).send('Invalid token: ID missing.');
        }

        const user = await User.findById(decoded.id);
        if (!user || !user.tokens.some((t: { token: string; }) => t.token === token)) {
            throw new Error('Invalid token: No matching token found.');
        }

        req.user = user;  // Assuming the user model has a schema matching your needs
        next();
    } catch (error) {
        res.status(400).send('Invalid token.');
    }
};
