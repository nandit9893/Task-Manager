import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
    index: true,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    trim: true,
    index: true,
    required: true,
  },
  company: {
    type: String,
    trim: true,
    index: true,
  },
  website: {
    type: String,
    trim: true,
    index: true,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
