import React from "react";
import {Link} from 'react-router-dom'
import './index.css';

const FOF = () => {  
  return(
    <div className="container">
      <h1 className="fof_logo">404</h1>
      <h3 className="fof_text">The page you are looking for cannot be found. <Link className="fof_link" to="/">Go back</Link></h3>
    </div>
  )
}

export default FOF