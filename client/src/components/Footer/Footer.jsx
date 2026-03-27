import { Layout, Row, Col, Typography, Space, Divider, theme } from "antd";
import {
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import Logo from "../Logo/Logo.jsx";

const { Footer } = Layout;
const { Text, Title } = Typography;

function AppFooter() {
  const { token } = theme.useToken();

  return (
    <Footer
      style={{
        background: token.colorBgFooter, // #000102 from your theme
        color: token.colorTextSecondary,
        padding: "40px 20px 20px",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Row gutter={[32, 32]} justify="space-between">
          {/* Brand Section */}
          <Col xs={24} sm={8}>
            <Space vertical size="small">
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Logo />
              </div>
              <Text
                style={{ fontSize: "12px", color: token.colorTextSecondary }}
              >
                A space for sharing ideas, tech innovations, and human
                creativity.
              </Text>
            </Space>
          </Col>

          {/* Quick Links */}
          <Col xs={12} sm={4}>
            <Title level={5} style={{ fontSize: "14px", marginBottom: "16px" }}>
              Platform
            </Title>
            <Space vertical style={{ fontSize: "12px" }}>
              <Link to="/" style={{ color: token.colorTextSecondary }}>
                Home
              </Link>
              <Link to="/about" style={{ color: token.colorTextSecondary }}>
                About
              </Link>
              <Link to="/posts" style={{ color: token.colorTextSecondary }}>
                Explore
              </Link>
            </Space>
          </Col>

          {/* Social Section */}
          <Col xs={12} sm={4}>
            <Title level={5} style={{ fontSize: "14px", marginBottom: "16px" }}>
              Connect
            </Title>
            <Space size="middle" style={{ fontSize: "18px" }}>
              <TwitterOutlined
                className="footer-icon"
                style={{ cursor: "pointer" }}
              />
              <GithubOutlined
                className="footer-icon"
                style={{ cursor: "pointer" }}
              />
              <LinkedinOutlined
                className="footer-icon"
                style={{ cursor: "pointer" }}
              />
              <GlobalOutlined
                className="footer-icon"
                style={{ cursor: "pointer" }}
              />
            </Space>
          </Col>
        </Row>

        <Divider
          style={{ borderColor: "rgba(255,255,255,0.05)", margin: "30px 0" }}
        />

        <Row justify="space-between" align="middle">
          <Col>
            <Text style={{ fontSize: "11px", color: "#4B5563" }}>
              © {new Date().getFullYear()} Postly Inc. All rights reserved.
            </Text>
          </Col>
          <Col>
            <Space size="large" style={{ fontSize: "11px" }}>
              <Link to="/privacy" style={{ color: "#4B5563" }}>
                Privacy Policy
              </Link>
              <Link to="/terms" style={{ color: "#4B5563" }}>
                Terms of Service
              </Link>
            </Space>
          </Col>
        </Row>
      </div>

      <style>{`
        .footer-icon:hover {
          color: ${token.colorPrimary} !important;
          transition: 0.3s;
        }
      `}</style>
    </Footer>
  );
}

export default AppFooter;
