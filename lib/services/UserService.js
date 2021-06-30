import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export default class UserService {
  static async create({ username, password, profilePhotoUrl }) {
    const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
    console.log(passwordHash);
    return User.insert({ username, passwordHash, profilePhotoUrl });
  }
}
