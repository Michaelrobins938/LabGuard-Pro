import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import contactRoutes from './routes/contact';
import releasesRoutes from './routes/releases';

dotenv.config();

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI || '')
    .then(() => console.log('MongoDB connected'))
    .catch((err: Error) => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/releases', releasesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 
