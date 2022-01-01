import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom'
import './index.css';
import { AppContext } from "./context";
import validator from "validator";

const SignUp = () => {

  const {
    isLoggedIn,
    formNewUsername,
    changeFormNewUsername,
    formNewPassword,
    changeFormNewPassword,
    formConfirmPassword,
    changeFormConfirmPassword,
    submitSignupForm,
    passwordStrength, 
    changePasswordStrength,
    checkUsernameAvailability, 
    changeCheckUsernameAvailability,
    loading,
    operationSuccess,
    changeOperationSuccess,
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
    changeFormNewUsername("")
    changeFormNewPassword("")
    changeFormConfirmPassword("")
    changeOperationSuccess(" ")
  }, [])

  // fronend part of validation for signUp page
  useEffect(() => {
    document.getElementById("signup_button").setAttribute("disabled", true)
    document.getElementById("signup_button").classList.remove("submit_button")

    if (formNewUsername.length > 2
      && formNewUsername.length < 19
      && formNewPassword.length > 5
      && formNewPassword.length < 19
      && formNewPassword === formConfirmPassword
      && checkUsernameAvailability) {
      document.getElementById("signup_button").removeAttribute("disabled")
      document.getElementById("signup_button").classList.add("submit_button")
    }
    changePasswordStrength(validator.isStrongPassword(formNewPassword, { "returnScore": true }))
  }, [formNewUsername, formNewPassword, formConfirmPassword, changePasswordStrength, checkUsernameAvailability])

  // backend check for if username is available or allowed
  useEffect(() => {
    if (formNewUsername.length > 2 && formNewUsername.length < 19){
      const fetchData = async () => {
        const response = await fetch(`/checkuser/${formNewUsername}`)
        changeCheckUsernameAvailability(!response.ok)
      }
      fetchData()
      }
  }, [formNewUsername, changeCheckUsernameAvailability])

  // just for button style
  useEffect(() => {
    document.getElementById("signup_button").addEventListener('mouseover', (e) => {
      document.getElementsByClassName("submit_button_underline")[0].style.width = "120px"
    })
  }, [])

  useEffect(() => {
    document.getElementById("signup_button").addEventListener('mouseleave', (e) => {
      document.getElementsByClassName("submit_button_underline")[0].style.width = "0px"
    })
  }, [])

  if (isLoggedIn) {
    return window.location.replace('/')
  }

  return (
    <div className="container">
      <h1>User System</h1>
      <h2>Sign up a new user</h2>
      <form className="main_form" onSubmit={submitSignupForm}>
        <label htmlFor="username">Username: {
          formNewUsername.length > 2 && formNewUsername.length < 19 ? 
            checkUsernameAvailability ? 
              <span style={{ color: "#2ECC71" }}>Available</span>
            :
              <span style={{ color: "#E74C3C" }}>This username is not available</span>
          : <></>
        }</label>
        <input 
          value={formNewUsername}
          onChange={e => changeFormNewUsername(e.target.value)} 
          type="text" 
          name="username" 
          placeholder='Must be unique' 
          autoComplete='off' 
          required 
        />
        
        <label htmlFor="password">Password: {
          formNewPassword.length > 5 && formNewPassword.length < 19 ?
            passwordStrength > 39 ? 
              <span style={{ color: "#2ECC71"}}>Very strong</span> 
            : passwordStrength > 29 ? 
              <span style={{ color: "#F1C40F" }}>Strong</span> 
            : 
              <span style={{ color: "#E74C3C" }}>Weak</span>
          : <></>
        }</label>
        <input 
          value={formNewPassword}
          onChange={e => changeFormNewPassword(e.target.value)}
          type="password" 
          name="password" 
          placeholder='Must be between 6-18 characters' 
          required 
        />
        
        <label htmlFor="confirm_password">Cofirm your password:</label>
        <input 
          value={formConfirmPassword}
          onChange={e => changeFormConfirmPassword(e.target.value)}
          type="password" 
          name="confirm_password" 
          placeholder='Must match with the one you entered above' 
          required 
        />
        <input id="signup_button" className="submit_button" type="submit" value="Create" />
        <div className="submit_button_underline" />
      </form>
      {loading ? 
        <div className="loading"></div> :
        <></>
      }
      {
        operationSuccess !== " " ?
          operationSuccess === "success" ?
            <div className='new_user_text' style={{ color: "#2ECC71"}}>
              Successfully signed up!
            </div>
          :
            <div className='new_user_text' style={{ color: "#E74C3C" }}>
              An error occurred, please try again
            </div>
        : <></>
      } 
      <div className='new_user_container'>
        <div className='new_user_text'>
          Already got an account? <Link className="link" to='/signin'>Sign in here</Link>
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

export default SignUp