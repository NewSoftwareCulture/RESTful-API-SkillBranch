import mongoose from 'mongoose';
import _ from 'lodash';

const { Schema } = mongoose;

const OrderSchema = new Schema({
  userId: {
    // ID пользователя
    type: Number,
    required: true,
  },
  address: {
    // Адрес доставки
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
}, {
  timestamps: true,
});

OrderSchema.methods.toJSON = function () {
  return _.pick(this, ['userId', 'address', 'entrance', 'floor', 'apartment', 'intercom', 'comment']);
};

export default mongoose.model('Order', OrderSchema);