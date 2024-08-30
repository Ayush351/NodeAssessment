const express = require('express');
const { check, validationResult } = require('express-validator');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// @route    POST /api/products
// @desc     Create Product
router.post('/', [authMiddleware, [
  check('name', 'Name is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('price', 'Price is required and must be a number').isNumeric()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, price } = req.body;

  try {
    const product = new Product({
      name,
      description,
      price,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET /api/products
// @desc     Get All Products
router.get('/', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ isVisible: true });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    PUT /api/products/:id
// @desc     Update Product
router.put('/:id', [authMiddleware, adminMiddleware, [
  check('name', 'Name is required').optional().not().isEmpty(),
  check('description', 'Description is required').optional().not().isEmpty(),
  check('price', 'Price must be a number').optional().isNumeric(),
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    DELETE /api/products/:id
// @desc     Delete Product
router.delete('/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
