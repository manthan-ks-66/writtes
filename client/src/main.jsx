// react imports
import { createRoot } from "react-dom/client";
import { Navigate } from "react-router-dom";
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
import Dashboard from "./Dashboard.jsx";

// auth components (under protected routes - /auth)
import Register from "./components/Auth/Register.jsx";
import Login from "./components/Auth/Login.jsx";
import ResetPasswordInput from "./components/Auth/ResetPasswordInput.jsx";
import RegistrationOtpInput from "./components/Auth/RegistrationOtpInput.jsx";
import VerifyIdentity from "./components/Auth/VerifyIdentity.jsx";

// general components - Public access
import Home from "./components/Generals/Home.jsx";
import About from "./components/Generals/About.jsx";
import NotFound from "./components/Generals/NotFound.jsx";

// Routes Guard
import AuthLayout from "./components/Guard/AuthLayout.jsx";

// Post components - Public access
import PostPage from "./components/Post/PostPage.jsx";
import Explore from "./components/Post/Explore.jsx";
import QueryPosts from "./components/Post/QueryPosts.jsx";
import Author from "./components/Post/Author.jsx";

// Protected post components
import PublishPost from "./components/Post/PublishPost.jsx";

// Users components (under protected routes - /user)
import UserTabs from "./components/User/UserTabs.jsx";
import Settings from "./components/User/Settings.jsx";
import UserProfile from "./components/User/UserProfile.jsx";
import UserComments from "./components/User/UserComments.jsx";
import UserLikedPosts from "./components/User/UserLikedPosts.jsx";
import UserWrites from "./components/User/UserWrites.jsx";

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
        element: <Dashboard />,
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
            path: "/explore",
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
            path: "account",
            index: <UserProfile />,
            element: (
              <AuthLayout>
                <UserTabs />
              </AuthLayout>
            ),
            children: [
              {
                index: true,
                element: <Navigate to="manage-profile" replace />,
              },
              {
                path: "manage-profile",
                element: (
                  <AuthLayout>
                    <UserProfile />
                  </AuthLayout>
                ),
              },
              {
                path: "comments",
                element: (
                  <AuthLayout>
                    <UserComments />
                  </AuthLayout>
                ),
              },
              {
                path: "liked-posts",
                element: (
                  <AuthLayout>
                    <UserLikedPosts />
                  </AuthLayout>
                ),
              },
              {
                path: "your-writes",
                element: (
                  <AuthLayout>
                    <UserWrites />
                  </AuthLayout>
                ),
              },
              {
                path: "settings",
                element: (
                  <AuthLayout>
                    <Settings />
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
            <RegistrationOtpInput />
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
            <ResetPasswordInput />,
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
