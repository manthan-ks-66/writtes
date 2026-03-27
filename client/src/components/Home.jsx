import {
  Layout,
  Typography,
  Button,
  Row,
  Col,
  Card,
  Tag,
  Space,
  theme,
} from "antd";
import {
  RocketOutlined,
  BulbOutlined,
  ExperimentOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

function Home() {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  // Sample data to show tech/innovation focus
  const featuredPosts = [
    {
      title: "The Future of AI in Web Dev",
      category: "Tech",
      icon: <RocketOutlined />,
    },
    {
      title: "Unlocking Creative Blocks",
      category: "Creativity",
      icon: <BulbOutlined />,
    },
    {
      title: "Sustainable Tech Innovations",
      category: "Innovation",
      icon: <ExperimentOutlined />,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: token.colorBgLayout }}>
      <Content
        style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}
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
            latest in tech. Postly is the home for thinkers and creators.
          </Paragraph>
          <Space size="middle">
            <Button
              type="primary"
              size="middle"
              onClick={() => navigate("/post/new/write")}
            >
              Start Writing
            </Button>
            <Button
              onClick={() => navigate("/explore-posts?page=1&limit=5")}
              size="middle"
            >
              Explore Posts
            </Button>
          </Space>
        </div>

        {/* Featured Posts Grid */}
        <Title level={4} style={{ marginBottom: 20, fontSize: "20px" }}>
          Most Liked
        </Title>
        <Row gutter={[16, 16]}>
          {featuredPosts.map((post, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card
                hoverable
                style={{
                  background: "#ffffff1e",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: 12,
                }}
                styles={{ padding: "20px" }}
              >
                <Tag
                  color="black"
                  style={{
                    marginBottom: 12,
                    borderRadius: 4,
                    fontSize: "10px",
                  }}
                >
                  {post.category}
                </Tag>
                <Title
                  level={5}
                  style={{ margin: "0 0 10px 0", fontSize: "16px" }}
                >
                  {post.title}
                </Title>
                <Paragraph
                  ellipsis={{ rows: 2 }}
                  style={{ fontSize: "13px", color: token.colorTextSecondary }}
                >
                  This is a brief summary of the post content to spark interest
                  in the reader...
                </Paragraph>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 16,
                  }}
                >
                  <Text style={{ fontSize: "12px" }} type="secondary">
                    5 min read
                  </Text>
                  <Button
                    type="link"
                    size="small"
                    style={{ padding: 0, color: token.colorPrimary }}
                  >
                    Read More
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Categories / Focus Areas */}
        <Row gutter={[24, 24]} style={{ marginTop: 50 }}>
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
