import React, { useContext, Fragment, useState, useRef } from "react"
import axios from "axios"
import { Redirect, withRouter, Link } from "react-router-dom"
import ClipLoader from "./ClipLoader"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons"

import { AppContext } from "../AppContext"

const Login = (props) => {
  const [authenticated, setAuthenticated] = useContext(AppContext).authenticated
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const emailField = useRef(null)

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
        emailField.current.focus()
        emailField.current.select()
      })
  }

  return authenticated ? (
    <Redirect to="/" />
  ) : (
    <div className="form component">
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex-row">
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              value={email}
              disabled={loading}
              ref={emailField}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              vaule={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="submit-group">
          <div>
            <Link to="/register">Register</Link>
          </div>
          <div className={`${error && "wrong"} loading-group special`}>
            <button disabled={loading || !email || !password} type="submit">
              <span className="text">Log in</span>
              <div className="right-shape">
                {loading ? (
                  <ClipLoader loading={true} />
                ) : (
                  <FontAwesomeIcon icon={faArrowCircleRight} />
                )}
              </div>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default withRouter(Login)
