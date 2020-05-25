import mongoose from 'mongoose';
import _ from 'lodash';

const { Schema } = mongoose;

const StatusSchema = new Schema({
  statusId: {
    // ID статуса заказа
    type: Number,
    required: true,
  },
  name: {
    // Статус
    type: String,
    required: true,
  },
  completed: {
    // Выполнен ли заказ
    type: Boolean,
    required: true,
  },
  cancelable: {
    // Возможно ли отменить заказ
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
}, {
  timestamps: true,
});

StatusSchema.methods.toJSON = function () {
  return _.pick(this, ['statusId', 'name', 'completed', 'cancelable', 'active', 'createdAt', 'updatedAt']);
};

export default mongoose.model('Status', StatusSchema);