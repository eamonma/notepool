import React, { useEffect, useState, useRef } from "react"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDownload, faShare } from "@fortawesome/free-solid-svg-icons"

import { Link } from "react-router-dom"
import s from "../styles/file.module.scss"

import Viewer, { Worker } from "@phuocng/react-pdf-viewer"

import "@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css"

const File = (props) => {
  useEffect(() => {
    axios.get(`/api/files/${props.match.params.file}`).then((file) => {
      if (file.data) {
        setFile(file.data)
      }
    })
  }, [])

  const [file, setFile] = useState({})
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  return (
    <div className={`${s.File} component`}>
      <div className={s.heading}>
        <Link to={`/courses/${file.course}`}>{file.course}</Link>
        <h1
          style={{
            margin: "8px 0",
          }}
        >
          <a href={file.url}>{file.title}</a>
        </h1>
        <h3
          style={{
            fontWeight: "normal",
            marginTop: "8px",
          }}
        >
          by {file.author}
        </h3>
        <div
          style={{
            marginTop: "20px",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            textAlign: "right",
          }}
          className="flex-row"
        >
          <a
            style={{
              textAlign: "right",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: "#eef5fc",
            }}
            href={file.url}
          >
            Download
            <FontAwesomeIcon
              style={{
                marginLeft: "6px",
              }}
              icon={faDownload}
            />
          </a>
        </div>
      </div>
      <div className={s.iframe}>
        {file && file.url && file.mime === "application/pdf" ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.min.js">
            <div style={{ height: window.innerHeight - 60 }}>
              <Viewer fileUrl={file.url} />
            </div>
          </Worker>
        ) : (
          file &&
          file.mime &&
          file.mime.includes("image") && <img src={file.url} />
        )}
      </div>
    </div>
  )
}

export default File
