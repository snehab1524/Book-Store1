const router = require("express").Router();
const User = require("../models/user");
const authenticateToken = require("./userAuth");

router.post("/add", authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.body;

    const userId = req.user.id;

    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const isBookInCart = userData.cart.includes(bookId);

    if (isBookInCart) {
      return res.json({
        status: "success",
        message: "Book is already in cart",
      });
    }

    await User.findByIdAndUpdate(userId, {
      $push: { cart: bookId },
    });

    const updatedUser = await User.findById(userId).populate('cart');
    return res.json({
      status: "success",
      data: updatedUser.cart.reverse(),
      message: "Book added to cart",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred",
    });
  }
});

router.delete("/remove/:bookId", authenticateToken, async (req, res) => {
  try {
    const {bookId}= req.params;

    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, {
      $pull: { cart: bookId },
    });

    const updatedUser = await User.findById(userId).populate('cart');
    return res.json({
      status: "success",
      data: updatedUser.cart.reverse(),
      message: "Book removed from cart",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred",
    });
  }
});

router.get("/get-user-cart", authenticateToken, async (req, res) => {
    try {
       const userId = req.user.id;
       const userData = await User.findById(userId).populate('cart');
       
       if (!userData) {
        return res.status(404).json({
          status: "error",
          message: "User not found"
        });
       }
       
       const cart = userData.cart.reverse();
       return res.json({
        status:"success",
        data:cart
       })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
          status: "error",
          message: error.message 
        });
    }
});

module.exports = router;
