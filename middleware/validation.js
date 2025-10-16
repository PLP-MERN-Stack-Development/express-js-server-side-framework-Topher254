const validateProduct = (req, res, next) => {
  const { name, description, price, category } = req.body;
  const errors = [];
  
  if (!name || typeof name !== 'string') {
    errors.push('Name is required and must be a string');
  }
  
  if (!description || typeof description !== 'string') {
    errors.push('Description is required and must be a string');
  }
  
  if (!price || typeof price !== 'number' || price <= 0) {
    errors.push('Price is required and must be a positive number');
  }
  
  if (!category || typeof category !== 'string') {
    errors.push('Category is required and must be a string');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }
  
  next();
};

export default validateProduct;