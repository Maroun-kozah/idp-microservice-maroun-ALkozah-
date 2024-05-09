import { Router } from 'express';
import * as userController from './user.Controller';
import { isAuthenticated } from './auth.middleware';
import { validate } from '../common/utils';
import { CreateUserValidationSchema, LoginUserValidationSchema, EditUserValidationSchema } from './user.validation';
import UserService from './user.Service';

const router = Router();
const userService = new UserService();

router.post('/signup', validate(CreateUserValidationSchema), userController.registerUser);
router.post('/signin', validate(LoginUserValidationSchema), userController.loginUser);
router.get('/profile', isAuthenticated, userController.viewProfile);
router.put('/editprofile', isAuthenticated, validate(EditUserValidationSchema), userController.editProfile);
router.get('/verify-token', isAuthenticated, userController.verifyToken);


export default router;
