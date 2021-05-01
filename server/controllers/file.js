const File = require("../models/file")
const mongoose = require("mongoose")
const base64url = require("base64url")
const salt_rounds = 12

methods = {
  /*
   * create
   *
   * call as middleware with file registration route
   * deconstruct information from request, then create new file
   * save token and file to req object
   */
  async create(req, res, next) {
    const { firstName, lastName, filename, email, password } = req.body
    switch (filename) {
      case "me":
      case "courses":
        req.error = `name cannot be ${filename}`
        next()
    }
    const file = File({
      _id: new mongoose.Types.ObjectId(),
      name: {
        firstName,
        lastName,
        filename,
      },
      email,
      password,
    })
    console.log(file)
    file.save(async (error, result) => {
      if (error) {
        req.error = error
      } else {
        const obj = await result.generateAuthToken() // as function returns both
        req.token = obj.token
        req.file = obj.file
      }
      next()
    })
  },
  async head(req, res, next) {
    const fileNo = await File.find({
      "name.file": req.params.filename,
    }).countDocuments()
    req.fileStatus = !!fileNo ? 200 : 404
    next()
  },
  async emailHead(req, res, next) {
    const fileNo = await File.find({
      email: req.params.email,
    }).countDocuments()
    req.fileStatus = !!fileNo ? 200 : 404
    next()
  },
  async get(req, res, next) {
    try {
      const filename =
        req.params.filename ||
        req.get("host").match(/\w+/)[0].trim().toLowerCase() ||
        req.params.filename
      req.file = await File.findOne({
        "name.filename": filename,
      })
      console.log(req.file)
      // .populate({
      //   path: "courses",
      // })
      // .execPopulate()
      //   req.courses = req.file.courses
    } catch (error) {
      req.error = error
    }
    next()
  },
  /*
   * login
   *
   * call as middleware with file login route
   * deconstruct information form request, then find by credentials
   * save token and file to req object
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const file = await File.findByCredentials(email, password)
      file.lastLogin = Date.now()
      req.file = file
      const obj = await file.generateAuthToken()
      req.token = obj.token

      await file.save()
    } catch (error) {
      req.error = error
    }
    next()
  },
  async update(req, res, next) {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "password"]
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    )

    if (!isValidOperation) {
      req.error = "Invalid updates"
      next()
    }

    try {
      updates.forEach((update) => {
        if (update === "name") {
          // becuase name is nested
          const nameUpdates = Object.keys(req.body.name)
          return nameUpdates.forEach((nameUpdate) => {
            if (nameUpdate === "filename") {
              throw new Error("Display name cannot be updated.")
            }
            req.file.name[nameUpdate] = req.body.name[nameUpdate]
          })
        }
        req.file[update] = req.body[update]
      })
      await req.file.save()
    } catch (error) {
      req.error = error
    }
    next()
  },
  async updatePassword(req, res, next) {},
  async forgotPassword(req, res, next) {
    const file = File.findOne({
      email: req.body.email,
    })
      .then(async (file) => {
        if (!file.resetToken) {
          const id = Buffer.from(file._id.toString()).toString("base64")
          const token = base64url(crypto.randomBytes(256))

          file.resetToken = Buffer.from(
            await bcrypt.hash(token, salt_rounds)
          ).toString()

          await file.save()
          setTimeout(async () => {
            file.resetToken = ""
            await file.save()
          }, 900000)

          req.location = `reset/${id}/${token}`

          //   const msg = {
          //     to: file.email,
          //     from: "",
          //     subject: "Password reset",
          //     // text: 'and easy to do anywhere, even with Node.js',
          //     html: `<h1>Password reset</h1>
          // 				<p>A password reset had been request for this email. If this wasn't you, ignore this email.</p>
          // 				<p>To reset your password, <a href="${global.protocol}://${global.domain}/#/${req.location}">click here</a>. This link expires in 15 minutes.</p>
          // 				<p>Or, if your email client doesn't support links, copy and paste the following link:
          // 				<pre>${global.protocol}://${global.domain}/#/${req.location}</pre>
          // 				</p>
          // 		`,
          //   }
          //   mail.send(msg)

          await file.save()
        }
      })
      .catch((error) => {})
      .finally(() => {
        next()
      })
  },
  async resetPassword(req, res, next) {
    const id = Buffer.from(req.params.id, "base64").toString()
    const file = await File.findById(id)
    const isMatch = await bcrypt.compare(req.params.token, file.resetToken)

    if (!isMatch) {
      req.error = "Invalid token"
    } else {
      file.password = req.body.password
      file.tokens = []
      file.resetToken = ""
      req.file = await file.save()
    }

    next()
  },
  /*
   * logout
   *
   * call as middleware with file logout route
   * remove matching token
   */
  async logout(req, res, next) {
    console.log("logging out")
    try {
      req.file.tokens = req.file.tokens.filter(
        (token) => token.token !== req.token
      )
      await req.file.save()
    } catch (error) {
      req.error = error
    }
    next()
  },
  /*
   * logoutAll
   *
   * call as middleware with file logout all route
   * remove all tokens
   */
  async logoutAll(req, res, next) {
    try {
      req.file.tokens = []
      await req.file.save()
    } catch (error) {
      req.error = error
    }
    next()
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
