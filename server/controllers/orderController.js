const Order = require('../models/Order');

const VALID_TRANSITIONS = {
  RECEIVED: ['PROCESSING'],
  PROCESSING: ['READY'],
  READY: ['DELIVERED'],
  DELIVERED: [],
};

exports.createOrder = async (req, res) => {
  try {
    const { customerName, phone, items } = req.body;

    if (!customerName || !phone || !items || !items.length) {
      return res.status(400).json({ error: 'customerName, phone, and items are required' });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

    const order = await Order.create({
      customerName,
      phone,
      items,
      totalAmount,
      estimatedDelivery,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { status, customerName, phone, search, garmentType } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (customerName) filter.customerName = { $regex: customerName, $options: 'i' };
    if (phone) filter.phone = { $regex: phone, $options: 'i' };
    if (garmentType) filter['items.type'] = garmentType;

    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } },
      ];
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const allowedTransitions = VALID_TRANSITIONS[order.status];
    if (!allowedTransitions.includes(status)) {
      return res.status(400).json({
        error: `Cannot transition from ${order.status} to ${status}. Allowed: ${allowedTransitions.join(', ') || 'none'}`,
      });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const orders = await Order.find();

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    const statusBreakdown = {
      RECEIVED: 0,
      PROCESSING: 0,
      READY: 0,
      DELIVERED: 0,
    };

    orders.forEach((order) => {
      statusBreakdown[order.status]++;
    });

    res.json({ totalOrders, totalRevenue, statusBreakdown });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
