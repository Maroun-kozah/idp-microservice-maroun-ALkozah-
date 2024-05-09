import 'express';

declare global {
    namespace Express {
        interface User {
            id: ObjectId | string;
            user?: any;
            [key: string]: any;
            // other properties
        }

        interface Request {
            user?: any;
        }
    }
}
