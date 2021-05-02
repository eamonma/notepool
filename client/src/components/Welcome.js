import React from "react"
import s from "../styles/welcome.module.scss"
import { Link } from "react-router-dom"

const Welcome = () => {
  return (
    <div className={s.Welcome}>
      <div className={s.left}>
        <h1>Welcome to Notepool</h1>
      </div>
      <div className={s.right}>
        <h2>A streamlined course-centric note sharing platform</h2>
        <p>
          Notepool saves students the stress and headache of scouring for help
          by making the resources you need accessible. Our platform stores the
          course-specific files that students can upload to help students like
          themselves. These files are then sorted and stored by university,
          course, and keywords found within the files themselves.
        </p>
        <Link to="/register">Join now</Link>
      </div>
    </div>
  )
}

export default Welcome
