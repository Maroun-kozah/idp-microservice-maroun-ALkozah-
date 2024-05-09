import { Request, Response, NextFunction } from 'express';
import UserService from './user.Service';

const userService = new UserService(); // Create a new instance of UserService


interface AuthRequest extends Request {
    user?: { id: string } // Assuming `user` has at least an `id`. Adjust according to your application's needs.
}

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = await userService.verifyUserCredentials(req.body.email, req.body.password);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "errors" });
    }
};

export const viewProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).send('Authentication required');
    }
    try {
        const user = await userService.getUserById(req.user.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "error" });
    }
};

export const editProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).send('Authentication required');
    }
    try {
        const updatedUser = await userService.editUser(req.user.id, req.body);
        res.json({ message: 'Profile updated successfully', updatedUser });
    } catch (error) {
        res.status(500).json({ message: "error" });
    }
};

export const verifyToken = (req: AuthRequest, res: Response) => {
    res.json({
        message: 'Token is valid',
        user: req.user
    });
};