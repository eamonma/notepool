import React, { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import FilePreview from "./FilePreview"
import thumbnail from "../images/thumb.png"

const Course = (props) => {
  const [course, setCourse] = useState({})
  const [displayFiles, setDisplayFiles] = useState([])
  const [filter, setFilter] = useState("")

  useEffect(() => {
    axios.get(`/api/courses/${props.match.params.course}`).then((course) => {
      if (course.data) {
        setCourse(course.data)
        setDisplayFiles(
          course.data.files.map((file) => ({
            ...file,
            page: 1,
          }))
        )
      }
    })
  }, [])

  const handleFilter = (value) => {
    if (course && course.files) {
      setFilter(value.toLowerCase())
      const filesThatMatchFilter = course.files.map((file) => {
        const fileMatch = file.contents.map((page, pageNumber) => {
          if (page.toLowerCase().includes(value)) {
            return {
              page,
              pageNumber,
            }
          }
        })

        const filez = fileMatch.filter((file) => file)
        const page = filez[0] ? filez[0].pageNumber : -1

        return {
          page,
          ...file,
        }
      })
      setDisplayFiles(filesThatMatchFilter)
    }
  }

  return (
    <div className="form component">
      <h1>{course.name}</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
        style={{
          width: "800px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="search"
          value={filter}
          onChange={(e) => {
            handleFilter(e.target.value)
          }}
          autoFocus
          style={{
            width: "40%",
          }}
        />
      </form>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {course &&
          course.files &&
          displayFiles.map((file) => {
            if (file && file.page !== -1) {
              return (
                <li
                  style={{
                    margin: "12px",
                  }}
                  key={file._id}
                >
                  <FilePreview
                    image={thumbnail}
                    title={file.title}
                    course={course.name}
                    timestamp={new Date(file.createdAt).toLocaleDateString()}
                    to={`/files/${file._id}?page=${file.page}`}
                    from={file.author}
                  />
                </li>
              )
            }
          })}
      </ul>
    </div>
  )
}

export default Course

//{" "}
// <Link to={`/files/${file._id}?page=${file.page}`}>
// {file.title}-{file._id}
//{" "}
// </Link>
