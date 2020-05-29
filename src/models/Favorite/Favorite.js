import mongoose from 'mongoose';
import _ from 'lodash';

const { Schema } = mongoose;

const FavoriteSchema = new Schema({
  userId: {
    // ID пользователя
    type: String,
    required: true,
  },
  dishId: {
    // ID блюда
    type: String,
    required: true,
  },
  favorite: {
    // Добавлено ли в избранное
    type: Boolean,
    required: true,
  },
}, {
  timestamps: true,
});

FavoriteSchema.methods.toJSON = function () {
  return _.pick(this, ['userId', 'dishId', 'favorite']);
};

export default mongoose.model('Favourite', FavoriteSchema);