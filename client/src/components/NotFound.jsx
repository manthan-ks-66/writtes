import React from "react";
import { Result, Button, Layout, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";

const { Content } = Layout;

const NotFound = () => {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  return (
    <Layout
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundColor: token.colorBgContainer,
      }}
    >
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Result
          status="404"
          title={<span style={{ color: token.colorText }}>404 Not Found</span>}
          subTitle={
            <span style={{ color: token.colorTextSecondary }}>
              Sorry, the page you visited does not exist.
            </span>
          }
          extra={
            <Button
              type="primary"
              size="large"
              icon={<HomeOutlined />}
              onClick={() => navigate("/")}
            >
              Back Home
            </Button>
          }
        />
      </Content>
    </Layout>
  );
};

export default NotFound;
