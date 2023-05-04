import React, { useEffect } from "react";
import { useState } from "react";
import AppRouter from "components/Router";

import {authService} from "fbase";
import {onAuthStateChanged, updateProfile } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if(user){
        if(user.displayName === null)
        {
          const name = "Newbe";
          user.displayName = name;
        }
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile:(args) => updateProfile(user, {displayName: user.displayName})
        });
      } else{
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: () => updateProfile(user, {displayName: user.displayName})
    });
  }

  return (
  <>
    {init ? <AppRouter refreshUser={refreshUser} userObj={userObj} isLoggedIn = {isLoggedIn}/> : "Initializing..."}
    {/* <footer>&copy; {new Date().getFullYear()} Nwitter</footer> */}
  </>
  );
}

export default App;
