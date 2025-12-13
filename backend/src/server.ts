import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initializeSocket } from './socket';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const { io, userSockets } = initializeSocket(httpServer);

// Make io and userSockets available to routes
app.set('io', io);
app.set('userSockets', userSockets);

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes will be imported here
// import authRoutes from './routes/auth.routes';
// import taskRoutes from './routes/task.routes';
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});