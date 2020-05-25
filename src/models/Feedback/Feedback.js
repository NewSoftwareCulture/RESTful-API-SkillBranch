import mongoose from 'mongoose';
import _ from 'lodash';

const { Schema } = mongoose;

const FeedbackSchema = new Schema({
  dishId: {
    // ID блюда
    type: Number,
    required: true,
  },
  rating: {
    // Оценка
    type: Number,
    required: true,
  },
  text: {
    // Текст отзыва, опционально
    type: String,
  },
}, {
  timestamps: true,
});

FeedbackSchema.methods.toJSON = function () {
  return _.pick(this, ['dishId', 'rating', 'text']);
};

export default mongoose.model('Feedback', FeedbackSchema);