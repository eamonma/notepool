const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const multer = require("multer")
const upload = multer()

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

app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file)
  console.log(req.body)
  res.sendStatus(200)
})

app.listen(PORT, () => {
  console.log(`Server up on ${PORT}`)
})
