import mongoose from 'mongoose';
import _ from 'lodash';

const { Schema } = mongoose;

const PromoSchema = new Schema({
  promocode: {
    // Название промокода
    type: String,
    required: true,
    unique: true,
  },
  promotext: {
    // Текст промокода
    type: String,
  },
}, {
  timestamps: true,
});

PromoSchema.methods.toJSON = function () {
  return _.pick(this, ['promocode', 'promotext']);
};

export default mongoose.model('Promo', PromoSchema);