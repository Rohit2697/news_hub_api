import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'

import { IUser } from "../../interface";

const UserSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
})

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

const User = mongoose.model<IUser>('User', UserSchema)
export default User