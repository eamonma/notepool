import React, { Component, Fragment, useState, useEffect } from "react"
import axios from "axios"

const Join = (props) => {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    axios
      .get("/api/courses/all")
      .then((res) => {
        setCourses(res.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <div className="component">
      <h1>Join a course</h1>
      <ul>
        {courses.map((course) => (
          <li key={course._id}>{course.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default Join
