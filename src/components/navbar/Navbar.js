import React, { useState } from "react";
import ChatIcon from "../../assets/chatIcon.png";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase/FirebaseConfig";
import addIcon from "../../assets/addbutton.png";
import home_icon from "../../assets/home.png";
import message_icon from "../../assets/chat.png";
import { collection, getDocs, query, where } from "firebase/firestore";

const Navbar = ({ userdata }) => {
  const navigate = useNavigate();
  const [findUser, setFindUser] = useState("");
  const [findUserDoc, setFindUserDoc] = useState("");

  const searchUser = (e) => {
    e.preventDefault();
    const getUser = async () => {
      const q = query(collection(db, "users"), where("email", "==", findUser));
      const data = await getDocs(q);
      setFindUserDoc(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      // console.log(findUserDoc);
      if (findUserDoc.length != 0) {
        navigate(`/searchedprofile/${findUserDoc[0].uid}`);
      }
    };
    getUser();
  };

  const logoutuser = () => {
    signOut(auth)
      .then(() => {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  let currentuser = userdata;

  return (
    <div>
      <nav>
        <div className="left">
          <Link to="/">
            <img src={ChatIcon} alt="chatIcon" />
          </Link>
        </div>

        {currentuser != undefined ? (
          <div className="center">
            <input
              placeholder="Search a friend by email..."
              onChange={(e) => setFindUser(e.target.value)}
              className="search-user"
            />
            <button onClick={searchUser}>&gt;</button>
          </div>
        ) : (
          <div></div>
        )}

        {currentuser != undefined ? (
          <div className="right">
            <Link to="/mainpage">
              <img src={home_icon} className="nav-profile-pic" />
            </Link>
            <Link to="/addpost">
              <img src={addIcon} className="nav-profile-pic add-icon" />
            </Link>
            <Link to="/userchats">
              <img src={message_icon} className="nav-profile-pic" />
            </Link>
            <Link to="/userprofile">
              <img
                src={currentuser[0]?.profilePic}
                className="nav-profile-pic"
              />
            </Link>
            <button onClick={logoutuser}>Logout</button>
          </div>
        ) : (
          <div className="right">
            <Link to="/login">
              <button>Login</button>
            </Link>
            <Link to="/signup">
              <button>Signup</button>
            </Link>
          </div>
        )}
      </nav>
      <hr className="nav-hr" />
    </div>
  );
};

export default Navbar;
