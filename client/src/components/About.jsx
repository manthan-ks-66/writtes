import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Space,
  theme,
  Divider,
} from "antd";
import {
  GlobalOutlined,
  ThunderboltOutlined,
  EditOutlined,
  CodeOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

function About() {
  const { token } = theme.useToken();

  const values = [
    {
      title: "Sharing Ideas",
      desc: "A platform built for voices that need to be heard. We believe one shared thought can spark a global movement.",
      icon: <GlobalOutlined />,
    },
    {
      title: "Innovations",
      desc: "Tracking the frontier of what's next. From breakthrough startups to world-changing scientific discoveries.",
      icon: <ThunderboltOutlined />,
    },
    {
      title: "Creativity",
      desc: "Empowering the artist within the writer. Design, art, and storytelling are at the heart of our community.",
      icon: <EditOutlined />,
    },
    {
      title: "Tech Focus",
      desc: "Deep dives into software, hardware, and the digital tools shaping our future everyday lives.",
      icon: <CodeOutlined />,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: token.colorBgLayout }}>
      <Content
        style={{ padding: "60px 20px", maxWidth: "900px", margin: "0 auto" }}
      >
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <Title level={2} style={{ fontSize: "24px", letterSpacing: "1px" }}>
            The Story of{" "}
            <span style={{ color: token.colorPrimary }}>PROSE</span>
          </Title>
          <Paragraph
            style={{
              color: token.colorTextSecondary,
              fontSize: "14px",
              lineHeight: "1.8",
            }}
          >
            Prose, founded with a simple mission: to bridge the gap between
            complex technology and human storytelling. In a world of
            fast-scrolling content, we created a space for meaningful innovation
            and creative depth.
          </Paragraph>
        </div>

        <Divider style={{ borderColor: "rgba(255,255,255,0.1)" }} />

        {/* Values Grid */}
        <Row gutter={[24, 24]} style={{ marginTop: 40 }}>
          {values.map((item, index) => (
            <Col xs={24} sm={12} key={index}>
              <Card
                variant="bordered"
                style={{
                  background: "#ffffff0a", // Slightly subtler than login for readability
                  borderRadius: 16,
                  height: "100%",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <Space vertical size="small">
                  <div
                    style={{
                      fontSize: "20px",
                      color: token.colorPrimary,
                      background: "#55aa0015",
                      padding: "8px",
                      borderRadius: "8px",
                      display: "inline-block",
                    }}
                  >
                    {item.icon}
                  </div>
                  <Title
                    level={5}
                    style={{ margin: "10px 0 5px", fontSize: "16px" }}
                  >
                    {item.title}
                  </Title>
                  <Text
                    style={{
                      fontSize: "13px",
                      color: token.colorTextSecondary,
                    }}
                  >
                    {item.desc}
                  </Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Mission Statement Footer */}
        <div
          style={{
            marginTop: 80,
            padding: "40px",
            textAlign: "center",
            background: "#ffffff1e",
            borderRadius: 20,
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Title level={4} style={{ fontSize: "18px", marginBottom: 15 }}>
            Our Vision
          </Title>
          <Paragraph
            style={{ fontSize: "14px", fontStyle: "italic", margin: 0 }}
          >
            "To become the world's most trusted archive for human creativity and
            technical advancement."
          </Paragraph>
        </div>
      </Content>
    </Layout>
  );
}

export default About;
