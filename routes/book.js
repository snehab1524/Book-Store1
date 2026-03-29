const router = require('express').Router();
const Book = require('../models/book');
const authenticateToken = require('./userAuth');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post("/add-book", async (req, res) => {
    try {
        const book = new Book({
            title: req.body.title,
            url : req.body.url,
            author: req.body.author,
            price: req.body.price,
            description: req.body.description,
            language: req.body.language,

        })
        await book.save();
        res.status(201).json({ message: "Book added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.put("/update-book", authenticateToken, async (req, res) => {
    try {
       const bookId = req.body.bookId;
       
       if (!bookId) {
           return res.status(400).json({ message: "Book ID is required" });
       }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        await Book.findByIdAndUpdate(bookId, {
            title: req.body.title,
            url : req.body.url,
            author: req.body.author,
            price: req.body.price,
            description: req.body.description,
            language: req.body.language,
        });
        res.status(200).json({ message: "Book updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.delete("/delete-book", authenticateToken, async (req, res) => {
    try {
       const bookId = req.body.bookId;
         if (!bookId) {
              return res.status(400).json({ message: "Book ID is required" });
            }
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }   
        await Book.findByIdAndDelete(bookId);
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get("/get-books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        return res.json({
            status: "success",
            data: books
        });
    } catch (error) {    
        return  res.status(500).json({ message: error.message });
    }
})
router.get("/recently-added", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 }).limit(10);
        return res.json({
            status: "success",
            data: books
        });
    } catch (error) {    
        return  res.status(500).json({ message: error.message });
    }
})
router.get("/get-recent-books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 }).limit(10);
        return res.json({
            status: "success",
            data: books
        });
    } catch (error) {    
        return  res.status(500).json({ message: error.message });
    }
})
router.get("/get-book-by-id/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        return res.json({
            status: "success",
            data: book
        });
    } catch (error) {
        return  res.status(500).json({ message: error.message });
    }
});
    

module.exports = router;
