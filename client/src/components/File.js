import React, { useEffect, useState, useRef } from "react"
import axios from "axios"
// import { Document, Page } from "react-pdf/dist/esm/entry.webpack"
// import { Document, Page } from "react-pdf/dist/umd/entry.webpack"
import { usePdf } from "@mikecousins/react-pdf"
import { Link } from "react-router-dom"
import s from "../styles/file.module.scss"

const File = (props) => {
  useEffect(() => {
    axios.get(`/api/files/${props.match.params.file}`).then((file) => {
      if (file.data) {
        setFile(file.data)
      }
    })
  }, [])

  const [file, setFile] = useState({})
  return (
    <div className={`${s.File} component`}>
      <div className={s.heading}>
        <Link to={`/courses/${file.course}`}>{file.course}</Link>
        <h1>
          <a href={file.url}>{file.title}</a>
        </h1>
      </div>
      <iframe frameBorder="0" className={s.iframe} src={file.url} />
    </div>
  )
}

export default File
