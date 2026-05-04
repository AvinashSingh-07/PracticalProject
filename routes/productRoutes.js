const express = require('express');
const { addProduct, updateProduct, deleteProduct, getProducts } = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');
const { validateProduct } = require('../middlewares/validateMiddleware');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, validateProduct, addProduct);

router.route('/:id')
  .put(protect, admin, validateProduct, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
