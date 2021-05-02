const router = require("express").Router()
const file = require("../../controllers/file")
const multer = require("multer")
const auth = require("../../middleware/auth")

const handleError = (res, error, HTTPStatusCode) => {
  if (error) {
    res.status(HTTPStatusCode).send({
      error: error.toString(),
    })
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // maximum 50mb files
  },
})

router
  .post("/", auth, upload.single("file"), file.create, (req, res) => {
    if (req.error) {
      return handleError(res, req.error, 401) // unauthorized
    }

    res.send(req.savedFile)
    // res.send(req.publicUrl)
  })
  .get("/:id", file.get, (req, res) => {
    if (req.error) {
      return handleError(res, req.error, 400) // unauthorized
    }
    if (req.foundFile) {
      res.send(req.foundFile)
    }
  })

module.exports = router
