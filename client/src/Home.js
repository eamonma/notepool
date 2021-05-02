import React, { useContext, useState, useEffect, Fragment } from "react"
import { AppContext } from "./AppContext"
import { Link } from "react-router-dom"
import axios from "axios"
import s from "./styles/home.module.scss"
// /api/user/eamonma/contributions

const Home = () => {
  const [user, setUser] = useContext(AppContext).user
  const [localUser, setLocalUser] = useState({})
  const [displayCourses, setDisplayCourses] = useState([])
  const [contributions, setContributions] = useState([])

  useEffect(() => {
    if (user.name) {
      axios
        .get(`/api/user/${user.name.username}/contributions`)
        .then((res) => {
          setContributions(res.data)
        })
        .catch((e) => {})

      axios
        .get(`/api/${user.name.username}`)
        .then((res) => {
          setLocalUser(res.data.user)
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }, [user])

  return (
    <div className="component" id="home-desc">
      {user && user.name ? (
        <Fragment>
          <h1>
            Hello, {user.name.firstName} {user.name.lastName}.
          </h1>
          <div className={s.container}>
            <h2>My courses</h2>
            <ul className={s.courses}>
              {localUser.listOfCourses &&
                localUser.listOfCourses.map((course) => (
                  <li className={s.course} key={course}>
                    <Link to={`/courses/${course}`}>{course}</Link>
                  </li>
                ))}
            </ul>
          </div>
          <ul>
            {contributions.map((contribution) => (
              <li key={contribution._id}>
                <Link to={`/files/${contribution._id}`}>
                  {contribution.course} | {contribution.title}
                </Link>
              </li>
            ))}
          </ul>
        </Fragment>
      ) : (
        <h1>Login, please</h1>
      )}
    </div>
  )
}

export default Home
