import React, { useState } from "react";
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase/FirebaseConfig";
import { addDoc, collection } from "firebase/firestore";

const Addpost = ({ userdata }) => {
  let currentuser = userdata;
  const [description, setDescription] = useState("");
  const [postPic, setPostPic] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //month from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getFullYear();
  var hours = dateObj.getHours();
  var minutes = dateObj.getMinutes();
  var seconds = dateObj.getSeconds();

  const handlePostImg = (e) => {
    let selectFile = e.target.files[0];
    if (selectFile) {
      setPostPic(selectFile);
      setErrorMsg("");
    } else {
      setErrorMsg("Plese select post Image");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = currentuser[0];
    let newDate = `${year}${month}${day}${hours}${minutes}${seconds}`;
    const storageref = ref(storage, `posts/${newDate}`);
    uploadBytes(storageref, postPic)
      .then(() => {
        getDownloadURL(storageref).then((url) => {
          addDoc(collection(db, "posts"), {
            name: user.name,
            email: user.email,
            description,
            profilePic: user.profilePic,
            postPic: url,
            post_user_uid: user.uid,
            date: parseInt(newDate),
          })
            .then(() => {
              setSuccessMsg("Posted Successfully");
              setTimeout(() => {
                setSuccessMsg("");
              }, 2000);
            })
            .catch((error) => {
              setErrorMsg(error.message);
              setTimeout(() => {
                setErrorMsg("");
              }, 2000);
            });
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  //   let newDate = `"Hello",${year}${month}${day}${hours}${minutes}${seconds}`;
  //   console.log(newDate);

  return (
    <div>
      {userdata ? (
        <div>
          <Navbar userdata={currentuser} />
          <div className="form-outermost">
            <h1>Add Post</h1>
            <form className="form-inner" onSubmit={handleSubmit}>
              {successMsg && (
                <>
                  <div className="success-msg">{successMsg}</div>
                </>
              )}
              {errorMsg && (
                <>
                  <div className="error-msg">{errorMsg}</div>
                </>
              )}
              <input
                onChange={handlePostImg}
                type="file"
                accept="image/png, image/jpg, image/gif, image/jpeg image/webp"
                placeholder="Choose a Post Picture"
              />
              <input
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Description"
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <Navbar />
          <div>MainPage</div>
        </div>
      )}
    </div>
  );
};

export default Addpost;
