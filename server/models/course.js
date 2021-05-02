const mongoose = require("mongoose")
const User = require("./user").UserSchema
const uniqueValidator = require("mongoose-unique-validator")

const CourseSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
  ],
})

CourseSchema.plugin(uniqueValidator)

const CourseModel = mongoose.model("Course", CourseSchema)

module.exports = CourseModel
