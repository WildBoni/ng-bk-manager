const Book = require('../models/book');

exports.createBook = (req, res, next) => {
  const book = new Book({
    title: req.body.title,
    authors: req.body.authors,
    creator: req.userData.userId
  });
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
    creator: req.userData.userId
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

exports.getBooks = (req, res, next) => {
  Book.find()
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
      res.status(200).json(book);
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
