import React from "react"
import { NavLink, Link } from "react-router-dom"
import logo from '.././images/notepool_logo.png'

const Navigation = () => {
  return (
    <nav>
        <NavLink id="logo" to="/"><img src={ logo }></img></NavLink>
        <ul>
          <li><NavLink className="nav-button" to="/upload">Upload</NavLink></li>
          <li><NavLink className="nav-button" to="/register">Register</NavLink></li>
        </ul>
    </nav>
  )
}

export default Navigation
