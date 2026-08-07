import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '2h'
    }
  )
}

export const signup = async (req, res) => {
  try {
    const {
      email,
      password,
      confirmPassword
    } = req.body

    // Required fields
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        message: 'All fields are required'
      })
    }

    // Password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Passwords do not match'
      })
    }

    // Password length
    if (password.length < 8) {
      return res.status(400).json({
        message: 'Use at least 8 characters'
      })
    }

    // Uppercase
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        message: 'Use at least 1 uppercase'
      })
    }

    // Number
    if (!/\d/.test(password)) {
      return res.status(400).json({
        message: 'Use at least 1 number'
      })
    }

    // Special character
    if (!/[\W_]/.test(password)) {
      return res.status(400).json({
        message: 'Use at least 1 special character'
      })
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: 'Email is already registered'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      12
    )

    // Create user
    const newUser = new User({
      email,
      password: hashedPassword,
      onboardingCompleted: false
    })

    await newUser.save()

    // Signup does NOT authenticate the user
    res.status(201).json({
      message: 'Signup successful'
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'All fields are required'
      })
    }

    const existingUser = await User.findOne({ email })

    if (!existingUser) {
      return res.status(401).json({
        message: 'Invalid credentials'
      })
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    )

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials'
      })
    }

    const token = generateToken(existingUser)

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: existingUser._id,
        email: existingUser.email,
        onboardingCompleted:
          existingUser.onboardingCompleted
      }
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.status(200).json({
      user
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const logout = async (req, res) => {
  try {
    res.status(200).json({
      message: 'Logout successful'
    })
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong'
    })
  }
}