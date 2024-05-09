// src/user/user.Service.ts
import { User } from './user.Model';
import { SignupDto } from "./dto/CreateUserDto";
import { LoginUserDto } from "./dto/LoginUserDto";
import { EditProfileDto } from "./dto/EditUserDto";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { UserError } from './user.error';

export default class UserService {
    async createUser(userData: SignupDto) {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new UserError('Email already in use', 409);
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = new User({
            ...userData,
            password: hashedPassword
        });
        const accessToken = jwt.sign({ id: newUser._id }, config.jwtSecret, { expiresIn: '15h' });
        const refreshToken = jwt.sign({ id: newUser._id }, config.jwtSecret, { expiresIn: '7d' });
    
        newUser.tokens.push({ token: refreshToken, expires: new Date(Date.now() + 7*24*60*60*1000) });
        await newUser.save();
        return newUser;
    }

    async verifyUserCredentials(email: string, password: string) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new UserError('User not found', 404);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UserError('Incorrect password', 401);
        }

        const accessToken = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '15h' });
        const refreshToken = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '7d' });
    
        user.tokens.push({ token: refreshToken, expires: new Date(Date.now() + 7*24*60*60*1000) });
        await user.save();
    
        return { accessToken, refreshToken };
    }

    async getUserById(userId: string) {
        const user = await User.findById(userId);
        if (!user) {
            throw new UserError('User not found', 404);
        }
        return user;
    }

    async editUser(userId: string, userData: EditProfileDto) {
        const user = await User.findByIdAndUpdate(userId, { $set: userData }, { new: true });
        if (!user) {
            throw new UserError('User not found', 404);
        }
        return user;
    }

    async generateAndSaveToken(user: { _id: any; tokens: { token: string; expires: Date; }[]; save: () => any; }) {
        const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '1h' });
        const expires = new Date(Date.now() + 3600000); // 1 hour from now

        // Save the token in the database
        user.tokens.push({ token, expires });
        await user.save();

        return token;
    }
}

