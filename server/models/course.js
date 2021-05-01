const mongoose = require("mongoose")
const User = require("./user")
const uniqueValidator = require("mongoose-unique-validator")

const CourseSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  info: {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    archived: {
      type: String,
      required: false,
      default: "",
    },
  },
  files: [
    {
      title: {
        type: String,
        required: true,
      },
      author: {
        type: User,
        required: true,
      },
    },
  ],
})

CourseSchema.virtual("courses", {
  ref: "",
  localField: "name.username",
  foreignField: "owner",
})

CourseSchema.plugin(uniqueValidator)

const CourseModel = mongoose.model("Course", CourseSchema)

module.exports = CourseModel
