import Logo from "../Logo/Logo.jsx";
import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Space,
  Avatar,
  Drawer,
  Grid,
  theme,
  Input,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  MenuOutlined,
  SettingOutlined,
  EditOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import "./NavBar.css";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import authService from "../../services/authService.js";
import { logout } from "../../store/authSlice.js";
import { useDispatch } from "react-redux";
import { useNotify } from "../../context/NotificationProvider.jsx";

const { Header } = Layout;
const { useBreakpoint } = Grid;

const HEADER_HEIGHT = 64;

function NavBar() {
  const notify = useNotify();

  const { token } = theme.useToken();

  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();

  const screens = useBreakpoint();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Desktop view is true if screen size is MD or larger
  const isDesktop = screens.md;

  const toggleDrawer = () => setDrawerVisible(!drawerVisible);

  const logoutUser = async () => {
    authService
      .logoutUser()
      .then(() => {
        dispatch(logout());

        notify.api.success({
          title: "Logged out successfully",
          placement: "top",
        });

        navigate("/");
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  };

  const navItems = [
    {
      label: "Home",
      key: "/",
    },
    {
      label: "About",
      key: "/about",
    },
    {
      label: "Explore",
      key: "/explore-posts?page=1&limit=5",
    },
    {
      label: "Write",
      key: "/post/new/write",
      icon: <EditOutlined />,
    },
  ];

  const userItems = [
    {
      label: "Profile",
      key: `/user/@${user?.username}`,
      icon: <UserOutlined />,
    },
    {
      label: "Settings",
      key: "/user-settings",
      icon: <SettingOutlined />,
    },
    {
      label: "Logout",
      danger: true,
      icon: <PoweroffOutlined />,
      onClick: logoutUser,
    },
  ];

  return (
    <Layout style={{ width: "100%" }}>
      <Header
        style={{
          width: "100%",
          height: HEADER_HEIGHT,
          display: "flex",
          alignItems: "center",
          padding: "0 80px",
          justifyContent: user ? "center" : "space-between",
          position: "fixed",
          zIndex: 1000,
          top: 0,
          left: 0,
        }}
      >
        {/* 1. MOBILE HAMBURGER */}
        {!isDesktop && (
          <Button
            type="text"
            icon={<MenuOutlined style={{ color: "white", fontSize: "20px" }} />}
            onClick={toggleDrawer}
            style={{ position: "absolute", left: 10 }}
          />
        )}

        {/* 2. LOGO  */}
        <div
          className="demo-logo"
          style={{
            flex: user && isDesktop ? 0 : isDesktop ? 0 : 1,
            textAlign: !isDesktop && !user ? "right" : "center",
            order: isDesktop ? 0 : 2,
          }}
        >
          <Link style={{ color: token.colorTextBase }} to="/">
            <Logo />
          </Link>
        </div>

        {/* 3. DESKTOP MENU */}
        {isDesktop && (
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            items={navItems}
            style={{
              marginLeft: "3vw",
              flex: 1,
              justifyContent: "flex-start",
              minWidth: 0,
            }}
            onClick={({ key }) => navigate(key)}
          />
        )}

        {/* 4. RIGHT SECTION */}
        <div
          style={{
            order: 3,
            display: "flex",
            alignItems: "center",
            position: !isDesktop ? "absolute" : "static",
            right: !isDesktop ? 20 : "auto",
            gap: "12px",
          }}
        >
          {/* SEARCH WRAPPER */}

          {isDesktop || showMobileSearch ? (
            <Input.Search
              onSearch={(value) =>
                navigate(`/search?query=${value}&page=1&limit=5`)
              }
              placeholder="search"
              style={{
                background: "#21293deb",
                color: "#959595",
                width: isDesktop ? undefined : 200,
              }}
              className="navbar-search"
              onBlur={() => !isDesktop && setShowMobileSearch(false)}
              autoFocus={!isDesktop}
            />
          ) : (
            <Button
              type="text"
              icon={
                <SearchOutlined style={{ color: "white", fontSize: "20px" }} />
              }
              onClick={() => setShowMobileSearch(true)}
            />
          )}

          {user ? (
            <Dropdown
              menu={{
                items: userItems,
                onClick: ({ key }) => {
                  if (key.startsWith("/")) navigate(key);
                },
              }}
              trigger={["click"]}
            >
              <Space style={{ cursor: "pointer" }}>
                <Avatar
                  src={user?.avatar?.url}
                  size={isDesktop ? 47 : 40}
                  icon={<UserOutlined />}
                />
              </Space>
            </Dropdown>
          ) : (
            isDesktop && (
              <Space>
                <Link to="/auth/login">
                  <Button>Login</Button>
                </Link>
                <Link to="/auth/register">
                  <Button type="primary">Register</Button>
                </Link>
              </Space>
            )
          )}
        </div>

        {/* MOBILE DRAWER */}
        <Drawer
          title="Menu"
          placement="left"
          onClose={toggleDrawer}
          open={drawerVisible}
          styles={{ body: { padding: 0 } }}
        >
          <Menu
            mode="vertical"
            items={navItems}
            onClick={({ key }) => {
              navigate(key);
              setDrawerVisible(false);
            }}
          />
          {!user && (
            <div
              style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <Link to="/auth/login" onClick={toggleDrawer}>
                <Button block>Login</Button>
              </Link>
              <Link to="/auth/register" onClick={toggleDrawer}>
                <Button type="primary" block>
                  Register
                </Button>
              </Link>
            </div>
          )}
        </Drawer>
      </Header>
      <div style={{ height: HEADER_HEIGHT }} />
    </Layout>
  );
}

export default NavBar;
