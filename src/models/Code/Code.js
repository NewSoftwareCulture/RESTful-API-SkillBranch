import mongoose from 'mongoose';
import _ from 'lodash';

const { Schema } = mongoose;

const CodeSchema = new Schema({
  email: {
    // Email пользователя
    type: String,
    required: true,
  },
  code: {
    type: String,
  },
  time: {
    // время последнего кода (мс)
    type: String,
  },
}, {
  timestamps: true,
});

CodeSchema.methods.toJSON = function () {
  return _.pick(this, ['email', 'time']);
};

export default mongoose.model('Code', CodeSchema);