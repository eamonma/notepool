import "./App.css"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from "./Home"
import Navigation from "./Navigation"
import Upload from "./Upload"

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
      </Switch>
    </Router>
  )
}

export default App
