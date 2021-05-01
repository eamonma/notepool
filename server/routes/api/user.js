const router = require("express").Router()
const user = require("../../controllers/user")
const auth = require("../../middleware/auth")

const handleError = (res, error, HTTPStatusCode) => {
  if (error) {
    res.status(HTTPStatusCode).send({
      error: error.toString(),
    })
  }
}

const senduserAndToken = (req, res) => {
  res.send({
    user: req.user,
    token: req.token,
  })
}

router
  //   .head("/:username", user.head, (req, res) => {
  //     res.sendStatus(req.userStatus)
  //   })
  // .head("/email/:email", user.emailHead, (req, res) => {
  //   res.sendStatus(req.userStatus)
  // })
  .get("/:username", user.get, (req, res) => {
    if (req.error) {
      return handleError(res, req.error, 401) // unauthorized
    }

    res.send({
      user: req.user,
    })
  })
  .patch("/me", auth, user.update, (req, res) => {
    if (req.error) {
      return handleError(res, req.error, 401) // unauthorized
    }

    res.send({
      user: req.user,
    })
  })
  .post("/login", user.login, (req, res) => {
    if (req.error) {
      return handleError(res, req.error, 401) // unauthorized
    }

    senduserAndToken(req, res)
  })
  .post("/isValidToken", auth, (req, res) => {
    if (req.user) {
      res.sendStatus(200)
    }
  })
  .post("/register", user.create, (req, res) => {
    if (req.error) {
      return handleError(res, req.error, 400) // bad request
    }

    senduserAndToken(req, res)
  })
  // Forgot Password
  .post("/forgotPassword", user.forgotPassword, (req, res) => {
    res.sendStatus(200)
  })
  .post("/reset/:id/:token", user.resetPassword, (req, res) => {
    if (req.error) {
      return handleError(res, req.error, 400) // bad request
    }

    res.sendStatus(200)
  })
  .post("/logout", auth, user.logout, (req, res) => {
    if (req.error) {
      return handleError(res, req.error, 500) // internal server error
    }

    res.sendStatus(200)
  })
  .post("/logoutAll", auth, user.logoutAll, (req, res) => {
    if (req.error) {
      return handleError(res, req.error, 500) // internal server error
    }

    res.sendStatus(200)
  })
  .delete("/delete", auth, user.delete, (req, res) => {
    if (req.error) {
      return handleError(res, req.error, 500) // internal server error
    }

    res.sendStatus(200)
  })

module.exports = router
