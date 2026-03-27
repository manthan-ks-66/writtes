// antd imports
import { Button, Layout, Menu, theme } from "antd";
import {
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LikeFilled,
  CommentOutlined,
} from "@ant-design/icons";
const { Header, Sider, Content } = Layout;

// react
import { useState, useMemo } from "react";
import { Outlet, useNavigate, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import UserProfile from "./UserProfile";

const userMenuItems = [
  {
    key: "1",
    path: "/user/profile",
    icon: <UserOutlined />,
    label: "Profile",
  },
  {
    key: "2",
    path: "/user/liked-posts",
    icon: <LikeFilled />,
    label: "Liked Posts",
  },
  {
    key: "3",
    path: "/user/comments",
    icon: <CommentOutlined />,
    label: "Your Comments",
  },
];

function UserSider() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  const userItems = useMemo(() =>
    userMenuItems.map((item) => ({
      ...item,
      onClick: () => navigate(item.path),
    })),
  );

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ height: "100vh", overflow: "auto" }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={userItems}
        />
      </Sider>
      <Layout style={{ minHeight: 0, overflow: "hidden" }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            flexShrink: 0,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default UserSider;
