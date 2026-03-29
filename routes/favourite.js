const router = require('express').Router();

const authenticateToken = require('./userAuth');
const User = require('../models/user');

router.post("/add", authenticateToken, async (req, res) => {
    try {
       const{bookId} = req.body;

       const id = req.user.id;
       const userData = await User.findById(id);
       if (!userData) {
           return res.status(404).json({ 
             status: "error",
             message: "User not found" 
           });
       }
       const isBookFavourite = userData.favorites.includes(bookId);
       if(isBookFavourite){
        return res.status(400).json({ 
          status: "error",
          message: "Book is already in favourites" 
        });
       }
       await User.findByIdAndUpdate(id, { $push: { favorites: bookId } });
       
       const updatedUser = await User.findById(id).populate('favorites');
       res.status(200).json({ 
         status: "success",
         data: updatedUser.favorites,
         message: "Book added to favourites" 
       });
       

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
          status: "error",
          message: error.message 
        });
    }

});

router.delete("/remove/:bookId", authenticateToken, async (req, res) => {
    try {
       const {bookId} = req.params;

       const id = req.user.id;
       const userData = await User.findById(id);
      
       const isBookFavourite = userData.favorites.includes(bookId);
       if(!isBookFavourite){
        return res.status(400).json({ 
          status: "error",
          message: "Book is not in favourites" 
        });
       }
       await User.findByIdAndUpdate(id, { $pull: { favorites: bookId } });
       
       const updatedUser = await User.findById(id).populate('favorites');
       res.status(200).json({ 
         status: "success",
         data: updatedUser.favorites,
         message: "Book removed from favourites" 
       });
       

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
          status: "error",
          message: error.message 
        });
    }

});

router.get("/get-favourite-books", authenticateToken, async (req, res) => {
    try {
       const id = req.user.id;
       const userData = await User.findById(id).populate('favorites');
       const favouriteBooks = userData.favorites;
       return res.json({
        status:"success",
        data:favouriteBooks
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
