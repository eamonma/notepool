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
import Join from "./components/Join"
import Course from "./components/Course"
import File from "./components/File"
import Footer from "./components/Footer"

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

const AppRouter = () => {
  const [authenticated, setAuthenticated] = useContext(AppContext).authenticated
  const [token, setToken] = useContext(AppContext).token
  const [user, setUser] = useContext(AppContext).user

  const authenticate = (user, token, cb) => {
    try {
      // if (!authenticated) {
      setAuthenticated(true)
      setToken(token)
      setUser(user)
      axios.interceptors.request.use((config) => {
        console.log("auth interceptor")
        config.headers.Authorization = `Bearer ${token}`
        console.log(config)
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

      cb()
      // }
      return true
    } catch (error) {
      return false
    }
  }

  const refreshState = () => {
    if (user && user.name && user.name.username) {
      axios
        .get(`/api/${user.name.username}`)
        .then((res) => {
          console.log(res.data.user)
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
        .catch((error) => {
          console.log(error)
        })
    }
  }

  useEffect(refreshState, [])

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

      refreshState()

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
            <Login
              authenticate={authenticate}
              refreshState={refreshState}
              {...props}
            />
          )}
        />
        <Route
          path="/courses/:course"
          component={(props) => <Course {...props} />}
        />
        <Route path="/files/:file" component={(props) => <File {...props} />} />
        <PrivateRoute
          path="/logout"
          exact
          component={() => <Logout unauthenticate={unauthenticate} />}
        />
        <PrivateRoute path="/upload" component={() => <Upload />} />
        <PrivateRoute
          path="/join"
          component={() => <Join refreshState={refreshState} />}
        />
      </Switch>
      <Footer />
    </Fragment>
  )
}

export default App
