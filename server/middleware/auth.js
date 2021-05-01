const jwt = require("jsonwebtoken")
const Teacher = require("../models/teacher")

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "")
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const teacher = await Teacher.findOne({
      "name.displayName": decoded.displayName,
      "tokens.token": token,
    })

    if (!teacher) {
      throw new Error()
    }

    req.token = token
    req.teacher = teacher
    next()
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." })
  }
}

module.exports = auth
