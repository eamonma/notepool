import React, { useState, useContext } from "react"
import axios from "axios"
import { AppContext } from "../AppContext"

const Upload = () => {
  const [user] = useContext(AppContext).user
  const [title, setTitle] = useState("")
  const [course, setCourse] = useState("")
  const [file, setFile] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    // axios
    //   .post("/api/upload", {
    //     email,
    //     password,
    //   })
    //   .then((res) => {
    //     const { user, token } = res.data
    //     props.authenticate(user, token)
    //   })
    //   .catch((error) => {
    //     setError(true)
    //     setLoading(false)
    //   })
  }

  return (
    <div className="form component">
      <h1>Contribute as {user.name && user.name.username}</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex-row">
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={({ target }) => {
                setTitle(target.value)
              }}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="course">Course</label>
            <input
              type="text"
              name="course"
              onChange={({ target }) => {
                setCourse(target.value)
              }}
              disabled={loading}
            />
          </div>
        </div>

        <label htmlFor="file" className="fileUpload">
          File
        </label>
        <input type="file" name="file" id="file" />

        <button disabled={loading} type="submit">
          Upload
        </button>
      </form>
    </div>
  )
}

export default Upload
