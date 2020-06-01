const mongoose = require('mongoose');


const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;

const commentSchema = new Schema({ //비구조화 할당을 사용
  commenter: {
    type: ObjectId, //ObjectId를 사용하기 위해서 비구조화 할당을 이용함
    required: true,
    ref: 'User',
  },
  comment: {
    type: String,
    required: true,
  },  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Comment', commentSchema);
