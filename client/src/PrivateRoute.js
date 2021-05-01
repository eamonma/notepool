import { Route, Redirect } from "react-router-dom"
import { useContext } from "react"
import { AppContext } from "./AppContext"

const PrivateRoute = ({ component: Component }) => {
  const [authenticated] = useContext(AppContext).authenticated
  return (
    <Route
      render={(props) => {
        return Component && authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
            }}
          />
        )
      }}
    />
  )
}

export default PrivateRoute
