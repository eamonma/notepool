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
    <div className="form component">
      <h1>Logging out...</h1>
    </div>
  )
}

export default Logout
