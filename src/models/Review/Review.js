import mongoose from 'mongoose';
import _ from 'lodash';

const { Schema } = mongoose;

const ReviewsSchema = new Schema({
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
  },
  active: {
    // Доступен ли отзыв (нет - удалить из бд)
    type: Boolean,
    required: true,
  },
}, {
  timestamps: true,
});

ReviewsSchema.methods.toJSON = function () {
  return _.pick(this, ['dishId', 'author', 'date', 'rating', 'text', 'active']);
};

export default mongoose.model('Reviews', ReviewsSchema);