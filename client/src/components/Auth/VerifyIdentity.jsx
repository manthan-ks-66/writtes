import { Card, Form, Input, Button, Typography, Layout, theme } from "antd";
import { ArrowLeftOutlined, MailOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const { Title, Text } = Typography;

const VerifyIdentity = () => {
  const { token } = theme.useToken();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const submitEmail = async (data) => {
    setLoading(true);
    try {
      const email = data.email;
      const res = await authService.sendResetPasswordOTP({ email });

      if (res.statusCode === 200) {
        sessionStorage.setItem("verificationStatus", true);
        navigate("/auth/forgot-password/reset/verify");
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
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "10px",
          backgroundColor: "#ffffff1e",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 20,
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0)",
        }}
      >
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

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Title level={3}>Forgot Password?</Title>
          <Text type="secondary">
            Enter your registered email to receive an OTP
          </Text>
        </div>

        <form onSubmit={handleSubmit(submitEmail)}>
          <Form layout="vertical" component={false}>
            <Form.Item
              label="Email Address"
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
                  <Input {...field} size="middle" prefix={<MailOutlined />} />
                )}
              />
            </Form.Item>

            <Button
              loading={loading}
              disabled={loading}
              type="primary"
              htmlType="submit"
              block
              size="middle"
              style={{ marginTop: "8px" }}
            >
              Send Code
            </Button>
          </Form>
        </form>

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <Button
            style={{ color: token.colorPrimary }}
            size="small"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/auth/login")}
            type="link"
          >
            Back to Login
          </Button>
        </div>
      </Card>
    </Layout>
  );
};

export default VerifyIdentity;
