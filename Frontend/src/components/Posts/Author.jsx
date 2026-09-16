// antd imports
import { Layout, Card, Avatar, Typography, Divider, Space, theme } from "antd";
import {
  UserOutlined,
  GithubOutlined,
  LinkedinOutlined,
  XOutlined,
  InstagramOutlined,
  GithubFilled,
  LinkedinFilled,
} from "@ant-design/icons";
import AntdSpin from "../Generals/AntdSpin.jsx";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

// react and service imports
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userService from "../../utilities/services/userService.js";

const socialConfig = [
  {
    key: "x",
    label: "X",
    icon: <XOutlined style={{ color: "currentColor", fontSize: 16 }} />,
    color: "inherit",
  },
  {
    key: "github",
    label: "GitHub",
    icon: <GithubOutlined style={{ color: "currentColor", fontSize: 16 }} />,
    color: "inherit",
  },
  {
    key: "linkedIn",
    label: "LinkedIn",
    icon: <LinkedinOutlined style={{ color: "#0077b5", fontSize: 16 }} />,
    color: "#0077b5",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: <InstagramOutlined style={{ color: "#c13584", fontSize: 16 }} />,
    color: "#c13584",
  },
];

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

  console.log(author);

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

          {/* 3. Social Links */}
          {author?.socialLinks && (
            <Space
              size="middle"
              style={{
                marginTop: "20px",
                fontSize: "24px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {author?.socialLinks?.instagram && (
                <a href={author?.socialLinks?.instagram}>
                  <InstagramOutlined
                    style={{ color: "#833ab4", cursor: "pointer" }}
                  />
                </a>
              )}

              {author?.socialLinks?.x && (
                <a href={author?.socialLinks?.x}>
                  <XOutlined style={{ color: "#ffffff", cursor: "pointer" }} />
                </a>
              )}

              {author?.socialLinks?.github && (
                <a href={author?.socialLinks?.github}>
                  <GithubFilled
                    style={{ color: "#767676", cursor: "pointer" }}
                  />
                </a>
              )}

              {author?.socialLinks?.linkedIn && (
                <a href={author?.socialLinks?.linkedIn}>
                  <LinkedinFilled
                    style={{ color: "#0077b5", cursor: "pointer" }}
                  />
                </a>
              )}
            </Space>
          )}

          <Divider />

          {/* 4. Bio & About Section */}
          <div style={{ textAlign: "left" }}>
            <Title level={4}>Bio</Title>
            <Paragraph style={{ fontSize: "16px" }}>
              {author?.profile?.bio === "" ? "No Bio" : author?.profile?.bio}
            </Paragraph>

            <Title level={4} style={{ marginTop: "24px" }}>
              About
            </Title>
            <Paragraph style={{ lineHeight: "1.8" }}>
              {author?.profile?.about === ""
                ? "No About"
                : author?.profile?.about}
            </Paragraph>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default Author;
