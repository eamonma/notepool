const File = require("../models/file")
const mongoose = require("mongoose")
const base64url = require("base64url")
const { v4 } = require("uuid")
const { format } = require("util")

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

    const blob = bucket.file(`${v4()}-${req.file.originalname}`)
    const blobStream = blob.createWriteStream()

    blobStream.on("error", (err) => {
      next(err)
    })

    blobStream.on("finish", () => {
      // The public URL can be used to directly access the file via HTTP.
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      )
      req.publicUrl = publicUrl
      const file = File({
        _id: new mongoose.Types.ObjectId(),
        title,
        course,
        url: req.publicUrl,
        author: req.user.username,
      })

      file.save(async (error, result) => {
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
  // only 1 file, so no deleteAll.
}

module.exports = methods
