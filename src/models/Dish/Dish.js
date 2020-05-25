import mongoose from 'mongoose';
import _ from 'lodash';

const { Schema } = mongoose;

const DishSchema = new Schema({
  dishId: {
    // ID блюда
    type: Number,
    required: true,
  },
  categoryId: {
    // ID категории, к котрой относится блюдо
    type: Number,
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
    required: true,
  },
  image: {
    // Ссылка на изображение
    type: String,
    required: true,
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
  active: {
    // Доступно ли блюдо (нет - удалить из бд)
    type: Boolean,
    required: true,
  },
  createdAt: {
    // Дата создания (мс)
    type: Number,
    required: true,
  },
  updatedAt: {
    // Дата обновления (мс)
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

DishSchema.methods.toJSON = function () {
  return _.pick(this, ['dishId', 'categoryId', 'dishName', 'description', 'image', 'oldPrice', 'price', 'rating', 'likes', 'active', 'createdAt', 'updatedAt']);
};

export default mongoose.model('Dish', DishSchema);