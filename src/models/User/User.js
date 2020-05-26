import mongoose from 'mongoose';
import _ from 'lodash';

const { Schema } = mongoose;

const UserSchema = new Schema({
  userId: {
    // ID пользователя
    type: Number,
    required: true,
  },
  firstName: {
    // Имя пользователя
    type: String,
    required: true,
  },
  lastName: {
    // Фамилия пользователя
    type: String,
    required: true,
  },
  email: {
    // E-mail
    type: String,
    required: true,
    unique: true,
  },
  password: {
    // Пароль
    type: String,
    required: true,
  },
  accessToken: {
    // Токен доступа
    type: String,
    required: true,
  },  
  refreshToken: {
    // Токен восстановления
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

UserSchema.methods.toJSON = function () {
  return _.pick(this, ['userId', 'firstName', 'lastName', 'email', 'password', 'accessToken', 'refreshToken']);
};

export default mongoose.model('User', UserSchema);