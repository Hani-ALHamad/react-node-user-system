import React, { useContext, useEffect } from "react";
import {Link, useNavigate} from 'react-router-dom'
import './index.css';
import { AppContext } from "./context";

const LoggedIn = () => {
  const { isLoggedIn, handleLogOut, userData } = useContext(AppContext)
  const navigate = useNavigate()

// checks if user is logged in, if not it directs you to the signIn page
useEffect(() => {
  if (!isLoggedIn) {
    return navigate("/signin")
  }
},[isLoggedIn, navigate])


  return (
    <div className="nav_container">
      <nav>
        <h2 className="nav_logo">User System</h2>
        <div className="nav_avatar_container">
          {
            userData.avatar ?
              <img className="nav_avatar" src={`data:image/jpg;base64,${userData.avatar}`} alt="Avatar" /> 
            :
              <div className="nav_no_avatar">No Avatar</div>
          }
        </div>
        <button className="nav_button">
          <Link className="nav_button_link" to="/account">Account details</Link>
        </button>
        <button className="nav_button" onClick={handleLogOut}>Log out</button>
      </nav>
      <a
        className="my_github"
        href="https://github.com/Hani-ALHamad"
        target="_blank"
        rel="noreferrer">
        My GitHub
      </a>
      </div>
  )
}

export default LoggedIn