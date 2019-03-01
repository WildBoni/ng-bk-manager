const express = require("express");
const BookController = require("../controllers/books");
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get("", checkAuth, BookController.getBooks);

router.get("/:id", checkAuth, BookController.getBookById);

router.get("/ean/:ean13", checkAuth, BookController.getBookByEan);

router.post("", checkAuth, BookController.createBook);

router.put("/:id", checkAuth, BookController.updateBook);

router.put("/fav/:id", checkAuth, BookController.updateFav);

router.delete("/:id", checkAuth, BookController.deleteBook);

module.exports = router;
