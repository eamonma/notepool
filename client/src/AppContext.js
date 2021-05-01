import React, { useState, createContext } from "react"

export const AppContext = createContext()

export const AppProvider = (props) => {
  const [authenticated, setAuthenticated] = useState(false)
  const [token, setToken] = useState("")
  const [user, setUser] = useState({})

  return (
    <AppContext.Provider
      value={{
        authenticated: [authenticated, setAuthenticated],
        token: [token, setToken],
        user: [user, setUser],
      }}
    >
      {props.children}
    </AppContext.Provider>
  )
}
