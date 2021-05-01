import React from "react"
import { css } from "@emotion/react"
import { ClipLoader } from "react-spinners"

const ClipLoaderComponent = (props) => {
  return (
    <ClipLoader
      sizeUnit={"rem"}
      size={15}
      color={"#123abc"}
      loading={props.loading}
    />
  )
}

export default ClipLoaderComponent
