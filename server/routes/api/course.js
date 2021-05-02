const Course = require("../../controllers/course")
const router = require("express").Router()
const auth = require("../../middleware/auth")

const handleError = (res, error, HTTPStatusCode) => {
  if (error) {
    res.status(HTTPStatusCode).send({
      error: error.toString(),
    })
  }
}

// root url is /api/courses

router
  .post("/join", auth, Course.join, (req, res) => {
    if (req.error) return handleError(res, req.error, 400)

    res.send(req.course)
  })
  // Create course
  .post("/", auth, Course.create, (req, res) => {
    if (req.error) {
      return handleError(res, req.error, 400) // bad request
    }
    // res.location(
    //   `${global.protocol}://${req.teacher.name.displayName}.${global.domain}/api/courses/${req.course.info.formatName}`
    // )
    res.send(req.course)
  })

  .get("/all", Course.getAll, (req, res) => {
    if (req.error) return handleError(res, req.error, 404) // not found

    console.log(req.courses)

    res.send(req.courses)
  })
  // R
  .get("/:name", Course.get, (req, res) => {
    if (req.error) return handleError(res, req.error, 404) // not found

    res.send(req.course)
  })

module.exports = router
