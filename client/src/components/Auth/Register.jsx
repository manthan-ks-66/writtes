// react and redux imports
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// services imports
import authService from "../../services/authService.js";

// react hook form
import { useForm, Controller } from "react-hook-form";

// antd imports
import { Button, Flex, Form, Input, Layout, Divider, Typography } from "antd";
import {
  UserOutlined,
  LockOutlined,
  FormOutlined,
  MailOutlined,
} from "@ant-design/icons";
import Logo from "../Logo/Logo.jsx";
import GoogleBtn from "./GoogleBtn.jsx";
import { theme } from "antd";

const { Text } = Typography;

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = theme.useToken();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
      email: "",
    },
  });

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authService.registerUser(userData);

      if (res.status === 201 || res.status === 200) {
        sessionStorage.setItem("email", userData.email);
        sessionStorage.setItem("verificationStatus", true);

        navigate("/auth/register/verify");
      }
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
          maxWidth: "520px",
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
          Register
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

        <div
          style={{
            width: "100%",
            margin: "15px 0 15px 0",
            textAlign: "center",
          }}
        >
          <span style={{ color: token.colorTextSecondary }}>
            Already have an account?
          </span>
          &nbsp;
          <Link
            to="/auth/login"
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color: token.colorPrimary,
            }}
          >
            Login here
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

        <form style={{ width: "100%" }} onSubmit={handleSubmit(register)}>
          <Form layout="vertical" component={false}>
            <Flex gap="small">
              <Form.Item
                label="Username"
                style={{ flex: 1 }}
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
                      placeholder="username"
                      size="middle"
                    />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                style={{ flex: 1 }}
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
            </Flex>

            <Form.Item
              label="Full Name"
              validateStatus={errors.fullName ? "error" : ""}
              help={errors.fullName?.message}
            >
              <Controller
                name="fullName"
                control={control}
                rules={{ required: "Fullname is required" }}
                render={({ field }) => (
                  <Input
                    prefix={<FormOutlined />}
                    {...field}
                    placeholder="full name"
                    size="middle"
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Email"
              validateStatus={errors.email ? "error" : ""}
              help={errors.email?.message}
            >
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    prefix={<MailOutlined />}
                    placeholder="email"
                    size="middle"
                  />
                )}
              />
            </Form.Item>

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
                Register
              </Button>
            </Form.Item>
          </Form>
        </form>
      </div>
    </Layout>
  );
}

export default Register;
