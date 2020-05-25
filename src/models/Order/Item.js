import mongoose from 'mongoose';
import _ from 'lodash';

const { Schema } = mongoose;

const ItemSchema = new Schema({
  dishId: {
    // ID блюда, опционально
    type: Number,
  },
  name: {
    // Название блюда
    type: String,
    required: true,
  },
  image: {
    // Ссылка на изображение
    type: String,
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
  return _.pick(this, ['dishId', 'name', 'image', 'amount', 'price']);
};

export default mongoose.model('Item', ItemSchema);