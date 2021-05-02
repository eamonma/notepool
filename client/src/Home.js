import React, { useContext, useState, useEffect, Fragment } from "react"
import { AppContext } from "./AppContext"
import { Link } from "react-router-dom"
import axios from "axios"
import s from "./styles/home.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import FilePreview from "./components/FilePreview"
import thumbnail from "./images/thumb.png"
import Welcome from "./components/Welcome"
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
    <Fragment>
      {user && user.name ? (
        <div className="component" id="home-desc">
          <Fragment>
            <h1>
              Hello, {user.name.firstName} {user.name.lastName}
            </h1>
            <div className={s.container}>
              <h2>My courses</h2>
              <ul className={s.courses}>
                {localUser &&
                  localUser.listOfCourses &&
                  localUser.listOfCourses.map((course) => (
                    <li className={s.course} key={course}>
                      <h3>
                        <Link to={`/courses/${course}`}>{course}</Link>
                      </h3>
                    </li>
                  ))}
                <li className={`${s.course} ${s.join}`}>
                  <Link to={`/join`}>
                    <FontAwesomeIcon icon={faPlus} />
                  </Link>
                </li>
              </ul>
            </div>
            <h2>My files</h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {contributions.map(
                (contribution) =>
                  contribution && (
                    <li
                      style={{
                        margin: "12px",
                      }}
                      key={contribution._id}
                    >
                      <FilePreview
                        image={thumbnail}
                        title={contribution.title}
                        course={contribution.course.name}
                        timestamp={new Date(
                          contribution.createdAt
                        ).toLocaleDateString()}
                        to={`/files/${contribution._id}`}
                        from={contribution.author}
                      />
                    </li>
                  )
              )}
            </ul>
          </Fragment>
        </div>
      ) : (
        <Welcome />
      )}
    </Fragment>
  )
}

export default Home

//  <Link to={`/files/${contribution._id}`}>
//                   {contribution.course} | {contribution.title}
//                 </Link>
