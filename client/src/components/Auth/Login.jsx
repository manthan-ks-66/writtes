// react imports
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

// redux imports
import { useDispatch } from "react-redux";
import authService from "../../services/authService.js";
import { login } from "../../store/authSlice.js";

// antd imports
import { Button, Form, Input, Layout, Divider } from "antd";
import { useNotify } from "../../context/NotificationProvider.jsx";
import { theme, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

// logo and google btn
import Logo from "../Logo/Logo.jsx";
import GoogleBtn from "./GoogleBtn.jsx";

const { Text } = Typography;

function Login() {
  const notify = useNotify();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { token } = theme.useToken();

  const handleLogin = async (data) => {
    try {
      const user = await authService.loginUser(data);

      if (user) {
        dispatch(login(user));

        notify.api.success({
          title: `Welcome Back, ${user.fullName}`,
          description: "You are now logged in",
          placement: "top",
        });
      }

      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      style={{
        alignItems: "center",
        justifyContent: "center",
        background: token.colorBgContainer,
        minHeight: "100vh",
        padding: "10px",
      }}
    >
      <Link to="/">
        <Logo />
      </Link>

      <div
        style={{
          width: "100%",
          maxWidth: "470px",
          padding: "30px 20px",
          backgroundColor: "#ffffff1e",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 20,
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0)",
        }}
      >
        <h2
          style={{
            margin: "10px 0 10px 0",
            textAlign: "center",
            color: token.colorText,
          }}
        >
          Login
        </h2>

        <div
          style={{
            minHeight: "20px",
            margin: "10px 0",
            textAlign: "center",
            visibility: error ? "visible" : "hidden",
          }}
          className="errorContainer"
        >
          {error && (
            <Text
              style={{ display: "flex", justifyContent: "center" }}
              type="danger"
            >
              {error}
            </Text>
          )}
        </div>

        <div style={{ margin: "15px 0 15px 0", textAlign: "center" }}>
          <span style={{ color: token.colorTextSecondary }}>
            Don't have an account?
          </span>
          &nbsp;
          <Link
            to="/auth/register"
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color: token.colorPrimary,
            }}
          >
            Register here
          </Link>
        </div>

        <GoogleBtn />

        <div
          style={{
            color: token.colorTextSecondary,
          }}
          className="authDivider"
        >
          <Divider>OR</Divider>
        </div>

        <form style={{ width: "100%" }} onSubmit={handleSubmit(handleLogin)}>
          <Form layout="vertical" component={false}>
            <Form.Item
              label="Username"
              validateStatus={errors.username ? "error" : ""}
              help={errors.username?.message}
            >
              <Controller
                name="username"
                control={control}
                rules={{
                  required: "Username is required",
                  pattern: {
                    value: /^[a-zA-Z0-9_-]+$/,
                    message: "Only _ and - are allowed",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    prefix={<UserOutlined />}
                    placeholder="username or email"
                    size="middle"
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              validateStatus={errors.password ? "error" : ""}
              help={errors.password?.message}
            >
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  pattern: {
                    value:
                      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
                    message:
                      "Must include letters, digits, and one special character",
                  },
                }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    prefix={<LockOutlined />}
                    placeholder="password"
                    size="middle"
                  />
                )}
              />
            </Form.Item>

            <div
              style={{
                textAlign: "left",
                marginBottom: "10px",
                marginTop: "-20px",
              }}
            >
              <Link
                to="/auth/forgot-password"
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: token.colorPrimary,
                }}
              >
                Forgot Password?
              </Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                disabled={loading}
                style={{
                  fontWeight: "bold",
                  padding: 17,
                  borderRadius: 10,
                }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </form>
      </div>
    </Layout>
  );
}

export default Login;
