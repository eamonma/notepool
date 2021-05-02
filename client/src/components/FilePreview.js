import s from '.././styles/filepreview.module.scss'
import { Link } from 'react-router-dom'

const FilePreview = (props) => {
    return (
        <Link to={ props.to }>
            <div className={s.container}>
                <img src={ props.image } className={s.fileimg} />
                <div style={{display: 'inline-block', marginLeft: '1rem'}}>
                    <h2 className={s.title}>{ props.title }</h2>
                    <span className={s.course}>{ props.course }</span>
                    <span>Uploaded { props.timestamp }</span>
                </div>
            </div>
        </Link>
    )
  }
  
  export default FilePreview
  