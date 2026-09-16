import { useEffect, useState } from "react";
import userService from "../../utilities/services/userService.js";
import AntdSpin from "../Generals/AntdSpin.jsx";

import { Typography } from "antd";
const { Text } = Typography;

import PostCard2 from "../Posts/PostCard2.jsx";

function UserLikedPosts() {
  const [userLikedPosts, setUserLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    userService
      .getUserLikedPosts()
      .then((data) => {
        setUserLikedPosts(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AntdSpin />;

  if (!loading && error)
    return (
      <div style={{ justifySelf: "center" }}>
        <Text type="danger">{error}</Text>
      </div>
    );

  if (userLikedPosts && !loading)
    return userLikedPosts.map((userLikedPost) => (
      <PostCard2 key={userLikedPost?.userLikedPost?._id} {...userLikedPost} />
    ));
}

export default UserLikedPosts;
