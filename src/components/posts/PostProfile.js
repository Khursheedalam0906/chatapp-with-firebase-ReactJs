import React from "react";
import "./PostProfile.css";

const PostProfile = ({ postdata }) => {
  let currentpost = postdata;

  //console.log("Hello", currentpost);
  return (
    <div className="post-profile">
      <img src={currentpost.postPic} />
      <p className="description">
        {currentpost.description.substring(0, 70) + " ..."}
      </p>
    </div>
  );
};

export default PostProfile;
