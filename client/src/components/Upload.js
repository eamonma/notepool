import React, { useState, useContext, useCallback, useEffect } from "react"
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
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons"
import { withRouter, useHistory } from "react-router-dom"

import Viewer, { Worker } from "@phuocng/react-pdf-viewer"

import "@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css"

const Upload = () => {
  const history = useHistory()
  const [user] = useContext(AppContext).user
  const options = user.listOfCourses.map((course) => ({
    value: course,
    label: course,
  }))
  const [course, setCourse] = useState(null)

  const [title, setTitle] = useState("")
  const [file, setFile] = useState(null)
  const [fileArray, setFileArray] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  // console.log(file && file.stream)

  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles)
    setFile(acceptedFiles)
    const reader = new FileReader()

    reader.onload = (e) => {
      let data = {}
      data.file = new Uint8Array(reader.result)
      setFileArray(data.file)
    }

    reader.readAsArrayBuffer(acceptedFiles[0])
  }, [])

  useEffect(() => {
    console.log()
  }, [file])

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
    formData.append("mime", file[0].type)

    axios
      .post("/api/files", formData)
      .then((res) => {
        setLoading(false)
        history.push(`/files/${res.data._id}`)
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
            <p>
              {file[0].name} : {Math.round(file[0].size / 1000)} KB
            </p>
          ) : isDragActive ? (
            <p>Drop the file here ...</p>
          ) : (
            <p>
              <FontAwesomeIcon
                style={{
                  marginRight: "8px",
                }}
                icon={faFilePdf}
              />
              Drag and drop your file
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
      <div className={s.iframe}>
        {fileArray && file[0].type === "application/pdf" ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.min.js">
            <div style={{ height: window.innerHeight - 60 }}>
              <Viewer fileUrl={fileArray} />
            </div>
          </Worker>
        ) : (
          fileArray &&
          file[0].type &&
          file[0].type.includes("image") && (
            <div
              style={{
                height: window.innerHeight - 60,
                // display: "flex",
              }}
            >
              <img
                src={URL.createObjectURL(
                  new Blob([fileArray.buffer], { type: file[0].type } /* (1) */)
                )}
              />
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default withRouter(Upload)
