import { Layout, theme, Pagination, Spin, Alert } from "antd";
import { Content } from "antd/es/layout/layout";

import postService from "../../services/postService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import PostCard from "./PostCard";

function QueryPosts() {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  let page = Number(searchParams.get("page"));
  let limit = Number(searchParams.get("limit"));
  let query = searchParams.get("query");

  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(1);
  const [loader, setLoader] = useState(true);

  const [error, setError] = useState();

  useEffect(() => {
    setLoader(true);

    postService
      .fetchQueryPost(`?query=${query}&page=${page}&limit=${limit}`)
      .then((data) => {
        if (Object.keys(data?.data).length === 0) {
          setPosts([]);
          setTotalPosts(0);
        } else {
          setPosts(data?.data?.posts);
          setTotalPosts(data?.data?.totalPosts);
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoader(false));
  }, [page, limit, query]);

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
            alignItems: "center",
            justifyContent: "center",
            background: token.colorBgContainer,
          }}
        >
          <h2
            style={{
              textAlign: "center",
              color: token.colorText,
            }}
          >
            No posts found!
          </h2>
        </div>
      </Layout>
    );
  }

  if (!loader && error) {
    return (
      <Layout style={layoutStyle}>
        <Alert title={error} type="error" />
      </Layout>
    );
  }

  return (
    <Layout style={layoutStyle}>
      <Content
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "40px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {posts?.map((post) => (
          <PostCard key={post._id} {...post} />
        ))}

        <div style={{ marginTop: "auto" }}>
          <Pagination
            onChange={(newPage) => {
              navigate(`/search?query=${query}&page=${newPage}&limit=${limit}`);
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

export default QueryPosts;
