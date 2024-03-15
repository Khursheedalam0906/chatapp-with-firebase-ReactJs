import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import "./Friendsprofile.css";
import { Link, useParams } from "react-router-dom";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/FirebaseConfig";
import PostProfile from "../posts/PostProfile";

const Friendsprofile = ({ userdata }) => {
  const loggedUser = userdata; // logged person

  const { fuseruid } = useParams();
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const q = query(collection(db, "users"), where("uid", "==", fuseruid));
      const data = await getDocs(q);
      setUser(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
  }, []);

  //console.log(user);

  let currentuser = user; //search friend
  console.log(currentuser);

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
  }, [user]);
  console.log(posts);

  posts.sort((a, b) => {
    return b.date - a.date;
  });

  const addtouserchats = () => {
    //
    const addloggedtome = () => {
      const q = query(
        collection(db, `allchat-${loggedUser[0].uid}`),
        where("fuseruid", "==", fuseruid)
      );
      getDocs(q).then((data) => {
        console.log(data.docs);
        if (data.docs.length != 0) {
          console.log("User already added to chat list");
        } else {
          addDoc(collection(db, `allchat-${loggedUser[0].uid}`), {
            fuseruid: currentuser[0].uid,
            friendProfilePic: currentuser[0].profilePic,
            friendUserName: currentuser[0].name,
          })
            .then(() => {
              console.log("User added to chat section");
            })
            .catch(() => {
              console.log("user not added to chat section");
            });
        }
      });
    };

    const addloggedtofriend = () => {
      const q = query(
        collection(db, `allchat-${fuseruid}`),
        where("fuseruid", "==", loggedUser[0].uid)
      );
      getDocs(q).then((data) => {
        console.log(data.docs);
        if (data.docs.length != 0) {
          console.log("User already added to chat list");
        } else {
          addDoc(collection(db, `allchat-${fuseruid}`), {
            fuseruid: loggedUser[0].uid,
            friendProfilePic: loggedUser[0].profilePic,
            friendUserName: loggedUser[0].name,
          })
            .then(() => {
              console.log("User added to chat section");
            })
            .catch(() => {
              console.log("user not added to chat section");
            });
        }
      });
    };

    addloggedtome();
    addloggedtofriend();
  };

  return (
    <div className="userprofile">
      {user ? (
        <div>
          <Navbar userdata={loggedUser} />

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
              <div style={{ marginTop: 10 }}>
                {loggedUser[0]?.uid != currentuser[0]?.uid ? (
                  <Link to={`/msgptop/${currentuser[0].uid}`}>
                    <button
                      className="msg-btn-profile"
                      onClick={addtouserchats}
                    >
                      Message
                    </button>
                  </Link>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className="userpost-head">
            <p>{currentuser[0].name}'s Post</p>
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
          <div className="big-head">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default Friendsprofile;
