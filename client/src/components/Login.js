import React, { useContext, Fragment, useState } from "react"
import axios from "axios"
import { Redirect, withRouter, Link } from "react-router-dom"
import ClipLoader from "./ClipLoader"
import { AppContext } from "../AppContext"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons"

const Login = (props) => {
  const [authenticated, setAuthenticated] = useContext(AppContext).authenticated
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    axios
      .post("/api/login", {
        email,
        password,
      })
      .then((res) => {
        const { user, token } = res.data
        props.authenticate(user, token)
      })
      .catch((error) => {
        setError(true)
        setLoading(false)
      })
  }

  return authenticated ? (
    <Redirect to="/" />
  ) : (
    <Fragment>
      <h1>Login</h1>
      <Link to="/register">Register</Link>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          vaule={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Log in</button>
      </form>
    </Fragment>
  )
}

export default withRouter(Login)
