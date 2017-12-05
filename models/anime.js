const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    comment: String,
    rating: Number,
    animeId: Number,
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const autoPopulateAuthor = function(next) {
  this.populate('author');
  next();
};

CommentSchema.
  pre('find', autoPopulateAuthor).
  pre('findOne', autoPopulateAuthor);

// module.exports = AnimeComment;
module.exports = mongoose.model('AnimeComment', CommentSchema);
