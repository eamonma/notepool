import React, { Component, Fragment, useContext, useRef, useState } from "react"
import { Redirect, withRouter } from "react-router-dom"
import axios from "axios"
import ClipLoader from "./ClipLoader"
import { AppContext } from "../AppContext"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons"

import s from "../styles/register.module.scss"

const Register = (props) => {
  const [authenticated, setAuthenticated] = useContext(AppContext).authenticated
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const firstNameField = useRef(null)

  // axios
  //   .post(`/api/register`, {
  //     firstName: "eamon",
  //     lastName: "ma",
  //     username: "fadsdf",
  //     email: "m@emalfj.ca",
  //     password: "fadsklfasdjlkf",
  //   })
  //   .then((res) => {
  //     console.log(res.data)
  //   })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(false)
    setLoading(true)

    axios
      .post(`/api/register`, {
        firstName,
        lastName,
        username,
        email,
        password,
      })
      .then((res) => {
        const { user, token } = res.data
        console.log(user, token)
        props.authenticate(user, token)
      })
      .catch((error) => {
        console.log(error)
        setError(true)
        setLoading(false)
        setPassword("")
        firstNameField.current.focus()
        firstNameField.current.select()
      })
  }

  const setItem = (itemName, value) => {
    const items = {
      firstName: setFirstName,
      lastName: setLastName,
      username: setUsername,
      email: setEmail,
      password: setPassword,
    }

    items[itemName](value)
  }

  return authenticated ? (
    <Redirect to="/" />
  ) : (
    <div className={`component ${s.Register}`}>
      <h1>Register</h1>
      <form action="/api/register" method="post" onSubmit={handleSubmit}>
        <label htmlFor="firstName">First name</label>
        <input
          type="text"
          name="firstName"
          value={firstName}
          ref={firstNameField}
          autoFocus
          disabled={loading}
          onChange={(e) => setItem("firstName", e.target.value)}
        />

        <label htmlFor="lastName">Last name</label>
        <input
          type="text"
          name="lastName"
          value={lastName}
          disabled={loading}
          onChange={(e) => setItem("lastName", e.target.value)}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          disabled={loading}
          onChange={(e) => setItem("email", e.target.value)}
        />
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          value={username}
          disabled={loading}
          onChange={(e) => setItem("username", e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={password}
          disabled={loading}
          onChange={(e) => setItem("password", e.target.value)}
        />
        <div className="submit-group">
          <span></span>
          <div className={`${error && "wrong"} loading-group special`}>
            <button
              disabled={
                loading ||
                !email ||
                !password ||
                !firstName ||
                !lastName ||
                !username
              }
              type="submit"
            >
              <span className="text">Register</span>
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

export default withRouter(Register)

// import React, { Component, Fragment } from "react"
// import axios from "axios"
// import { Redirect, withRouter, Link } from "react-router-dom"
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"

// export class Login extends Component {
//   state = {
//     loading: false,
//     error: false,
//     email: "",
//     password: "",
//   }

//   componentWillUnmount() {
//     this.setState(() => ({
//       loading: false,
//       erorr: false,
//     }))
//   }

//   componentDidMount() {
//     // this.email.focus()
//   }

//   handleChange = (name, e) => {
//     const value = e.target.value
//     this.setState(() => ({
//       [name]: value,
//     }))
//   }

// }

// export default withRouter(Login)
