import { Content } from "antd/es/layout/layout";
import PostCard from "./PostCard.jsx";
import { Layout, theme, Pagination, Spin } from "antd";
import postService from "../../services/postService.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

function Explore() {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [error, setError] = useState("");

  let page = Number(searchParams.get("page")) || 1;
  let limit = Number(searchParams.get("limit")) || 5;

  const [loader, setLoader] = useState(true);

  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    postService
      .fetchPosts(`?page=${page}&limit=${limit}`)
      .then((data) => {
        if (data?.posts?.length === 0) {
          setPosts([]);
          setTotalPosts(0);
        } else {
          setPosts(data?.posts);
          setTotalPosts(data.totalPosts);
        }
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoader(false));
  }, [page, limit]);

  const layoutStyle = {
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "10px",
    background: token.colorBgContainer,
  };

  if (loader) {
    return (
      <Layout style={layoutStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin className="icon-spin" />
        </div>
      </Layout>
    );
  }

  if (!loader && posts?.length === 0) {
    return (
      <Layout style={layoutStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: token.colorTextSecondary,
          }}
        >
          <h2>You have reached at the end</h2>
        </div>
      </Layout>
    );
  }

  if (!loader && error) {
    <Layout style={layoutStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: token.colorTextSecondary,
        }}
      >
        <h2>Something went wrong</h2>
      </div>
    </Layout>;
  }

  if (!loader && posts?.length > 0) {
    return (
      <Layout
        style={{
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "10px",
          background: token.colorBgContainer,
        }}
      >
        <Content
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "40px 20px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {posts.map((post) => (
            <PostCard key={post._id} {...post} />
          ))}

          <div style={{ marginTop: "auto" }}>
            <Pagination
              onChange={(newPage) => {
                navigate(`/explore-posts?page=${newPage}&limit=${limit}`);
                window.scrollTo(0, 0);
              }}
              current={page}
              pageSize={limit}
              align="center"
              defaultCurrent={1}
              total={totalPosts}
            />
          </div>
        </Content>
      </Layout>
    );
  }
}

export default Explore;
