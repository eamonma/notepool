import "./App.scss"
import React, { useEffect, useContext, Fragment } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from "./Home"
import Navigation from "./components/Navigation"
import Upload from "./components/Upload"
import Register from "./components/Register"

import axios from "axios"
import { AppProvider, AppContext } from "./AppContext"
import Logout from "./components/Logout"
import PrivateRoute from "./PrivateRoute"
import Login from "./components/Login"

// axios.defaults.baseURL = "http://localhost"
// axios.defaults.proxy.port = 4000

axios.defaults.baseURL = "http://localhost:4000"

const App = () => {
  // const [authenticated, setAuthenticated] = useContext(AppContext).authenticated
  // console.log(useContext(AppContext))

  return (
    <Router>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </Router>
  )
}

axios.get("/").then((res) => {
  console.log(res.status)
})

const AppRouter = () => {
  const [authenticated, setAuthenticated] = useContext(AppContext).authenticated
  const [token, setToken] = useContext(AppContext).token
  const [user, setUser] = useContext(AppContext).user

  const authenticate = (user, token) => {
    try {
      if (!authenticated) {
        setAuthenticated(true)
        setToken(token)
        setUser(user)
        axios.interceptors.request.use((config) => {
          config.headers.Authorization = `Bearer ${token}`
          return config
        })
        localStorage.setItem(
          "state",
          JSON.stringify({
            authenticated: true,
            token,
            user,
          })
        )
      }
      return true
    } catch (error) {
      return false
    }
  }

  const refreshState = () => {
    axios
      .get(`/api/${user.name.username}`)
      .then((res) => {
        setUser(res.data.user)
        localStorage.setItem(
          "state",
          JSON.stringify({
            authenticated,
            token,
            user,
          })
        )
      })
      .catch((error) => {})
  }

  const unauthenticate = () => {
    try {
      setAuthenticated(false)
      setToken("")
      setUser({})

      localStorage.setItem(
        "state",
        JSON.stringify({
          authenticated: false,
          token: "",
          user: {},
        })
      )

      axios.interceptors.request.use((config) => {
        config.headers.Authorization = undefined
        return config
      })
    } catch (e) {}
  }

  useEffect(() => {
    try {
      const state = JSON.parse(localStorage.getItem("state"))
      setAuthenticated(state.authenticated)
      setToken(state.token)
      setUser(state.user)

      axios.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${state.token}`

        return config
      })

      axios.post(`/api/isValidToken`).catch((error) => {
        unauthenticate()
      })
    } catch (error) {}
    return () => {}
  }, [])

  return (
    <Fragment>
      <Navigation />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route
          path="/register"
          exact
          component={(props) => (
            <Register authenticate={authenticate} {...props} />
          )}
        />
        <Route
          path="/login"
          exact
          component={(props) => (
            <Login authenticate={authenticate} {...props} />
          )}
        />
        <PrivateRoute
          path="/logout"
          exact
          component={() => <Logout unauthenticate={unauthenticate} />}
        />
        <PrivateRoute path="/upload" component={() => <Upload />} />
      </Switch>
    </Fragment>
  )
}

export default App
