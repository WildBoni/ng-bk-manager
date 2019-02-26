const Book = require('../models/book');

exports.getBooks = (req, res, next) => {
  console.log(req.userData);
  Book.find({creator: req.userData.userId})
  .sort({_id: -1})
  .then(documents => {
    res.status(200).json({
      message: 'Books fetched successfully!',
      books: documents
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching books failed!"
    });
  });
}

exports.getBook = (req, res, next) => {
  Book.findById(req.params.id).then(book => {
    if (book) {
      if (book.creator == req.userData.userId) {
        res.status(200).json(book);
      } else {
        res.status(404).json({message: 'Book not found'});
      }
      // res.status(200).json(book);
    } else {
      res.status(404).json({message: 'Book not found'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching book failed!"
    });
  });
}

exports.createBook = (req, res, next) => {
  const book = new Book({
    title: req.body.title,
    authors: req.body.authors,
    creator: req.userData.userId,
    thumbnail: req.body.thumbnail,
    languages: req.body.languages,
    categories: req.body.categories,
    pageCount: req.body.pageCount,
    publisher: req.body.publisher,
    publishedDate: req.body.publishedDate,
    previewLink: req.body.previewLink,
    ean13: req.body.ean13,
    favourite: req.body.favourite
    // toRead: req.body.toRead
  });
  console.log(req.userData.userId);
  book.save().then(createdBook => {
    res.status(201).json({
      message: "book added successfully!",
      bookId: createdBook._id
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a book failed!"
    });
  });
}

exports.updateBook = (req, res, next) => {
  const book = new Book({
    _id: req.body.id,
    title: req.body.title,
    authors: req.body.authors,
    creator: req.userData.userId,
    thumbnail: req.body.thumbnail,
    languages: req.body.languages,
    categories: req.body.categories,
    pageCount: req.body.pageCount,
    publisher: req.body.publisher,
    publishedDate: req.body.publishedDate,
    previewLink: req.body.previewLink,
    ean13: req.body.ean13,
    favourite: req.body.favourite
    // toRead: req.body.toRead
  });
  Book.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    book
  ).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: "Update successfull!" });
    } else {
      res.status(401).json({ message: "Not Authorized!"});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update book!"
    });
  });;
}

exports.updateFav = (req, res, next) => {
  const fav = req.body.favourite;
  Book.findOneAndUpdate(
    { _id: req.params.id, creator: req.userData.userId },
    { favourite: fav },
    { new: true }
  ).then(result => {
    if (result) {
      res.status(200).json({
        message: "Fav successfull!",
        favourite: result.favourite,
        id: result._id
      });
    } else {
      res.status(401).json({ message: "Not Authorized!"});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update fav!"
    });
  });
}

exports.deleteBook = (req, res, next) => {
  Book.deleteOne({_id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successfull!" });
      } else {
        res.status(401).json({ message: "Not Authorized!"});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting book failed!"
      });
    });
}
