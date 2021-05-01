import React from "react"
import { css } from "@emotion/react"
import { ClipLoader } from "react-spinners"

const override = css`
  display: inline-block;
  margin: 0.4rem;
`

const ClipLoaderComponent = (props) => {
  return (
    <ClipLoader
      css={override}
      sizeUnit={"rem"}
      size={1.6}
      color={"#123abc"}
      loading={props.loading}
    />
  )
}

export default ClipLoaderComponent
