import React, { useContext } from "react"
import { NavLink, Link } from "react-router-dom"
import logo from ".././images/notepool_logo.png"
import s from "../styles/nav.module.scss"
import { AppContext } from "../AppContext"

const Navigation = () => {
  const [authenticated] = useContext(AppContext).authenticated
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
          {authenticated ? (
            <Link className={s["nav-button"]} to="/Logout">
              Logout
            </Link>
          ) : (
            <NavLink
              className={s["nav-button"]}
              to="/register"
              activeClassName={s["active-nav"]}
            >
              Register
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  )
}

export default Navigation
