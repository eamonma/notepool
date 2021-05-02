import React, { useContext, useState, useEffect, Fragment } from "react"
import { AppContext } from "./AppContext"
import { Link } from "react-router-dom"
import axios from "axios"
// /api/user/eamonma/contributions

const Home = () => {
  const [user] = useContext(AppContext).user
  const [contributions, setContributions] = useState([])

  useEffect(() => {
    if (user.name) {
      axios
        .get(`/api/user/${user.name.username}/contributions`)
        .then((res) => {
          setContributions(res.data)
        })
        .catch((e) => {})
    }
  }, [user])

  return (
    <div className="component" id="home-desc">
      {user.name ? (
        <Fragment>
          <h1>
            Hello, {user.name.firstName} {user.name.lastName}.
          </h1>
          <ul>
            {contributions.map((contribution) => (
              <li>
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
