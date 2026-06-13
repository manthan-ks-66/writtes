import {
  Layout,
  Typography,
  Button,
  Row,
  Col,
  Card,
  Tag,
  Space,
  Divider,
  theme,
} from "antd";
import {
  RocketOutlined,
  BulbOutlined,
  ExperimentOutlined,
  ShareAltOutlined,
  UserOutlined,
  LockOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

function Home() {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(null);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 1500);
  };

  const credentialRow = (icon, label, value, field) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusSM,
        padding: "10px 14px",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: token.colorPrimary, fontSize: 15 }}>{icon}</span>
        <Text type="secondary" style={{ fontSize: 12, minWidth: 70 }}>
          {label}
        </Text>
        <Text strong style={{ fontSize: 13, letterSpacing: "0.3px" }}>
          {value}
        </Text>
      </div>
      <Button
        type="text"
        size="small"
        icon={<CopyOutlined />}
        onClick={() => handleCopy(value, field)}
        style={{
          color:
            copied === field ? token.colorSuccess : token.colorTextTertiary,
          fontSize: 12,
          padding: "0 6px",
        }}
      >
        {copied === field ? "Copied!" : "Copy"}
      </Button>
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh", background: token.colorBgLayout }}>
      <Content
        style={{
          padding: "40px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Hero Section */}
        <div
          style={{ textAlign: "center", marginBottom: 60, padding: "0 20px" }}
        >
          <Title level={2} style={{ marginBottom: 10, fontSize: "28px" }}>
            Where <span style={{ color: token.colorPrimary }}>Innovation</span>{" "}
            Meets Conversation
          </Title>
          <Paragraph
            style={{
              color: token.colorTextSecondary,
              fontSize: "14px",
              maxWidth: "600px",
              margin: "0 auto 24px",
            }}
          >
            Share your boldest ideas, showcase your creativity, and explore the
            latest in tech. WRITTES is the home for thinkers and creators.
          </Paragraph>
          <Space size="middle" wrap>
            <Button
              type="primary"
              size="middle"
              onClick={() => navigate("/post/new/write")}
            >
              Start Writing
            </Button>
            <Button
              onClick={() => navigate("/explore?page=1&limit=5")}
              size="middle"
            >
              Explore Posts
            </Button>
          </Space>
        </div>

        {/* Recruiter Demo Access Card */}
        <Row justify="center" style={{ marginBottom: 50 }}>
          <Col xs={24} sm={20} md={16} lg={12}>
            <Card
              style={{
                background: token.colorFillAlter,
                border: `1px solid ${token.colorBorderSecondary}`,
              }}
              styles={{ body: { padding: "28px 28px 24px" } }}
            >
              {/* Card Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 6,
                }}
              >
                <Tag color="blue" style={{ margin: 0, fontWeight: 600 }}>
                  RECRUITER ACCESS
                </Tag>
              </div>

              <Title level={5} style={{ margin: "0 0 4px", fontSize: 16 }}>
                Demo Login Credentials
              </Title>
              <Text
                type="secondary"
                style={{ fontSize: 12, display: "block", marginBottom: 18 }}
              >
                Use the credentials below to explore the platform as a fully
                authenticated user.
              </Text>

              <Divider style={{ margin: "0 0 16px" }} />

              {/* Credentials */}
              <Space direction="vertical" size={10} style={{ width: "100%" }}>
                {credentialRow(
                  <UserOutlined />,
                  "Username",
                  "tester",
                  "username",
                )}
                {credentialRow(
                  <LockOutlined />,
                  "Password",
                  "Test@123",
                  "password",
                )}
              </Space>

              <Divider style={{ margin: "16px 0 14px" }} />

              <div style={{ marginTop: 16 }}>
                <Button type="primary" block onClick={() => navigate("/login")}>
                  Go to Login
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Categories / Focus Areas */}
        <Row gutter={[24, 24]}>
          {[
            {
              label: "Share Ideas",
              icon: <ShareAltOutlined />,
              desc: "Connect with a global audience.",
            },
            {
              label: "Innovations",
              icon: <ExperimentOutlined />,
              desc: "The latest in tech and science.",
            },
            {
              label: "Creativity",
              icon: <BulbOutlined />,
              desc: "Art, design, and original thought.",
            },
          ].map((item, index) => (
            <Col xs={24} sm={8} key={index}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "24px",
                    color: token.colorPrimary,
                    marginBottom: 8,
                  }}
                >
                  {item.icon}
                </div>
                <Title level={5} style={{ margin: 0, fontSize: "16px" }}>
                  {item.label}
                </Title>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {item.desc}
                </Text>
              </div>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
}

export default Home;
