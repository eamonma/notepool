import React, { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

const Course = (props) => {
  const [course, setCourse] = useState({})
  useEffect(() => {
    axios.get(`/api/courses/${props.match.params.course}`).then((course) => {
      if (course.data) {
        setCourse(course.data)
      }
    })
  }, [])
  return (
    <div className="form component">
      <h1>{course.name}</h1>
      <ul>
        {course &&
          course.files &&
          course.files.map((file) => (
            <li>
              <Link to={`/files/${file._id}`}>
                {file.title} --- {file._id}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default Course
