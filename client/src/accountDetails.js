import React, {useContext, useEffect} from "react";
import './index.css';
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from "./context";
import validator from "validator";

const AccountDetails = () => {

  const {
    isLoggedIn,
    formPassword,
    changeFormPassword,
    formNewPassword,
    changeFormNewPassword,
    formConfirmPassword,
    changeFormConfirmPassword,
    submitAccountForm,
    passwordStrength,
    changePasswordStrength,
    loading,
    operationSuccess,
    changeOperationSuccess,
    accountDetailsMessages, 
    changeAccountDetailsMessages,
    userData,
    handleUpload,
    avatarUploadPath,
    changeAvatarUploadPath,
    avatarMessage,
    changeAvatarMessage,
    handleRemoveAvatar
  } = useContext(AppContext)

  const navigate = useNavigate()

  // to redirect you to signIn page if you werent logged in
  useEffect(() => {
    if (!isLoggedIn) {
      return navigate("/signin")
    }
  }, [isLoggedIn, navigate])

  // to clear forms whenever this component renders
  useEffect(() => {
    changeFormPassword("")
    changeFormNewPassword("")
    changeFormConfirmPassword("")
    changeAccountDetailsMessages("")
    changeOperationSuccess(" ")
    changeAvatarUploadPath("")
    changeAvatarMessage("")
  }, [])

  // fronend part of validation for account page
  useEffect(() => {
    document.getElementById("change_password_button").setAttribute("disabled", true)
    document.getElementById("change_password_button").classList.remove("submit_button")

    if (formPassword.length > 5
      && formPassword.length < 19
      && formNewPassword.length > 5
      && formNewPassword.length < 19
      && formNewPassword === formConfirmPassword) {
      document.getElementById("change_password_button").removeAttribute("disabled")
      document.getElementById("change_password_button").classList.add("submit_button")
    }
    changePasswordStrength(validator.isStrongPassword(formNewPassword, { "returnScore": true }))
  }, [formPassword, formNewPassword, formConfirmPassword, changePasswordStrength])

  // just for button style
  useEffect(() => {
    document.getElementById("change_password_button").addEventListener('mouseover', (e) => {
      document.getElementsByClassName("submit_button_underline")[0].style.width = "120px"
    })
  }, [])

  useEffect(() => {
    document.getElementById("change_password_button").addEventListener('mouseleave', (e) => {
      document.getElementsByClassName("submit_button_underline")[0].style.width = "0px"
    })
  }, [])

  return(
    <div className="container">
      <h2 className="account_details_logo">User System</h2>
      <button className="nav_button"><Link className="link" to="/">Go back to main page</Link></button>
      <div className="account_details_container">
        <div className="account_details_left">
          <div className="account_details_avatar_container">
            {userData.avatar ? 
              <img className="account_details_avatar" src={`data:image/jpg;base64,${userData.avatar}`} alt="Avatar" /> 
            :
              <div className="account_details_no_avatar">No Avatar</div>
            }
          </div>
          <h3 className="account_details_username">{userData.username}</h3>
          <div className="nav_no_avatar">JPG | JPEG | PNG | GIF</div>
          <div className="nav_no_avatar">Maximim size: 1 MB</div>
          <form 
            onSubmit={handleUpload} 
            className="account_details_add_avatar_container" 
            encType="multipart/form-data" 
            translate="no"
          >
            <input 
              onChange={e => changeAvatarUploadPath(e.target.files[0])} 
              type="file" 
              name="avatar" 
              id="account_details_add_avatar" 
              accept="image/png, image/jpeg, image/jpg, image/gif"
            />
            {avatarUploadPath !== "" ?
              <input id="account_details_add_avatar_submit" type="submit" value="Upload" />
            :
              <div>{avatarMessage}</div>
            }
            
          </form>
            {userData.avatar ? 
              <button 
                onClick={handleRemoveAvatar} 
                id="account_details_remove_avatar" 
                className="submit_button"
              >Remove avatar</button>
            :
              <></>
          }
          
        </div>
        <div className="account_details_divider" />
        <div className="account_details_right">
          <h2>Change password:</h2>
          <form className="main_form" onSubmit={submitAccountForm}>
            <label htmlFor="old_password">Old password:</label>
            <input 
              value={formPassword}
              onChange={e => changeFormPassword(e.target.value)}
              type="password" 
              name="old_password" 
              placeholder='Your old password' 
              autoComplete='off' 
              required 
            />
            
            <label htmlFor="password">New password: {
              formNewPassword.length > 5 && formNewPassword.length < 19 ?
                passwordStrength > 39 ?
                  <span style={{ color: "#2ECC71" }}>Very strong</span>
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
            
            <label htmlFor="confirm_password">Cofirm your new password:</label>
            <input 
              value={formConfirmPassword}
              onChange={e => changeFormConfirmPassword(e.target.value)}
              type="password" 
              name="confirm_password" 
              placeholder='Must match with the one you entered above' 
              required 
            />
            <input id="change_password_button" className="submit_button" type="submit" value="Confirm change"/>
            <div className="submit_button_underline" />
            {loading ?
              <div className="loading"></div> :
              <></>
            }
            {
              operationSuccess !== " " ?
                operationSuccess === "success" ?
                  <div className='new_user_text' style={{ color: "#2ECC71" }}>{accountDetailsMessages}</div>
                  :
                  <div className='new_user_text' style={{ color: "#E74C3C" }}>{accountDetailsMessages}</div>
                : <></>
            }
          </form>
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

export default AccountDetails