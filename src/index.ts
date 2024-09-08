import express from 'express';
import connectDB from './database';
import routes from './routes/routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
var cors = require('cors');

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Use the routes
app.use('/api', routes);
app.use(cors({origin: true, credentials: true}));
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
