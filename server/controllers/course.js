const Course = require("../models/course")
const mongoose = require("mongoose")

// crud course

const methods = {
  /*
   * create
   *
   * call as middleware with course create route
   * deconstruct information from request, then create new course
   * save course to req object
   */
  async create(req, res, next) {
    try {
      const { name } = req.body
      if (name === "create") {
        throw new Error("The course must not be named create.")
      }
      const course = new Course({
        _id: new mongoose.Types.ObjectId(),
        name,
      })
      req.course = await course.save()
    } catch (error) {
      req.error = error
    }
    next()
  },
  /*
   * get
   *
   * call as middleware with course get route
   * deconstruct information from request, then get course
   * save course and teacher to req object
   */
  async get(req, res, next) {
    const { name } = req.params
    if (name) {
      try {
        req.course = await Course.findOne({
          name: name,
        })
      } catch (error) {
        req.error = error
      }
    } else {
      req.error = "Not good"
    }
    next()
  },
  async getAll(req, res, next) {
    try {
      req.courses = await Course.find({})
    } catch (error) {
      req.error = error
    }
    next()
  },
  async join(req, res, next) {
    const { course } = req.body
    try {
      const courseExists = await Course.findOne({
        name: course,
      })
      if (courseExists) {
        req.user.listOfCourses.push(course)
        await req.user.save()
      } else req.erorr = "Course does not exist"
    } catch (error) {
      req.error = error
    }
    next()
  },
  /*
   * update
   *
   * call as middleware with course update route
   */
  async update(req, res, next) {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["info", "resources"]
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    )

    if (!isValidOperation) {
      req.error = "Invalid updates"
      next()
    }

    try {
      updates.forEach((update) => {
        if (update === "info") {
          const infoUpdates = Object.keys(req.body.info)
          return infoUpdates.forEach(async (infoUpdate) => {
            switch (infoUpdate) {
              case "formatName":
              case "ownerWithName":
                throw new Error(`Cannot update ${infoUpdate}`)
                break
              case "name":
                // update teacher's list of courses
                const index = req.teacher.listOfCourses.findIndex(
                  (course) => course.formatName === req.params.course
                )

                req.teacher.listOfCourses[index].name = req.body.info.name
                req.course.info[infoUpdate] = req.body.info[infoUpdate]
                await req.teacher.save()
              case "blocks":
                // remove blocks from assessment dates
                const { blocks } = req.body.info
                req.course.assessments.forEach((assessment) => {
                  assessment.dates = assessment.dates.filter((date) => {
                    return blocks.includes(date.block)
                  })
                })
            }
            req.course.info[infoUpdate] = req.body.info[infoUpdate]
          })
        }
        req.course[update] = req.body[update]
      })

      await req.course.save()
    } catch (error) {
      req.error = error
    }
    next()
  },
  /*
   * delete
   *
   * call as middleware with course delete route, after assessment remove all
   */

  async delete(req, res, next) {
    try {
      req.teacher.listOfCourses = req.teacher.listOfCourses.filter(
        (course) => course.formatName !== req.course.info.formatName
      )
      await req.teacher.save()
      await req.course.remove()
    } catch (error) {
      req.error = error
    }
    next()
  },
}

module.exports = methods
