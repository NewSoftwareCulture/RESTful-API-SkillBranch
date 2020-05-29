import mongoose from 'mongoose';
import _ from 'lodash';

const { Schema } = mongoose;

const OrderSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    // ID пользователя
    type: String,
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
  entrance: {
    // Номер подъезда, опционально
    type: Number,
  },
  floor: {
    // Номер этажа, опционально
    type: Number,
  },
  apartment: {
    // Номер квартиры, опционально
    type: String,
  },
  intercom: {
    // Домофон, опционально
    type: String,
  },
  comment: {
    // Комментарий, опционально
    type: String,
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
  completed: {
    // Выполнен ли заказ
    type: Boolean,
    required: true,
  },
  items: {
    // Список блюд
    type: Array,
  },
}, {
  timestamps: true,
});

OrderSchema.methods.toJSON = function () {
  return _.pick(this, ['orderId','userId', 'total', 'address', 'entrance', 'floor', 'apartment', 'intercom', 'comment', 'statusId', 'active', 'comlited', 'items']);
};

export default mongoose.model('Order', OrderSchema);