require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { v4 } = require("uuid")

// const user = require("./controllers/user")
const userAPIRouter = require("./routes/api/user")
const fileAPIRouter = require("./routes/api/file")
const courseAPIRouter = require("./routes/api/course")

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

app.get("/", (req, res) => {
  res.sendStatus(200)
})

// app.post("/upload", upload.single("file"), (req, res, next) => {
//   if (!req.file) return res.status(400).send("No file uploaded.")

//   const blob = bucket.file(`${v4()}-${req.file.originalname}`)
//   const blobStream = blob.createWriteStream()

//   blobStream.on("error", (err) => {
//     next(err)
//   })

//   blobStream.on("finish", () => {
//     // The public URL can be used to directly access the file via HTTP.
//     const publicUrl = format(
//       `https://storage.googleapis.com/${bucket.name}/${blob.name}`
//     )
//     res.status(200).send(publicUrl)
//   })

//   blobStream.end(req.file.buffer)
// })

app.use("/api", userAPIRouter)
app.use("/api/files", fileAPIRouter)
app.use("/api/courses", courseAPIRouter)

app.listen(PORT, () => {
  console.log(`Server up on ${PORT}`)
})
