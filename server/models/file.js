const mongoose = require("mongoose")
const validator = require("validator")
const uniqueValidator = require("mongoose-unique-validator")
const Course = require("./course")
const User = require("./user")
// password imports
const salt_rounds = 12
const jwt = require("jsonwebtoken")

const FileSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
    trim: true,
  },
  course: {
    type: Course,
    required: true,
  },
  author: {
    type: User,
    require: true,
  },
  url: {
    type: String,
    required: true,
  },
})

// // reference courses in virtual
// FileSchema.virtual("courses", {
//   ref: "Course",
//   localField: "name.username",
//   foreignField: "owner",
// })

const File = mongoose.model("File", FileSchema)

module.exports = File
