import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login/Login";
import SignUp from "./components/signup/SignUp";
import MainPage from "./components/MainPage";
import FOF from "./components/FOF";
import { auth, db } from "./firebase/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import UserChats from "./components/userprofile-chat/UserChats";
import UserProfile from "./components/userprofile-chat/UserProfile";
import Addpost from "./components/posts/Addpost";
import Friendsprofile from "./components/friendsprofile/Friendsprofile";
import Msgptop from "./components/chat-component/Msgptop";
import * as mdb from "mdb-ui-kit"; // lib
window.mdb = mdb;
const App = () => {
  const [user, setUser] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  function GetCurrentUser() {
    useEffect(() => {
      auth.onAuthStateChanged((userlogged) => {
        if (userlogged) {
          const getUser = async () => {
            const q = query(
              collection(db, "users"),
              where("uid", "==", userlogged.uid)
            );
            const data = await getDocs(q);
            setUser(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
          };
          getUser();
        } else {
          setUser(null);
        }
      });
    }, []);
    return user;
  }

  GetCurrentUser();
  console.log(user);

  return (
    <div>
      {user ? (
        <div>
          <BrowserRouter>
            <Routes>
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/signup" element={<SignUp />} />
              <Route path="/" element={<MainPage userdata={user} />} />
              <Route path="/mainpage" element={<MainPage userdata={user} />} />
              <Route
                path="/userchats"
                element={<UserChats userdata={user} />}
              />
              <Route
                path="/userprofile"
                element={<UserProfile userdata={user} />}
              />
              <Route path="/addpost" element={<Addpost userdata={user} />} />
              <Route
                path="/searchedprofile/:fuseruid"
                element={<Friendsprofile userdata={user} />}
              />
              <Route
                path="/msgptop/:fuseruid"
                element={<Msgptop userdata={user} />}
              />
              <Route path="*" element={<FOF />} />
            </Routes>
          </BrowserRouter>
        </div>
      ) : (
        <div>
          <BrowserRouter>
            <Routes>
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/signup" element={<SignUp />} />
              <Route path="*" element={<Login />} />
            </Routes>
          </BrowserRouter>
        </div>
      )}
    </div>
  );
};

export default App;
