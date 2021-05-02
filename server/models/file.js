const mongoose = require("mongoose")
const validator = require("validator")
const uniqueValidator = require("mongoose-unique-validator")
const Course = require("./course")
const User = require("./user").User
const mime = require("mime-types")
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
    type: String,
    ref: "Course",
    required: true,
  },
  author: {
    type: String,
    ref: "User",
    require: true,
  },
  url: {
    type: String,
    required: true,
  },
  contents: {
    type: Array,
  },
  mime: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const File = mongoose.model("File", FileSchema)

module.exports = File
