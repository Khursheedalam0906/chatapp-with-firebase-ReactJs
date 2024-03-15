import React, { useEffect, useState } from "react";
import Navbar from "./navbar/Navbar";
import "./MainPage.css";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import PostMainPage from "./posts/PostMainPage";

const MainPage = ({ userdata }) => {
  let currentuser = userdata;
  //console.log("Hello", currentuser);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const postsArray = [];
      const q = query(collection(db, "posts"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        postsArray.push({ ...doc.data(), id: doc.id });
      });
      setPosts(postsArray);
    };
    getPosts();
  }, []);

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));

      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
  shuffleArray(posts);

  return (
    <div>
      {userdata ? (
        <div>
          <Navbar userdata={currentuser} />
          <div className="mainpage-outer">
            {posts.length > 0 ? (
              <div>
                {posts.map((post) => (
                  <PostMainPage key={post.id} postdata={post} />
                ))}
              </div>
            ) : (
              <div className="big-head">Try Refreshing the Page...</div>
            )}
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

export default MainPage;
