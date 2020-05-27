import mongoose from 'mongoose';
import _ from 'lodash';

const { Schema } = mongoose;

const FeedbackListSchema = new Schema({
  feedbackId: {
    // ID отзыва
    type: String,
    required: true,
  },
  dishId: {
    // ID блюда
    type: String,
    required: true,
  },
  author: {
    // Имя автора
    type: String,
    required: true,
  },
  date: {
    // Дата написания отзыва (ISO 8601)
    type: String,
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
    required: true,
  },
  active: {
    // Доступен ли отзыв (нет - удалить из бд)
    type: Boolean,
    required: true,
  },
}, {
  timestamps: true,
});

FeedbackListSchema.methods.toJSON = function () {
  return _.pick(this, ['feedbackId', 'dishId', 'author', 'date', 'rating', 'text', 'active']);
};

export default mongoose.model('FeedbackList', FeedbackListSchema);