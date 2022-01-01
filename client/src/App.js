import React, {useContext} from 'react';
import './index.css';
import SignIn from './signIn';
import SignUp from './signUp';
import LoggedIn from './loggedIn';
import LoadingPage from './loadingPage';
import AccountDetails from './accountDetails';
import FOF from './FOF'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppContext } from "./context";


function App() {
  const { isChecked } = useContext(AppContext)
  // covers the page with loading indicator until the backend responds and tell if user is logged in or not
  if(!isChecked) {
    return <LoadingPage />
  }

  return (
    <BrowserRouter>
    <div className="main">
      <Routes>
        <Route exact path="" element={<LoggedIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/account" element={<AccountDetails />} />
        <Route path="/*" element={<FOF />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
