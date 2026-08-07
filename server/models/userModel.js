import { Schema, model } from 'mongoose'

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    firstName: {
      type: String,
      trim: true,
      default: ''
    },

    lastName: {
      type: String,
      trim: true,
      default: ''
    },

    jobTitle: {
      type: String,
      trim: true,
      default: ''
    },

    onboardingCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const User = model('User', userSchema)

export default User