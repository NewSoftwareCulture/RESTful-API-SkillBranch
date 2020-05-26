import mongoose from 'mongoose';
import _ from 'lodash';

const { Schema } = mongoose;

const CartSchema = new Schema({
  userId: {
    // ID пользователя
    type: Number,
    required: true,
  },
  promocode: {
    // Промокод, опционально
    type: String,
  },
  promotext: {
    // Текст промокода, опционально
    type: String,
  },
  total: {
    // Общая стоимость корзины
    type: Number,
    required: true,
  },
  items: {
    // Список блюд
    type: Array,
    required: true,
  },
}, {
  timestamps: true,
});

CartSchema.methods.toJSON = function () {
  return _.pick(this, ['userId', 'promocode', 'promotext', 'total', 'items']);
};

export default mongoose.model('Cart', CartSchema);