import React, { Component, Fragment, useContext, useRef, useState } from "react"
import { Redirect, withRouter } from "react-router-dom"
import axios from "axios"
import { AppContext } from "../AppContext"

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

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(false)
    setLoading(true)

    axios
      .post("http://localhost:4000/api/register", {
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
        firstNameField.focus()
        firstNameField.select()
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
    <Fragment>
      <h1>Register</h1>
      <form
        action="http://localhost:4000/api/register"
        method="post"
        onSubmit={handleSubmit}
      >
        <label htmlFor="firstName">First name</label>
        <input
          type="text"
          name="firstName"
          value={firstName}
          ref={firstNameField}
          autoFocus
          onChange={(e) => setItem("firstName", e.target.value)}
        />

        <label htmlFor="lastName">Last name</label>
        <input
          type="text"
          name="lastName"
          value={lastName}
          onChange={(e) => setItem("lastName", e.target.value)}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setItem("email", e.target.value)}
        />

        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setItem("username", e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setItem("password", e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </Fragment>
  )
}

export default withRouter(Register)

// import React, { Component, Fragment } from "react"
// import axios from "axios"
// import { Redirect, withRouter, Link } from "react-router-dom"

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
