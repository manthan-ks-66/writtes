// antd imports
import { Button, Input, Typography, Flex, Card, message, Layout } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { theme } from "antd";
import { Navigate } from "react-router-dom";

const { Title, Text } = Typography;

// redux and services imports
import { login } from "../../store/authSlice.js";
import authService from "../../services/authService.js";
import { useDispatch } from "react-redux";

// antd notification
import { useNotify } from "../../context/NotificationProvider.jsx";

// react
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const OtpVerification = () => {
  const email = sessionStorage.getItem("email");

  const [error, setError] = useState();

  const [otp, setOTP] = useState();

  const dispatch = useDispatch();

  const notify = useNotify();

  const navigate = useNavigate();

  const { token } = theme.useToken();

  const handleVerify = async () => {
    try {
      const user = await authService.verifyAndLoginUser({ otp });

      if (user) {
        dispatch(login(user));
        sessionStorage.clear();

        notify.api.success({
          title: "Registration completed",
          description: "Your are now logged in",
          placement: "top",
        });
      }

      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const resendOTP = async () => {
    try {
      const res = await authService.regenerateRegistrationOTP();

      if (res.status === 200) {
        notify.api.success({
          title: "OTP sent to the registered email",
          placement: "top",
        });
      }
    } catch (error) {
      setError(error.message);
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
      <Flex justify="center" align="center">
        <Card
          style={{
            backgroundColor: "#ffffff1e",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 20,
            width: 400,
            textAlign: "center",
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
          <MailOutlined
            style={{ fontSize: 40, color: token.colorTextSecondary }}
          />
          <div style={{ marginBottom: 24 }}>
            <Title level={3} style={{ marginTop: 16 }}>
              Check your email
            </Title>
            <Text type="secondary">
              Enter the 6 digit OTP sent to
              <br />
              <strong>{email}</strong>
            </Text>
          </div>

          <Flex vertical gap="middle" align="center">
            <Input.OTP
              size="large"
              length={6}
              onChange={(value) => setOTP(value)}
            />

            <Button
              type="primary"
              size="large"
              block
              onClick={handleVerify}
              style={{ height: 45, borderRadius: 8, marginTop: 8 }}
            >
              Verify and Log in
            </Button>

            <Text type="secondary" style={{ fontSize: 14 }}>
              Didn't receive the code?
              <Button
                onClick={resendOTP}
                type="link"
                style={{ padding: "0 4px", color: token.colorPrimary }}
              >
                Resend
              </Button>
            </Text>
          </Flex>
        </Card>
      </Flex>
    </Layout>
  );
};

export default OtpVerification;
