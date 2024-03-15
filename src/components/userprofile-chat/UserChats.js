import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import "./UserChats.css";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase/FirebaseConfig";
import { Link } from "react-router-dom";

const UserChats = ({ userdata }) => {
  let loggedUser = userdata;

  const [chats, setChats] = useState("");
  useEffect(() => {
    const getChatList = async () => {
      const chatlistArray = [];
      const q = query(collection(db, `allchat-${loggedUser[0].uid}`));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        chatlistArray.push({ ...doc.data(), id: doc.id });
      });
      setChats(chatlistArray);
    };
    getChatList();
  }, []);
  console.log(chats);

  return (
    <div>
      {userdata ? (
        <div>
          <Navbar userdata={loggedUser} />
          <div className="big-head-1">UserChats</div>
          <div className="chat-list">
            {chats.length > 0 ? (
              <div>
                {chats.map((chat) => {
                  <Link
                    style={{ textDecoration: "none" }}
                    to={`/msgptop/${chat.fuseruid}`}
                  >
                    <div className="chat-single">
                      <img src={chat.fprofilePic} className="nav-profile-pic" />
                      <p>{chat.fusername}</p>
                    </div>
                  </Link>;
                })}
              </div>
            ) : (
              <div>No Chats</div>
            )}
          </div>
        </div>
      ) : (
        <div>You are not Logged in</div>
      )}
    </div>
  );
};

export default UserChats;
