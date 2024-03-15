import React from "react";
import "./PostMainPage.css";

const PostMainPage = ({ postdata }) => {
  const currentpost = postdata;

  return (
    <div className="post-mainpage">
      <div className="section-row">
        <img className="prp" src={currentpost.profilePic} />
        <div className="section-col">
          <h1>{currentpost.name}</h1>
          <h2>{currentpost.email}</h2>
        </div>
      </div>
      <hr />
      <img className="pop" src={currentpost.postPic} />
      <hr />
      <p>
        <span>{currentpost.name} &nbsp;</span>
        {currentpost.description}
      </p>
    </div>
  );
};

export default PostMainPage;
