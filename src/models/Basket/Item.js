import mongoose from 'mongoose';
import _ from 'lodash';

const { Schema } = mongoose;

const ItemSchema = new Schema({
  dishId: {
    // ID блюда
    type: Number,
    required: true,
  },
  amount: {
    // Количество
    type: Number,
    required: true,
  },
  price: {
    // Стоимость (с учетом количества)
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

ItemSchema.methods.toJSON = function () {
  return _.pick(this, ['dishId', 'amount', 'price']);
};

export default mongoose.model('Item', ItemSchema);