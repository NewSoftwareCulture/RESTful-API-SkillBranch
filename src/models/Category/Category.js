import mongoose from 'mongoose';
import _ from 'lodash';

const { Schema } = mongoose;

const CategorySchema = new Schema({
  categoryId: { 
    // ID категории
    type: String,
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
    type: String,
  },
  active: {
    // Доступна ли категория (нет - удалить из бд)
    type: Boolean,
    required: true,
  },
}, {
  timestamps: true,
});

CategorySchema.methods.toJSON = function () {
  return _.pick(this, ['categoryId', 'name', 'order', 'icon', 'parent', 'active']);
};

export default mongoose.model('Category', CategorySchema);