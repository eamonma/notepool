import React, { useState, useContext, useCallback, Fragment } from "react"
import { useDropzone } from "react-dropzone"
// import Select from "react-select"
import Dropdown from "react-dropdown"
import "react-dropdown/style.css"

import axios from "axios"
import { AppContext } from "../AppContext"
import s from "../styles/upload.module.scss"
import ClipLoader from "./ClipLoader"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowCircleRight,
  faUpload,
  faFileUpload,
} from "@fortawesome/free-solid-svg-icons"
import { withRouter } from "react-router-dom"
import { css } from "@emotion/react"

const Upload = () => {
  const [user] = useContext(AppContext).user
  const options = user.listOfCourses.map((course) => ({
    value: course,
    label: course,
  }))
  const [course, setCourse] = useState(null)

  const [title, setTitle] = useState("")
  const [file, setFile] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  console.log(file)

  const onDrop = useCallback((acceptedFile) => {
    console.log(acceptedFile)
    setFile(acceptedFile)
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    const formData = new FormData()
    formData.append("title", title)
    formData.append("course", course.value)
    formData.append("file", file[0])

    axios
      .post("/api/files", formData)
      .then((res) => {
        setLoading(false)
        console.log(res.data)
      })
      .catch((error) => {
        setError(true)
        setLoading(false)
      })
  }

  return (
    <div className={`${s.Upload} form component`}>
      <form onSubmit={handleSubmit}>
        <h1>Contribute as {user.name && user.name.username}</h1>
        <div className={`${s.top}`}>
          <div className={s.selector}>
            <label htmlFor="course">Course</label>
            <Dropdown
              value={course}
              onChange={setCourse}
              options={options}
              isDisabled={loading}
              isSearchable={false}
              // styles={customStyles}
              className={s.selectComponent}
            />
          </div>
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
        </div>

        <div className={s.drop} {...getRootProps()}>
          <input {...getInputProps()} />
          {file && file[0] ? (
            <p>{file[0].name}</p>
          ) : isDragActive ? (
            <p>Drop the file here ...</p>
          ) : (
            <p>
              <FontAwesomeIcon icon={faUpload} /> Drag 'n' drop a file here, or
              click to select a file
            </p>
          )}
        </div>
        {
          // <label htmlFor="file" className="fileUpload">
          //   File
          // </label>
          // <input type="file" name="file" id="file" />
        }
        <div className="submit-group">
          <span></span>
          <div className={`${error && "wrong"} loading-group special`}>
            <button
              disabled={loading || !(file && file[0]) || !course || !title}
              type="submit"
            >
              <span className="text">Upload</span>
              <div className="right-shape">
                {loading ? (
                  <ClipLoader loading={true} />
                ) : (
                  <FontAwesomeIcon icon={faFileUpload} />
                )}
              </div>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default withRouter(Upload)
