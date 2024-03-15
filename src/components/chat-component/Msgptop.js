import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import "./Msgptop.css";
import { useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/FirebaseConfig";

const Msgptop = ({ userdata }) => {
  const loggedUser = userdata[0];

  const { fuseruid } = useParams();
  const [user, setUser] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const q = query(collection(db, "users"), where("uid", "==", fuseruid));
      getDocs(q).then((data) => {
        setUser(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
    };
    getUser();
  }, []);

  let currentuser = user[0];
  let Msgdocptop;

  useEffect(() => {
    if (loggedUser.uid > fuseruid) {
      Msgdocptop = `${loggedUser.uid}_${fuseruid}`;
    }
    if (loggedUser.uid < fuseruid) {
      Msgdocptop = `${fuseruid}_${loggedUser.uid}`;
    }
  });

  const [typedmsg, setTypedmsg] = useState("");
  const [ptopmsgs, setPtopmsgs] = useState([]);

  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1;
  var day = dateObj.getUTCDate();
  var year = dateObj.getFullYear();
  var hours = dateObj.getHours();
  var mins = dateObj.getMinutes();
  var seconds = dateObj.getSeconds();

  const sendmsg = (e) => {
    e.preventDefault();
    let newDate = `${year}${month}${day}${hours}${mins}${seconds}`;
    addDoc(collection(db, `chats-${Msgdocptop}`), {
      typedmsg,
      from: loggedUser.uid,
      date: newDate,
    })
      .then(() => {
        console.log("Msg save to successfully");
        typedmsg("");
      })
      .catch(() => {
        console.log("Msg not saved");
      });
  };

  useEffect(() => {
    const getMessages = async () => {
      const postsArray = [];
      const postsref = collection(db, `chat-${Msgdocptop}`);
      const q = query(postsref, orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        postsArray.push({ ...doc.data(), id: doc.id });
      });
      setPtopmsgs(postsArray);
    };
  }, [ptopmsgs]);

  return (
    <div>
      {currentuser ? (
        <div>
          <Navbar userdata={loggedUser} />
          <div className="p2p-section-1">
            <div className="p2p-section-1">
              <img src={currentuser.profilePic} className="nav-profile-pic" />
              <p>{currentuser.name}</p>
            </div>
          </div>
          <div className="p2p-section-2">
            {ptopmsgs.length > 0 ? (
              <>
                {ptopmsgs.length > 0 ? (
                  <>
                    {ptopmsgs.map((msg) => (
                      <div key={msg.id}>
                        {msg.form == loggedUser.uid ? (
                          <div className="right-msg">
                            <p>{msg.typedmsg}</p>
                          </div>
                        ) : (
                          <div className="left-msg">
                            <p>{msg.typedmsg}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <div className="big-head">No Messages</div>
            )}
          </div>
          <div className="p2p-section-3">
            <input
              value={typedmsg}
              onChange={(e) => {
                setTypedmsg(e.target.value);
              }}
            />
            <button onClick={sendmsg}>Send</button>
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

export default Msgptop;
