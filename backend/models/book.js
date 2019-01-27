const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  title: { type: String, required: true },
  authors: { type: [String], required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true}
});

module.exports = mongoose.model('Book', bookSchema);
