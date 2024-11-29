import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Apply middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'NodeJS-ExpressJS Best Practices API' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
