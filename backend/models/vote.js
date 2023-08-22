const mongoose = require('mongoose')
const voteSchema = new mongoose.Schema({
  factID: { type: String, required: true },
  verified: {type: Boolean, required: true}
});

module.exports = mongoose.model('Vote', voteSchema);