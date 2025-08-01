import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server);

import User from './models/User';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI || '')
  .then(() => console.log('MongoDB connected'))
  .catch((err: Error) => console.log('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// Use routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.get('/', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

io.on('connection', (socket: Socket) => {
    console.log('a user connected');

    socket.on('completeQuest', async (data: { userId: string; questId: string }) => {
        try {
            const user = await User.findById(data.userId);
            if (!user) {
                console.log('User not found');
                return;
            }

            // Note: Quest model needs to be imported if it exists
            // const quest = await Quest.findById(data.questId);
            
            // For now, we'll skip the quest completion logic until Quest model is properly set up
            console.log('Quest completion requested:', data);
            
            // user.quests = user.quests.map(q => q.questId.toString() === data.questId ? { ...q, status: 'complete' } : q);
            // user.experience += quest.expReward;

            // const levelUpExp = 100 * user.level;
            // while (user.experience >= levelUpExp) {
            //     user.experience -= levelUpExp;
            //     user.level += 1;
            // }

            // await user.save();
            // io.emit('profileUpdated', user);
        } catch (error) {
            console.error('Error completing quest:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
