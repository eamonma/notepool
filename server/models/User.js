const mongoose = require("mongoose")
const validator = require("validator")
const uniqueValidator = require("mongoose-unique-validator")
// password imports
const bcrypt = require("bcryptjs")
const salt_rounds = 12
const jwt = require("jsonwebtoken")

const UserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  listOfCourses: [
    {
      name: {
        type: String,
      },
    },
  ],
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid")
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  resetToken: {
    type: String,
  },
  information: {
    type: mongoose.Schema.Types.Mixed,
  },
})

UserSchema.plugin(uniqueValidator)

// // reference courses in virtual
// UserSchema.virtual("courses", {
//   ref: "Course",
//   localField: "name.username",
//   foreignField: "owner",
// })

// delete sensitive data such as password and tokens before sending
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.__v

  return userObject
}

// find user, then verify password
UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({
    email,
  })
  if (!user) {
    throw new Error("Unable to login")
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error("Unable to login")
  }

  return user
}

// generate jwt with 1 week expiry, append to user instance
UserSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign(
    {
      username: user.name.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1 week",
    }
  )
  user.tokens = [
    ...user.tokens,
    {
      token,
    },
  ]
  await user.save()

  return {
    token,
    user,
  }
}

// hash password before save
UserSchema.pre("save", async function (next) {
  const user = this
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, salt_rounds)
    next()
  }
})

const User = mongoose.model("User", UserSchema)

module.exports = User
