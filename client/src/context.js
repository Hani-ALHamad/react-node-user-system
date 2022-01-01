import React, {useState, useEffect, createContext} from 'react'
import axios from 'axios'

export const AppContext = createContext()

const Context = ({children}) => {
  const [isLoggedIn, changeIsLoggedIn] = useState(false)
  const [formUsername, changeFormUsername] = useState("")
  const [formNewUsername, changeFormNewUsername] = useState("")
  const [formPassword, changeFormPassword] = useState("")
  const [formNewPassword, changeFormNewPassword] = useState("")
  const [formConfirmPassword, changeFormConfirmPassword] = useState("")
  const [passwordStrength, changePasswordStrength] = useState(0)
  const [checkUsernameAvailability, changeCheckUsernameAvailability] = useState(false)
  const [loading, changeLoading] = useState(false)
  const [operationSuccess, changeOperationSuccess] = useState(" ")
  const [isChecked, changeIsChecked] = useState(false)
  const [userData, changeUserData] = useState({username: ""})
  const [accountDetailsMessages, changeAccountDetailsMessages] = useState("")
  const [avatarUploadPath, changeAvatarUploadPath] = useState("")
  const [avatarMessage, changeAvatarMessage] = useState("")

  // a function to check if the user is logged in or not, will get called multiple times below
  const loginCheck = async () => {
    const response = await fetch(`/logincheck`)
    const jsoned = await response.json()
    if (response.ok) {
      changeIsLoggedIn(true)
      changeIsChecked(true)
      changeUserData({
        username: jsoned.username,
        avatar: jsoned.avatar
      })
    } else {
      changeIsLoggedIn(false)
      changeIsChecked(true)
    }
  }

  // calling loginCheck whenever you switch back to the tab again
  useEffect(() => {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        loginCheck()
      }
    })
    loginCheck()
  },[])



  // to submit signIn data to the backend
  const submitSigninForm = (e) => {
    e.preventDefault()
    document.querySelectorAll('input').forEach((element) => { element.setAttribute("disabled", true) })
    changeLoading(true)
    changeOperationSuccess(" ")
    const fetchData = async () => {
      const response = await fetch('/usersignin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "username": `${formUsername}`,
          "password": `${formPassword}`
        })
      })
      if (response.ok) {
        changeOperationSuccess("success")
        changeFormUsername("")
        changeFormPassword("")
        changeLoading(false)
        window.location.replace('/')
      } else {
        changeOperationSuccess("fail")
        changeLoading(false)
        document.querySelectorAll('input').forEach((element) => { element.removeAttribute("disabled") })
      }
    }
    fetchData()
  }

  // to submit signUp data to the backend
  const submitSignupForm = (e) => {
    e.preventDefault()
    document.querySelectorAll('input').forEach((element) => {element.setAttribute("disabled", true)})
      changeLoading(true)
      changeOperationSuccess(" ")
      const fetchData = async () => {
        const response = await fetch('/createuser', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "username": `${formNewUsername}`,
            "password": `${formNewPassword}`
          })
        })
        const jsoned = await response.json()
        if (jsoned._id) {
          changeOperationSuccess("success")
          changeFormNewUsername("")
          changeFormNewPassword("")
          changeFormConfirmPassword("")
          changeLoading(false)
        } else {
          changeOperationSuccess("fail")
          changeLoading(false)
          document.querySelectorAll('input').forEach((element) => { element.removeAttribute("disabled") })
        }
      }
      fetchData()
  }

  // to submit changing password data to the backend
  const submitAccountForm = (e) => {
    e.preventDefault()
    document.querySelectorAll('input').forEach((element) => { element.setAttribute("disabled", true) })
    changeLoading(true)
    changeOperationSuccess(" ")
    const fetchData = async () => {
      const response = await fetch('/changepassword', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "oldPassword": `${formPassword}`,
          "newPassword": `${formNewPassword}`
        })
      })

      if (response.ok) {
        changeOperationSuccess("success")
        changeFormPassword("")
        changeFormNewPassword("")
        changeFormConfirmPassword("")
        changeAccountDetailsMessages("Password changed successfully")
        changeLoading(false)
      } else {
        changeOperationSuccess("fail")
        changeLoading(false)
        document.querySelectorAll('input').forEach((element) => { element.removeAttribute("disabled") })
        if(response.status === 400) {
          changeAccountDetailsMessages("Wrong old password")
        } else {
          changeAccountDetailsMessages("An error occurred")
        }
      }
    }
    fetchData()
  }

  // runs when upload avatar button is clicked, sends FormData through axios (?) to the backend
  // ? not sure if fetch works or not with FormData, used axios just in case
  const handleUpload = (e) => {
    e.preventDefault()
    changeAvatarMessage("Uploadin...")
    const uploadData = async () => {
      const formData = new FormData()
      formData.append('file', avatarUploadPath)
      const response = await axios.post('/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if(!response.data.error){
        loginCheck()
        changeAvatarMessage("Success")
      } else {
        if (response.data.error.message) {
          changeAvatarMessage(response.data.error.message)
        } else {
          changeAvatarMessage("An error occurred, please check your files")
        }
      }
      changeAvatarUploadPath("")
    }
    uploadData()
  }

  // runs when "remove avatar" button is clicked
  const handleRemoveAvatar = () => {
    const fetchData = async () => {
      const response = await fetch("/removeavatar")
      if(response.ok) {
        changeAvatarMessage("")
        loginCheck()
      }
    }
    fetchData()
  }

  // rund when you click on logout button
  const handleLogOut = () => {
    const logoutRequest = async () => {
      const response = await fetch("/logout")
      if(response.ok) {
        window.location.reload()
      }
    }
    logoutRequest()
  }



  return(
    <AppContext.Provider value={{
      isLoggedIn,
      formUsername,
      changeFormUsername,
      formNewUsername, 
      changeFormNewUsername,
      formPassword,
      changeFormPassword,
      formNewPassword,
      changeFormNewPassword,
      formConfirmPassword,
      changeFormConfirmPassword,
      submitSigninForm,
      submitSignupForm,
      submitAccountForm,
      passwordStrength, 
      changePasswordStrength,
      checkUsernameAvailability, 
      changeCheckUsernameAvailability,
      loading,
      operationSuccess,
      changeOperationSuccess,
      isChecked,
      handleLogOut,
      accountDetailsMessages,
      changeAccountDetailsMessages,
      userData,
      handleUpload,
      avatarUploadPath,
      changeAvatarUploadPath,
      avatarMessage,
      changeAvatarMessage,
      handleRemoveAvatar
    }}>
      {children}
    </AppContext.Provider>
  )
}

export default Context