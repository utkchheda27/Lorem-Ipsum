import React, { useEffect } from "react";
import axios from "axios";

const Homepage = () => {
  useEffect(() => {
    const getPosts = async () => {
      const data = await axios.get("/api/posts");
      console.log(data);
    };
    getPosts();
  }, []);
  return <div></div>;
};

export default Homepage;
