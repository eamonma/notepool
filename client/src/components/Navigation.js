import React, { useContext } from "react"
import { NavLink, Link } from "react-router-dom"
import logo from ".././images/notepool_logo.svg"
import s from "../styles/nav.module.scss"
import { AppContext } from "../AppContext"

const Navigation = () => {
  const [authenticated] = useContext(AppContext).authenticated
  return (
    <header>
      <nav className={s.nav}>
        <Link className={s.logo} to="/">
          <img src={logo}></img>
        </Link>
        <ul>
          <li>
            <NavLink
              className={s["nav-button"]}
              to="/join"
              activeClassName={s["active-nav"]}
            >
              Join courses
            </NavLink>
          </li>
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
              <Link className={s["nav-button"]} to="/logout">
                Logout
              </Link>
            ) : (
              <Link className={s["nav-button"]} to="/login">
                Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Navigation
