import { Spin, theme, Layout } from "antd";

function AntdSpin() {
  const { token } = theme.useToken();

  const contentStyle = {
    padding: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    borderRadius: 4,
    background: token.colorBgLayout,
  };

  const layoutStyle = {
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "10px",
    background: token.colorBgContainer,
  };
  return (
    <Layout style={layoutStyle}>
      <Spin style={contentStyle} size="large"></Spin>
    </Layout>
  );
}

export default AntdSpin;
