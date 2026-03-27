// react imports
import { createRoot } from "react-dom/client";
import "./index.css";

// state management providers
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ConfigProvider, theme as antdTheme } from "antd";
import NotificationProvider from "./context/NotificationProvider.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Root components
import App from "./App.jsx";
import DashBoard from "./DashBoard.jsx";

// auth components (under protected routes - /auth)
import Register from "./components/Auth/Register.jsx";
import Login from "./components/Auth/Login.jsx";
import ResetPassword from "./components/Auth/ResetPassword.jsx";
import OtpVerification from "./components/Auth/OtpVerification.jsx";
import VerifyIdentity from "./components/Auth/VerifyIdentity.jsx";

// general components (un-protected)
import Home from "./components/Home.jsx";
import About from "./components/About.jsx";
import NotFound from "./components/NotFound.jsx";

// Protection Container 
import AuthLayout from "./components/AuthLayout.jsx";

// Post components
import PostPage from "./components/Post/PostPage.jsx";
import Explore from "./components/Post/Explore.jsx";
import QueryPosts from "./components/Post/QueryPosts.jsx";
import Author from "./components/Post/Author.jsx";

// Protected publish post component
import PublishPost from "./components/Post/PublishPost.jsx";

// Users components (under protected routes - /user)
import UserSider from "./components/User/UserSider.jsx";
import Settings from "./components/Auth/Settings.jsx";
import UserProfile from "./components/User/UserProfile.jsx";
import UserComments from "./components/User/UserComments.jsx";
import UserLikedPosts from "./components/User/UserLikedPosts.jsx";

const postlyDarkTheme = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    // Brand color
    colorPrimary: "#55aa00",

    colorBgLayout: "#111827",
    colorBgContainer: "#111827",

    colorBgCard: "#1d2538be",

    // Text colors
    colorTextBase: "#E5E7EB",
    colorTextSecondary: "#9CA3AF",

    colorBgFooter: "#171d30",

    // Shape & font
    borderRadiusLG: 10,
    fontFamily: "-apple-system, Roboto, Oxygen, Ubuntu, Cantarell",
  },

  components: {
    Layout: {
      headerBg: "#171d30",
      bodyBg: "#1F2937",
    },
    Menu: {
      darkItemBg: "#171d30",
      darkItemSelectedBg: "#24273a47",
      darkItemSelectedColor: "#55aa00",
      darkItemHoverColor: "#55aa00",
    },
    Button: {
      colorPrimaryHover: "#6dd400",
      colorPrimaryActive: "#4c9900",
    },
  },
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <DashBoard />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/about",
            element: <About />,
          },
          {
            path: "/post/:_id/:slug",
            element: <PostPage />,
          },
          {
            path: "/explore-posts",
            element: <Explore />,
          },
          {
            path: "/search",
            element: <QueryPosts />,
          },
          {
            path: "/post/new/write",
            element: (
              // <AuthLayout>
              <PublishPost />
              // </AuthLayout>
            ),
          },
          {
            path: "/author/:username",
            element: <Author />,
          },
          {
            path: "/user",
            element: (
              <AuthLayout>
                <UserSider />
              </AuthLayout>
            ),
            children: [
              {
                path: "/user/:username",
                element: (
                  <AuthLayout>
                    <UserProfile />
                  </AuthLayout>
                ),
              },
              {
                path: "/user/comments",
                element: (
                  <AuthLayout>
                    <UserComments />
                  </AuthLayout>
                ),
              },
              {
                path: "/user/liked-posts",
                element: (
                  <AuthLayout>
                    <UserLikedPosts />
                  </AuthLayout>
                ),
              },
            ],
          },
          {
            path: "/post/:postId/:slug/edit",
            element: (
              <AuthLayout>
                <PublishPost />
              </AuthLayout>
            ),
          },
          {
            path: "/settings",
            element: (
              <AuthLayout>
                <Settings />
              </AuthLayout>
            ),
          },
        ],
      },
      {
        path: "/auth/register",
        element: (
          <AuthLayout>
            <Register />
          </AuthLayout>
        ),
      },
      {
        path: "/auth/register/verify",
        element: (
          <AuthLayout>
            <OtpVerification />
          </AuthLayout>
        ),
      },
      {
        path: "/auth/login",
        element: (
          <AuthLayout>
            <Login />
          </AuthLayout>
        ),
      },

      // verify email for password reset
      {
        path: "/auth/forgot-password",
        element: (
          <AuthLayout>
            <VerifyIdentity />,
          </AuthLayout>
        ),
      },

      // reset the user password
      {
        path: "/auth/forgot-password/reset/verify",
        element: (
          <AuthLayout>
            <ResetPassword />,
          </AuthLayout>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <ConfigProvider theme={postlyDarkTheme}>
        <NotificationProvider>
          <RouterProvider router={router} />
        </NotificationProvider>
      </ConfigProvider>
    </GoogleOAuthProvider>
  </Provider>,
);
