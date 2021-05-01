import React, { useContext } from "react"
import { AppContext } from "./AppContext"

const Home = () => {
  const [user] = useContext(AppContext).user
  return (
    <div id="home-desc">
      <h1>Home</h1>
      {user.name && (
        <p>
          Hello, {user.name.firstName} {user.name.lastName}
        </p>
      )}
    </div>
  )
}

export default Home
