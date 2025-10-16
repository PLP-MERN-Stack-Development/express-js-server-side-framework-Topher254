import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler, NotFoundError } from '../utils/errors.js';
import validateProduct from '../middleware/validation.js'; // ADD THIS IMPORT

const router = express.Router();

let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false,
    createdAt: new Date().toISOString()
  }
];

// GET /api/products - Get all products with filtering, pagination, and search
router.get('/', asyncHandler(async (req, res) => {
  let filteredProducts = [...products];
  
  // Filter by category
  if (req.query.category) {
    filteredProducts = filteredProducts.filter(
      product => product.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }
  
  // Filter by inStock
  if (req.query.inStock) {
    const inStock = req.query.inStock.toLowerCase() === 'true';
    filteredProducts = filteredProducts.filter(product => product.inStock === inStock);
  }
  
  // Search by name
  if (req.query.q) {
    const searchTerm = req.query.q.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  }
  
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    products: paginatedProducts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(filteredProducts.length / limit),
      totalProducts: filteredProducts.length,
      hasNext: endIndex < filteredProducts.length,
      hasPrev: page > 1
    }
  });
}));

// GET /api/products/search - Search products by name or description
router.get('/search', asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({
      error: 'ValidationError',
      message: 'Search query (q) is required'
    });
  }
  
  const searchTerm = q.toLowerCase();
  const searchResults = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm)
  );
  
  res.json({
    query: q,
    results: searchResults,
    count: searchResults.length
  });
}));

// GET /api/products/stats - Get product statistics
router.get('/stats', asyncHandler(async (req, res) => {
  const stats = {
    totalProducts: products.length,
    totalInStock: products.filter(p => p.inStock).length,
    totalOutOfStock: products.filter(p => !p.inStock).length,
    categories: {},
    priceStats: {
      highest: Math.max(...products.map(p => p.price)),
      lowest: Math.min(...products.map(p => p.price)),
      average: products.reduce((sum, p) => sum + p.price, 0) / products.length
    }
  };
  
  // Count by category
  products.forEach(product => {
    if (!stats.categories[product.category]) {
      stats.categories[product.category] = 0;
    }
    stats.categories[product.category]++;
  });
  
  res.json(stats);
}));

// GET /api/products/:id - Get a specific product
router.get('/:id', asyncHandler(async (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  
  if (!product) {
    throw new NotFoundError(`Product with id ${req.params.id} not found`);
  }
  
  res.json(product);
}));

// POST /api/products - Create a new product
router.post('/', validateProduct, asyncHandler(async (req, res) => {
  const { name, description, price, category, inStock = true } = req.body;
  
  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock: Boolean(inStock),
    createdAt: new Date().toISOString()
  };
  
  products.push(newProduct);
  
  res.status(201).json(newProduct);
}));

// PUT /api/products/:id - Update a product
router.put('/:id', validateProduct, asyncHandler(async (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  
  if (productIndex === -1) {
    throw new NotFoundError(`Product with id ${req.params.id} not found`);
  }
  
  const { name, description, price, category, inStock } = req.body;
  
  products[productIndex] = {
    ...products[productIndex],
    name,
    description,
    price,
    category,
    inStock: Boolean(inStock),
    updatedAt: new Date().toISOString()
  };
  
  res.json(products[productIndex]);
}));

// DELETE /api/products/:id - Delete a product
router.delete('/:id', asyncHandler(async (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  
  if (productIndex === -1) {
    throw new NotFoundError(`Product with id ${req.params.id} not found`);
  }
  
  const deletedProduct = products.splice(productIndex, 1)[0];
  
  res.json({
    message: 'Product deleted successfully',
    product: deletedProduct
  });
}));

export default router;