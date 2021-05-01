import React, { useState } from "react"

const Upload = () => {
  const [title, setTitle] = useState("")
  const [course, setCourse] = useState("")
  const [file, setFile] = useState(null)

  return (
    <div>
      <h1>Upload</h1>
      <form action="http://localhost:4000/api/upload" method="POST">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          value={title}
          onChange={({ target }) => {
            setTitle(target.value)
          }}
        />

        <label htmlFor="course">Course</label>
        <input
          type="text"
          name="course"
          onChange={({ target }) => {
            setCourse(target.value)
          }}
        />

        <label htmlFor="file" className="fileUpload">
          File
        </label>
        <input type="file" name="file" id="file" />

        <button type="submit">Upload</button>
      </form>
    </div>
  )
}

export default Upload
