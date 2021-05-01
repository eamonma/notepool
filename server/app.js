require("dotenv").config()
const { format } = require("util")
const express = require("express")
const cors = require("cors")
const multer = require("multer")
const { v4 } = require("uuid")

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // maximum 50mb files
  },
})

const path = require("path")
const serviceKey = path.join(__dirname, "./keys.json")

const { Storage } = require("@google-cloud/storage")
const storage = new Storage({
  keyFilename: serviceKey,
  projectId: "apt-bonbon-242018",
})

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET)

const app = express()

app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(express.json())
app.use(cors())

const dbConfig = require("./config/database.config")
const mongoose = require("mongoose")

mongoose
  .connect(dbConfig.url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the database")
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err)
    process.exit()
  })

global.protocol = process.env.PROTOCOL || "http"
global.domain = process.env.DOMAIN || "localhost"

const PORT = process.env.PORT || 4000

app.post("/upload", upload.single("file"), (req, res, next) => {
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
    res.status(200).send(publicUrl)
  })

  blobStream.end(req.file.buffer)
})

app.listen(PORT, () => {
  console.log(`Server up on ${PORT}`)
})
