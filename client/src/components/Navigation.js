import React from "react"
import { NavLink, Link } from "react-router-dom"
import logo from '.././images/notepool_logo.png'

const Navigation = () => {
  return (
    <nav>
        <a id="logo"><img src={ logo }></img></a>
        <ul>
          <li><NavLink className="nav-button" to="/">Home</NavLink></li>
          <li><NavLink className="nav-button" to="/upload">Upload</NavLink></li>
          <li><NavLink className="nav-button" to="/register">Register</NavLink></li>
        </ul>
    </nav>
  )
}

export default Navigation
