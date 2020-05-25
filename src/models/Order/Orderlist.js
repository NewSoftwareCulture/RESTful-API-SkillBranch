import mongoose from 'mongoose';
import _ from 'lodash';

const { Schema } = mongoose;

const OrderListSchema = new Schema({
  userId: {
    // ID пользователя
    type: Number,
    required: true,
  },
  orderId: {
    // ID заказа
    type: Number,
    required: true,
  },
  total: {
    // Стоимость заказа
    type: Number,
    required: true,
  },
  address: {
    // Адрес
    type: String,
    required: true,
  },
  statusId: {
    // ID статуса заказа
    type: String,
    required: true,
  },
  active: {
    // Доступен ли заказ (нет - удалить из бд)
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
  items: {
    // Список блюд
    type: Array,
    required: true,
  },
}, {
  timestamps: true,
});

OrderListSchema.methods.toJSON = function () {
  return _.pick(this, ['userId', 'orderId', 'total', 'address', 'statusId', 'active', 'createdAt', 'updatedAt', 'items']);
};

export default mongoose.model('OrderList', OrderListSchema);