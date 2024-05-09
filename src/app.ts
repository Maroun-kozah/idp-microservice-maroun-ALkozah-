import express from 'express';
import mongoose from 'mongoose';
import http from "http";
import { config } from './config/config';
import userRoutes from './user/user.Routes';

const app = express();
app.use(express.json({ limit: '50000mb' }));
//app.use(express.json());
const server = http.createServer(app);
mongoose.connect(config.mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/users', userRoutes);

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});


