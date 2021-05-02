const File = require("../models/file")
const Course = require("../models/course")
const mongoose = require("mongoose")
const base64url = require("base64url")
const { v4 } = require("uuid")
const { format } = require("util")
const mime = require("mime-types")
// const PDFParser = require("pdf2json")
// const pdf = new PDFParser()
// const pdf = require("pdf-parse")
const { PdfReader } = require("pdfReader")

const salt_rounds = 12

const path = require("path")
const serviceKey = path.join(__dirname, "../keys.json")

const { Storage } = require("@google-cloud/storage")
const vision = require("@google-cloud/vision")
const client = new vision.ImageAnnotatorClient({
  keyFilename: serviceKey,
  projectId: "apt-bonbon-242018",
})

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
      `${course}-${_id.toHexString()}-${req.file.originalname.replace(
        / /g,
        "_"
      )}`
    )

    const mimeType = mime.lookup(req.file.originalname)

    const blobStream = blob.createWriteStream()

    blobStream.on("error", (err) => {
      req.error = err
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
        mime: mimeType,
        // contents:
      })

      req.user.contributions.push(_id)
      await req.user.save()

      const courseToAddTo = await Course.findOne({
        name: course,
      })

      courseToAddTo.files.push(_id)
      await courseToAddTo.save()

      if (mimeType === "application/pdf") {
        let rows = {} // indexed by y-position
        let text = ""
        let pages = []

        function printRows() {
          Object.keys(rows) // => array of y-positions (type: float)
            .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
            .forEach((y) => (text += (rows[y] || []).join(" ")))
        }

        new PdfReader().parseBuffer(req.file.buffer, async (e, data) => {
          if (e) {
            req.error = e
            next()
          }
          // console.log(e)
          if (!data || (data && data.page)) {
            // end of file, or page
            printRows()
            // console.log("PAGE:", data.page)
            pages.push(text)
            text = ""
            rows = {} // clear rows for next page
          } else if (data.text) {
            // accumulate text datas into rows object, per line
            ;(rows[data.y] = rows[data.y] || []).push(data.text)
          }
          file.contents = pages
          await file.save(async (error, result) => {
            if (error) {
              req.error = error
            }
            req.savedFile = result
            next()
          })
        })
      } else {
        // file is image

        // Performs text detection on the gcs file
        const [result] = await client.textDetection(
          `gs://${bucket.name}/${blob.name}`
        )
        const detections = result.textAnnotations

        file.contents = detections
          .map((detection) => detection.description)
          .join(" ")

        console.log(file)

        await file.save(async (error, result) => {
          if (error) {
            req.error = error
          }
          req.savedFile = result
          next()
        })
      }
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
