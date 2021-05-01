import React, { useContext, Fragment } from "react"
import { AppContext } from "./AppContext"

const Home = () => {
  const [user] = useContext(AppContext).user
  return (
    <div className="component" id="home-desc">
      {user.name && (
        <h1>
          Hello, {user.name.firstName} {user.name.lastName}.
        </h1>
      )}
    </div>
  )
}

export default Home
