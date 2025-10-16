
import express from 'express';
import bodyParser from 'body-parser';

import { PORT } from './config/env.js';
import logger from './middleware/logger.js';
import authenticate from './middleware/auth.js';
import errorHandler from './middleware/errorHandler.js';

import productsRouter from './routes/products.js';

const app = express();

app.use(bodyParser.json());
app.use(logger); // Custom logging middleware

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Product API!',
    endpoints: {
      products: '/api/products',
      documentation: 'See README.md for API documentation'
    }
  });
});

app.use('/api/products', authenticate, productsRouter);

app.use((req, res) => {
  res.status(404).json({
    error: 'NotFound',
    message: `Route ${req.originalUrl} not found`
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});

export default app;
