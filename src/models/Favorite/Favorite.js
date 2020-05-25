import mongoose from 'mongoose';
import _ from 'lodash';

const { Schema } = mongoose;

const FavoriteSchema = new Schema({
  userId: {
    // ID пользователя
    type: Number,
    required: true,
  },
  dishId: {
    // ID блюда
    type: Number,
    required: true,
  },
  favorite: {
    // Добавлено ли в избранное
    type: Boolean,
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

FavoriteSchema.methods.toJSON = function () {
  return _.pick(this, ['userId', 'dishId', 'favorite', 'updatedAt']);
};

export default mongoose.model('Favourite', FavoriteSchema);