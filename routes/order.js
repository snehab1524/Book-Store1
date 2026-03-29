const router = require("express").Router();
const Order = require("../models/order");
const User = require("../models/user");
const authenticateToken = require("./userAuth");

router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const id = req.user.id;
    const { order } = req.body;
    
    // Validate order
    if (!order || !Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }
    
    // Create single order with all books
    const books = order.map(item => ({
      book: item._id,
      quantity: item.quantity || 1,
      price: item.price
    }));
    
    const totalAmount = books.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const newOrder = new Order({
      user: id,
      books,
      totalAmount,
      status: "Order Placed"
    });
    
    const orderFromDB = await newOrder.save();
    
    // Add to user orders
    await User.findByIdAndUpdate(id, {
      $push: { orders: orderFromDB._id }
    });

    // Remove from cart (distinct bookIds)
    const bookIds = [...new Set(order.map(item => item._id))];
    await User.updateOne(
      { _id: id }, 
      { $pullAll: { cart: bookIds } }
    );
    
    return res.json({
      status: "Success",
      message: "Order placed successfully",
      orderId: orderFromDB._id
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while placing order"
    });
  }

});

router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const id = req.user.id;
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { 
        path: "books.book",
        select: "title author price url image"
      },
      options: { sort: { 'createdAt': -1 } }
    });
    
    return res.json({
      status: "Success",
      data: userData.orders || []
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred"
    });
  }

});

router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const id = req.user.id;
    const tokenRole = req.user.role;
    if (tokenRole === "admin") {
      const ordersData = await Order.find()
        .populate("user", "username email address")
        .populate("books.book", "title author price url image")
        .sort({createdAt: -1});

      return res.json({
        status: "Success",
        data: ordersData
      });
    }

    const user = await User.findById(id).select("role");
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can view all orders" });
    }

    const ordersData = await Order.find()
      .populate("user", "username email address")
      .populate("books.book", "title author price url image")
      .sort({createdAt: -1});

    return res.json({
      status: "Success",
      data: ordersData
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: "An error occurred"
    });
  }

});

router.put("/update-order-status/:id", authenticateToken, async (req, res) => {
  try {
    const adminId = req.user.id;
    const tokenRole = req.user.role;
    if (tokenRole !== "admin") {
      const adminUser = await User.findById(adminId).select("role");
      if (!adminUser || adminUser.role !== "admin") {
        return res.status(403).json({ message: "Only admin can update order status" });
      }
    }

    const {id} = req.params;
    const {status} = req.body;
    
    // Validate status enum
    const validStatuses = ["Order Placed", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const orderData = await Order.findByIdAndUpdate(
      id, 
      {status}, 
      {new: true}
    ).populate("books.book", "title author price url image");
    
    return res.json({
      status: "Success",
      message: "Order status updated successfully",
      data: orderData
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred"
    }); 
  }

}); 

module.exports = router;
