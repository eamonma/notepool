import React, { Component, Fragment } from "react"
import axios from "axios"

const Logout = (props) => {
  axios
    .post("/api/logout")
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      props.unauthenticate()
    })

  return (
    <Fragment>
      <h1>Logging out...</h1>
    </Fragment>
  )
}

export default Logout
