import React from "react"
import { NavLink, Link } from "react-router-dom"
import logo from ".././images/notepool_logo.png"
import s from "../styles/nav.module.scss"

const Navigation = () => {
  return (
    <nav className={s.nav}>
      <Link className={s.logo} to="/">
        <img src={logo}></img>
      </Link>
      <ul>
        <li>
          <NavLink
            className={s["nav-button"]}
            to="/upload"
            activeClassName={s["active-nav"]}
          >
            Upload
          </NavLink>
        </li>
        <li>
          <NavLink
            className={s["nav-button"]}
            to="/register"
            activeClassName={s["active-nav"]}
          >
            Register
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation
