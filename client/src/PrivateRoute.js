import { Route, Redirect } from "react-router-dom"
import { useContext } from "react"
import { AppContext } from "./AppContext"

const PrivateRoute = ({ component: Component, state, ...rest }) => {
  const [authenticated] = useContext(AppContext).authenticated
  return (
    <Route
      {...rest}
      render={(props) => {
        return Component && authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }}
    />
  )
}

export default PrivateRoute
