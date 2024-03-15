import React, { useState } from "react";
import Navbar from "../navbar/Navbar";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../../firebase/FirebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [profilePic, setProfilePic] = useState();

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const handleProductImg = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      setProfilePic(selectedFile);
    } else {
      setErrorMsg("Please select your profile picture");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const uid = userCredential.user.uid;
        const storageref = ref(storage, `profile-images/${Date.now()}`);
        uploadBytes(storageref, profilePic)
          .then((snapShot) => {
            alert("Image Uploaded");
            getDownloadURL(storageref).then((url) => {
              addDoc(collection(db, `users`), {
                name,
                email,
                dob,
                profilePic: url,
                uid,
              });
            });
            setSuccessMsg("user Added Successfully");
            setTimeout(() => {
              navigate("/login");
            }, 3000);
          })
          .catch((error) => {
            setErrorMsg(error.message);
            setTimeout(() => {
              setErrorMsg("");
            }, 2000);
          });
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
        <h1>Signup</h1>
        <form className="form-inner" onSubmit={handleSubmit}>
          {successMsg && <div className="success-msg">{successMsg}</div>}
          {errorMsg && <div className="error-msg">{errorMsg}</div>}
          <input
            type="text"
            placeholder="Enter Your Name"
            onChange={(e) => setName(e.target.value)}
          />
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
          <input
            type="date"
            placeholder="Chose Date of Birth"
            onChange={(e) => setDob(e.target.value)}
          />
          <input
            type="file"
            accept="image/png, image/jpg, image/gif, image/jpeg, image/webp"
            placeholder="Chose a profile Picture"
            onChange={handleProductImg}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
