import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import "./UserProfile.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/FirebaseConfig";
import PostProfile from "../posts/PostProfile";

const UserProfile = ({ userdata }) => {
  let currentuser = userdata;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPost = async () => {
      const postArray = [];
      const q = query(
        collection(db, "posts"),
        where("post_user_uid", "==", currentuser[0]?.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        postArray.push({ ...doc.data(), id: doc.id });
      });
      setPosts(postArray);
    };
    getPost();
  }, []);

  posts.sort((a, b) => {
    return b.date - a.date;
  });

  //console.log("Bye", posts);

  return (
    <div className="userprofile">
      {userdata ? (
        <div>
          <Navbar userdata={currentuser} />
          <div className="section1">
            <div className="left">
              <img
                src={currentuser[0]?.profilePic}
                className="userprofile-image"
              />
            </div>
            <div className="right">
              <h1>{currentuser[0]?.name}</h1>
              <h1>{currentuser[0]?.email}</h1>
            </div>
          </div>
          <div className="userpost-head">
            <p>Your Post</p>
          </div>
          <div className="section2">
            {posts.length > 0 ? (
              <>
                {posts.map((post) => (
                  <PostProfile key={post.id} postdata={post} />
                ))}
              </>
            ) : (
              <div className="big-head">No Post</div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <Navbar />
          <p>Not Logged In</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
