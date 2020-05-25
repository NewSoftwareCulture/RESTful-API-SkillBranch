import mongoose from 'mongoose';
import _ from 'lodash';

const { Schema } = mongoose;

const CategorySchema = new Schema({
  categoryId: { 
    // ID категории
    type: Number,
    required: true,
  },
  name: {
    // Название категории
    type: String,
    required: true,
  },
  order: {
    // Номер по порядку
    type: Number,
    required: true,
  },
  icon: {
    // Ссылка на иконку, опционально
    type: String,
  },
  parent: {
    // ID родительской категории, опционально (если есть, то это подкатегория)
    type: Number,
  },
  active: {
    // Доступна ли категория (нет - удалить из бд)
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

CategorySchema.methods.toJSON = function () {
  return _.pick(this, ['categoryId', 'name', 'order', 'icon', 'parent', 'active', 'createdAt', 'updatedAt']);
};

export default mongoose.model('Category', CategorySchema);