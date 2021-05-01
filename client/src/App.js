import "./App.css"
import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from "./Home"
import Navigation from "./components/Navigation"
import Upload from "./components/Upload"
import Register from "./components/Register"

export const App = () => {
  return (
    <Router>
      <Navigation />
      <Switch>
        <Route exact={true} path="/">
          <Home />
        </Route>
        <Route path="/upload">
          <Upload />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
