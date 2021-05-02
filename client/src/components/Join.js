import React, {
  Component,
  Fragment,
  useState,
  useEffect,
  useContext,
} from "react"
import axios from "axios"
import s from "../styles/join.module.scss"
import ClipLoader from "./ClipLoader"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { AppContext } from "../AppContext"

const Join = (props) => {
  console.log(s)
  const [user] = useContext(AppContext).user
  const [courses, setCourses] = useState([])
  const [displayCourses, setDisplayCourses] = useState([])
  const [filter, setFilter] = useState("")
  const [courseToJoin, setCourseToJoin] = useState("")
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)

  const handleFilter = (value) => {
    setFilter(value)
    setDisplayCourses(
      courses.filter(
        (course) =>
          course.name.toLowerCase().includes(value.toLowerCase()) &&
          !user.listOfCourses.includes(course.name)
      )
    )
  }

  //   useEffect(props.refreshState, [user.name.username])

  useEffect(() => {
    axios
      .get("/api/courses/all")
      .then((res) => {
        setCourses(res.data)
        setDisplayCourses(
          res.data.filter((course) => !user.listOfCourses.includes(course.name))
        )
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const handleJoin = (value) => {
    setCourseToJoin(value)
    setJoining(true)
    axios
      .post("/api/courses/join", {
        course: value,
      })
      .then((res) => {
        console.log(res.data)
        props.refreshState()
      })
      .catch((e) => {
        console.log(e)
      })
  }

  return (
    <div className={`${s.form} component`}>
      <h1>Join a course</h1>
      <form>
        <input
          type="text"
          placeholder="search"
          value={filter}
          onChange={(e) => {
            handleFilter(e.target.value)
          }}
          autoFocus
        />
        {courses.length ? (
          <ul>
            {displayCourses.map((course) => (
              <li key={course._id}>
                {course.name}
                <div className=" loading-group special">
                  <button
                    disabled={joining}
                    onClick={(e) => {
                      e.preventDefault()
                      handleJoin(course.name)
                    }}
                  >
                    <span className="text">Join</span>
                    {joining && courseToJoin === course.name ? (
                      <ClipLoader loading={true} />
                    ) : (
                      <FontAwesomeIcon icon={faPlus} />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className={s.spinner}>
            <ClipLoader size={40} loading={true} />
          </div>
        )}
      </form>
    </div>
  )
}

export default Join
