const File = require("../models/file")
const Course = require("../models/course")
const mongoose = require("mongoose")
const base64url = require("base64url")
const { v4 } = require("uuid")
const { format } = require("util")
const mime = require("mime-types")

const salt_rounds = 12

const path = require("path")
const serviceKey = path.join(__dirname, "../keys.json")

const { Storage } = require("@google-cloud/storage")
const storage = new Storage({
  keyFilename: serviceKey,
  projectId: "apt-bonbon-242018",
})

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET)

methods = {
  /*
   * create
   *
   * call as middleware with file creation route
   * deconstruct information from request, then create new file
   */
  async create(req, res, next) {
    const { title, course } = req.body

    if (!req.file) return res.status(400).send("No file uploaded.")

    const _id = new mongoose.Types.ObjectId()

    const blob = bucket.file(
      `${course}-${_id.toHexString()}-${req.file.originalname}`
    )
    const blobStream = blob.createWriteStream()

    blobStream.on("error", (err) => {
      next(err)
    })

    blobStream.on("finish", async () => {
      // The public URL can be used to directly access the file via HTTP.
      const publicUrl = format(
        `https://${bucket.name}.storage.googleapis.com/${blob.name}`
      )

      req.publicUrl = publicUrl
      const file = File({
        _id,
        title,
        course,
        url: req.publicUrl,
        author: req.user.name.username,
        mime: mime.lookup(req.file.originalname),
      })

      req.user.contributions.push(_id)
      await req.user.save()

      const courseToAddTo = await Course.findOne({
        name: course,
      })

      courseToAddTo.files.push(_id)
      await courseToAddTo.save()

      await file.save(async (error, result) => {
        if (error) {
          req.error = error
        }
        next()
      })
    })

    blobStream.end(req.file.buffer)
  },
  /*
   * delete
   *
   * call as middleware with file delete route
   * remove file
   */
  async delete(req, res, next) {
    try {
      await req.file.remove()
    } catch (error) {
      req.error = error
    }
    next()
  },
  async get(req, res, next) {
    req.foundFile = await File.findById(req.params.id)
    next()
  },
  // only 1 file, so no deleteAll.
}

module.exports = methods
