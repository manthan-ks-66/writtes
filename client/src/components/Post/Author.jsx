// antd imports
import { Layout, Card, Avatar, Typography, Divider, Space, theme } from "antd";
import {
  UserOutlined,
  TwitterOutlined,
  GithubOutlined,
  LinkedinOutlined,
  GlobalOutlined,
  XOutlined,
  InstagramOutlined,
} from "@ant-design/icons";
import AntdSpin from "../AntdSpin.jsx";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

// react and service imports
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userService from "../../services/userService";

const Author = () => {
  const { username } = useParams();
  const [error, setError] = useState();
  const [author, setAuthor] = useState({});
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const handleFetchAuthor = async (username) => {
      try {
        const authorData = await userService.getAuthor(username);

        if (authorData) {
          setAuthor(authorData);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoader(false);
      }
    };

    handleFetchAuthor(username);
  }, [username]);

  const { token } = theme.useToken();

  if (loader) return <AntdSpin />;

  if (error && !loader) {
    return (
      <Layout
        style={{
          alignItems: "center",
          justifyContent: "center",
          background: token.colorBgContainer,
          minHeight: "100vh",
          padding: "10px",
        }}
      >
        <Text type="danger">{error}</Text>;
      </Layout>
    );
  }

  return (
    <Layout
      style={{
        alignItems: "center",
        justifyContent: "center",
        background: token.colorBgContainer,
        minHeight: "100vh",
        padding: "10px",
      }}
    >
      <Content style={{ display: "flex", justifyContent: "center" }}>
        <Card
          variant="borderless"
          style={{
            width: "100%",
            textAlign: "center",
          }}
        >
          {/* 1. Avatar Section */}
          <Avatar
            size={160}
            src={author.avatar?.url}
            icon={<UserOutlined />}
            style={{ border: "3.3px solid #55aa00" }}
          />

          {/* 2. Full Name and Username */}
          <div style={{ marginTop: "20px" }}>
            <Title level={2} style={{ marginBottom: "4px" }}>
              {author.fullName}
            </Title>
            <Text type="secondary" style={{ fontSize: "16px" }}>
              @{author.username}
            </Text>
          </div>

          <Divider />

          {/* 3. Bio & About Section */}
          <div style={{ textAlign: "left" }}>
            <Title level={4}>Bio</Title>
            <Paragraph style={{ fontSize: "16px" }}>
              {author?.bio === "" ? "No Bio" : author.bio}
            </Paragraph>

            <Title level={4} style={{ marginTop: "24px" }}>
              About
            </Title>
            <Paragraph type="secondary" style={{ lineHeight: "1.8" }}>
              {author?.about === "" ? "No About" : author.about}
            </Paragraph>
          </div>

          <Divider />

          {/* 4. Social Links */}
          <Space
            size="middle"
            style={{
              fontSize: "24px",
              display: "flex",
              justifyContent: "start",
            }}
          >
            {author?.x && (
              <a href={author?.x}>
                <XOutlined style={{ color: "#000", cursor: "pointer" }} />
              </a>
            )}

            {author?.github && (
              <a href={author?.github}>
                <GithubOutlined style={{ color: "#000", cursor: "pointer" }} />
              </a>
            )}

            {author?.linkedIn && (
              <a href={author?.linkedIn}>
                <LinkedinOutlined
                  style={{ color: "#0077b5", cursor: "pointer" }}
                />
              </a>
            )}

            {author?.instagram && (
              <a href={author?.instagram}>
                <InstagramOutlined
                  style={{ color: "#833ab4", cursor: "pointer" }}
                />
              </a>
            )}
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

export default Author;
