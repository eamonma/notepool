const User = require("../models/user")
const mongoose = require("mongoose")
const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const base64url = require("base64url")
const salt_rounds = 12

methods = {
  /*
   * create
   *
   * call as middleware with user registration route
   * deconstruct information from request, then create new user
   * save token and user to req object
   */
  async create(req, res, next) {
    const { firstName, lastName, username, email, password } = req.body
    switch (username) {
      case "me":
      case "courses":
        req.error = `name cannot be ${username}`
        next()
    }
    const user = User({
      _id: new mongoose.Types.ObjectId(),
      name: {
        firstName,
        lastName,
        username,
      },
      email,
      password,
    })
    console.log(user)
    user.save(async (error, result) => {
      if (error) {
        req.error = error
      } else {
        const obj = await result.generateAuthToken() // as function returns both
        req.token = obj.token
        req.user = obj.user
      }
      next()
    })
  },
  async head(req, res, next) {
    const userNo = await User.find({
      "name.user": req.params.username,
    }).countDocuments()
    req.userStatus = !!userNo ? 200 : 404
    next()
  },
  async emailHead(req, res, next) {
    const userNo = await User.find({
      email: req.params.email,
    }).countDocuments()
    req.userStatus = !!userNo ? 200 : 404
    next()
  },
  async get(req, res, next) {
    try {
      const username =
        req.params.username ||
        req.get("host").match(/\w+/)[0].trim().toLowerCase() ||
        req.params.username
      req.user = await User.findOne({
        "name.username": username,
      })
      console.log(req.user)
      // .populate({
      //   path: "courses",
      // })
      // .execPopulate()
      //   req.courses = req.user.courses
    } catch (error) {
      req.error = error
    }
    next()
  },
  /*
   * login
   *
   * call as middleware with user login route
   * deconstruct information form request, then find by credentials
   * save token and user to req object
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const user = await User.findByCredentials(email, password)
      user.lastLogin = Date.now()
      req.user = user
      const obj = await user.generateAuthToken()
      req.token = obj.token

      await user.save()
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
            if (nameUpdate === "username") {
              throw new Error("Display name cannot be updated.")
            }
            req.user.name[nameUpdate] = req.body.name[nameUpdate]
          })
        }
        req.user[update] = req.body[update]
      })
      await req.user.save()
    } catch (error) {
      req.error = error
    }
    next()
  },
  async updatePassword(req, res, next) {},
  async forgotPassword(req, res, next) {
    const user = User.findOne({
      email: req.body.email,
    })
      .then(async (user) => {
        if (!user.resetToken) {
          const id = Buffer.from(user._id.toString()).toString("base64")
          const token = base64url(crypto.randomBytes(256))

          user.resetToken = Buffer.from(
            await bcrypt.hash(token, salt_rounds)
          ).toString()

          await user.save()
          setTimeout(async () => {
            user.resetToken = ""
            await user.save()
          }, 900000)

          req.location = `reset/${id}/${token}`

          //   const msg = {
          //     to: user.email,
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

          await user.save()
        }
      })
      .catch((error) => {})
      .finally(() => {
        next()
      })
  },
  async resetPassword(req, res, next) {
    const id = Buffer.from(req.params.id, "base64").toString()
    const user = await User.findById(id)
    const isMatch = await bcrypt.compare(req.params.token, user.resetToken)

    if (!isMatch) {
      req.error = "Invalid token"
    } else {
      user.password = req.body.password
      user.tokens = []
      user.resetToken = ""
      req.user = await user.save()
    }

    next()
  },
  /*
   * logout
   *
   * call as middleware with user logout route
   * remove matching token
   */
  async logout(req, res, next) {
    console.log("logging out")
    try {
      req.user.tokens = req.user.tokens.filter(
        (token) => token.token !== req.token
      )
      await req.user.save()
    } catch (error) {
      req.error = error
    }
    next()
  },
  /*
   * logoutAll
   *
   * call as middleware with user logout all route
   * remove all tokens
   */
  async logoutAll(req, res, next) {
    try {
      req.user.tokens = []
      await req.user.save()
    } catch (error) {
      req.error = error
    }
    next()
  },
  /*
   * delete
   *
   * call as middleware with user delete route
   * remove user
   */
  async delete(req, res, next) {
    try {
      await req.user.remove()
    } catch (error) {
      req.error = error
    }
    next()
  },
  // only 1 user, so no deleteAll.
}

module.exports = methods
