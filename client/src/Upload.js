import React, { useState } from "react"

const Upload = () => {
  const [title, setTitle] = useState("")
  const [course, setCourse] = useState("")

  return (
    <div>
      <h1>Upload</h1>
      <form action="/upload" method="POST">
        <label htmlFor="title">Title</label>
        <input type="text" name="title" />
        <label htmlFor="course">Course</label>
        <input type="text" name="course" />
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
