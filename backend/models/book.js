const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  title: { type: String, required: true },
  authors: { type: [String], required: true },
  thumbnail: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true },
  languages: { type: [String] },
  categories: { type: [String] },
  pageCount: { type: Number },
  publisher: { type: String },
  publisherDate: { type: String },
  previewLink: { type: String }
});

module.exports = mongoose.model('Book', bookSchema);
