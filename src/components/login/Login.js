import React, { useState } from "react";
import Navbar from "../navbar/Navbar";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setSuccessMsg("Logged in Successfully");
        setTimeout(() => {
          setSuccessMsg("");
          navigate("/mainpage");
        }, 3000);
      })
      .catch((error) => {
        console.log(error.message);
        setErrorMsg(error.message);
        setTimeout(() => {
          setErrorMsg("");
        }, 2000);
      });
  };

  return (
    <div>
      <Navbar />
      <div className="form-outermost">
        <h1>Login</h1>
        <form className="form-inner" onSubmit={handleSubmit}>
          {successMsg && <div className="success-msg">{successMsg}</div>}
          {errorMsg && <div className="error-msg">{errorMsg}</div>}

          <input
            type="email"
            placeholder="Enter your email address"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
