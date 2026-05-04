const Order = require('../models/Order');
const Product = require('../models/Product');

const calculateTotal = async (orderId) => {
  const order = await Order.findById(orderId).populate('products.productId');
  if (!order) throw new Error('Order not found');

  let totalAmount = 0;
  for (const item of order.products) {
    const product = item.productId;
    if (product) {
      totalAmount += product.price * item.quantity;
    }
  }
  return totalAmount;
};

const placeOrder = async (req, res) => {
  try {
    const { products } = req.body;
    
    let totalAmount = 0;
    const orderItems = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
      }

      totalAmount += product.price * item.quantity;
      
      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        priceAtTime: product.price
      });

      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      userId: req.user._id,
      products: orderItems,
      totalAmount
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate('products.productId', 'name price');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const recalculateOrderTotal = async (req, res) => {
  try {
    const total = await calculateTotal(req.params.id);
    res.json({ orderId: req.params.id, dynamicallyCalculatedTotal: total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { placeOrder, getUserOrders, calculateTotal, recalculateOrderTotal };
