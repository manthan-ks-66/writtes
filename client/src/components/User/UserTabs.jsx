import { Layout, Tabs, theme } from "antd";
import {
  UserOutlined,
  CommentOutlined,
  LikeOutlined,
  SettingOutlined,
  FormOutlined,
} from "@ant-design/icons";

import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Content } = Layout;
const userTabItems = [
  {
    key: "/account/manage-profile",
    icon: <UserOutlined />,
    label: "Profile",
  },
  {
    key: "/account/settings",
    icon: <SettingOutlined />,
    label: "Settings",
  },
  {
    key: "/account/liked-posts",
    icon: <LikeOutlined />,
    label: "Liked Posts",
  },
  {
    key: "/account/your-writes",
    icon: <FormOutlined />,
    label: "Your Writes",
  },
  {
    key: "/account/comments",
    icon: <CommentOutlined />,
    label: "Comments",
  },
];

function UserTabs() {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout
      style={{
        minHeight: "100vh",
        overflow: "hidden",
        padding: "10px 80px",
        backgroundColor: token.colorBgContainer,
      }}
    >
      <Tabs
        activeKey={location.pathname}
        onChange={(key) => navigate(key)}
        items={userTabItems}
      />
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
}

export default UserTabs;
