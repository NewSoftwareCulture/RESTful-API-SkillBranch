import mongoose from 'mongoose';
import _ from 'lodash';

const { Schema } = mongoose;

const DishSchema = new Schema({
  categoryId: {
    // ID категории, к котрой относится блюдо
    type: String,
    required: true,
  },
  dishName: {
    // Название блюда
    type: String,
    required: true,
  },
  description: {
    // Описание блюда
    type: String,
    // required: true,
  },
  image: {
    // Ссылка на изображение
    type: String,
    // required: true,
  },
  isRecomendation: {
    type: Boolean,
  },
  isPromo: {
    type: Boolean,
  },
  oldPrice: {
    // Старая цена, опционально
    type: String,
  },
  price: {
    // Текущая цена 
    type: Number,
    required: true,
  },
  rating: {
    // Оценка пользователей
    type: Number,
    required: true,
  },
  likes: {
    // Количество лайков
    type: Number,
    required: true,
  },
  commentsCount: {
    type: Number,
  },
  active: {
    // Доступно ли блюдо (нет - удалить из бд)
    type: Boolean,
    required: true,
  },
}, {
  timestamps: true,
});

DishSchema.methods.toJSON = function () {
  return _.pick(this, ['categoryId', 'dishName', 'description', 'image', 'oldPrice', 'price', 'rating', 'likes', 'commentsCount', 'active']);
};

export default mongoose.model('Dish', DishSchema);