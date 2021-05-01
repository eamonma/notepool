import "./App.scss"
import React, { useEffect, useContext, Fragment } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from "./Home"
import Navigation from "./components/Navigation"
import Upload from "./components/Upload"
import Register from "./components/Register"

import a from "axios"
import { AppProvider, AppContext } from "./AppContext"
import Logout from "./components/Logout"
import PrivateRoute from "./PrivateRoute"

// axios.defaults.baseURL = "http://localhost"
// axios.defaults.proxy.port = 4000

process.env.PROTOCOL = process.env.PROTOCOL || "http"
process.env.DOMAIN = process.env.DOMAIN || "localhost"

const HttpsProxyAgent = require("https-proxy-agent")

const httpsAgent = new HttpsProxyAgent({
  host: "localhost",
  port: "4000",
})

//use axios as you normally would, but specify httpsAgent in the config
const axios = a.create({ httpsAgent })

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

  useEffect(() => {
    try {
      const state = JSON.parse(localStorage.getItem("state"))
      setAuthenticated(state.authenticated)
      setToken(state.token)
      setUser(state.user)

      axios.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${this.state.token}`

        return config
      })

      axios.post(`http://localhost:4000/api/isValidToken`).catch((error) => {
        unauthenticate()
      })
    } catch (error) {}
    return () => {}
  }, [])

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
      this.setState(
        () => ({
          authenticated: false,
          user: {},
          token: "",
        }),
        () => {
          localStorage.setItem("state", JSON.stringify(this.state))
        }
      )
      axios.interceptors.request.use((config) => {
        config.headers.Authorization = undefined
        return config
      })
    } catch (e) {}
  }

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
        <PrivateRoute path="/logout" exact component={() => <Logout />} />
        <PrivateRoute path="/upload">
          <Upload />
        </PrivateRoute>
      </Switch>
    </Fragment>
  )
}

export default App
