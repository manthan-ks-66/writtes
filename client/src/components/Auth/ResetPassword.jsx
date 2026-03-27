import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { Card, Form, Input, Button, Typography, Layout, theme } from "antd";
import { LockFilled, LockOutlined, SafetyOutlined } from "@ant-design/icons";
import { useNotify } from "../../context/NotificationProvider";

const { Title, Text } = Typography;

function ResetPassword() {
  const { token } = theme.useToken();
  const notify = useNotify();
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (data) => {
    setLoading(true);
    try {
      const res = await authService.resetUserPassword(data);

      if (res.status === 200) {
        notify.api.success({
          title: "Password Updated",
          description: "You can now login in with new password",
          placement: "top",
        });

        sessionStorage.clear();

        navigate("/auth/login");
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Card
          style={{
            width: 400,
            borderRadius: "8px",
            backgroundColor: "#ffffff1e",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <Title level={3}>Reset Password</Title>
          </div>

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

          <form onSubmit={handleSubmit(handleResetPassword)}>
            <Form layout="vertical" component={false}>
              <Form.Item
                label="OTP"
                validateStatus={errors.otp ? "error" : ""}
                help={errors.otp?.message}
              >
                <Controller
                  name="otp"
                  control={control}
                  rules={{ required: "OTP is required" }}
                  render={({ field }) => (
                    <Input
                      type="number"
                      {...field}
                      size="middle"
                      prefix={<SafetyOutlined />}
                    />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="New Password"
                validateStatus={errors.newPassword ? "error" : ""}
                help={errors.newPassword?.message}
              >
                <Controller
                  name="newPassword"
                  control={control}
                  rules={{
                    required: "New password is required",
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
                      size="middle"
                      prefix={<LockOutlined />}
                    />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                validateStatus={errors.confirmNewPassword ? "error" : ""}
                help={errors.confirmNewPassword?.message}
              >
                <Controller
                  name="confirmNewPassword"
                  control={control}
                  rules={{
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === getValues("newPassword") ||
                      "Passwords do not match",
                  }}
                  render={({ field }) => (
                    <Input.Password
                      {...field}
                      size="middle"
                      prefix={<LockFilled />}
                    />
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
                Reset Password
              </Button>
            </Form>
          </form>
        </Card>
      </div>
    </Layout>
  );
}

export default ResetPassword;
