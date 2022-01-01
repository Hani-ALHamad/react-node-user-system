import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom'
import './index.css';
import { AppContext } from "./context";


const SignIn = () => {
  const { 
    isLoggedIn, 
    formUsername,
    changeFormUsername,
    formPassword,
    changeFormPassword,
    submitSigninForm,
    loading,
    operationSuccess,
    changeOperationSuccess
  } = useContext(AppContext)

  const navigate = useNavigate()

  // checks if user is logged in, if true it redirects the user to "/"
  useEffect(() => {
  if (isLoggedIn) {
      return navigate("/")
    }
  }, [isLoggedIn, navigate])

  // to clear forms whenever this component renders
  useEffect(() => {
    changeFormUsername("")
    changeFormPassword("")
    changeOperationSuccess(" ")
  }, [])




  //fronend part of validation for signIn page
  useEffect(() => {
      document.getElementById("signin_button").setAttribute("disabled", true)
      document.getElementById("signin_button").classList.remove("submit_button")
      if (formUsername.length > 2
        && formUsername.length < 19
        && formPassword.length > 5
        && formPassword.length < 19) {
        document.getElementById("signin_button").removeAttribute("disabled")
        document.getElementById("signin_button").classList.add("submit_button")
    }
  }, [formUsername, formPassword])


  // just for button style
  useEffect(() => {
    document.getElementById("signin_button").addEventListener('mouseover', (e) => {
      document.getElementsByClassName("submit_button_underline")[0].style.width = "120px"
    })
  },[])

  useEffect(() => {
    document.getElementById("signin_button").addEventListener('mouseleave', (e) => {
      document.getElementsByClassName("submit_button_underline")[0].style.width = "0px"
    })
  },[])





  return(
      <div className="container">
        <h1>User System</h1>
        <h2>Log in</h2>
      <form className="main_form" onSubmit={submitSigninForm}>
        
          <label htmlFor="username">Username:</label>
          <input 
            value={formUsername} 
            onChange={e => changeFormUsername(e.target.value)} 
            type="text" 
            name="username" 
            placeholder='Must be unique' 
            autoComplete='off' 
            required 
          />

          <label htmlFor="password">Password:</label>
          <input 
            value={formPassword}
            onChange={e => changeFormPassword(e.target.value)}
            type="password" 
            name="password" 
            placeholder='Must be between 6-18 characters' 
            required 
          />
        <input id="signin_button" className="submit_button" type="submit" value="Sign in"/>
        <div className="submit_button_underline" />
        </form>
      {loading ?
        <div className="loading"></div> :
        <></>
      }
      {
        operationSuccess !== " " ?
          operationSuccess === "success" ?
            <div className='new_user_text' style={{ color: "#2ECC71" }}>
              Success! <span style={{ color: "white" }}>Redirecting...</span>
            </div>
            :
            <div className='new_user_text' style={{ color: "#E74C3C" }}>
              Wrong username or password
            </div>
          : <></>
      }
        <div className='new_user_container'>
          <div className='new_user_text'>
            New user? <Link className="link" to='/signup'>Sign up here</Link>
          </div>
        </div>
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

export default SignIn