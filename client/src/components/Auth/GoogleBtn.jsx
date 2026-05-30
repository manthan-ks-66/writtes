import { Button } from "antd";
import { useNotify } from "../../context/NotificationProvider";
import { useGoogleLogin } from "@react-oauth/google";
import authService from "../../utilities/services/authService.js";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

const buttonStyle = {
  padding: "16px",
  fontWeight: 450,
  borderRadius: "8px",
  boxShadow: "0 2px 0 rgba(0, 0, 0, 0.02)",
};

const contentStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  lineHeight: 1,
};

const labelStyle = {
  display: "inline-block",
  lineHeight: 1,
};

const iconStyle = {
  display: "block",
  transform: "translateY(-1px)",
};

const GoogleBtn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notify = useNotify();

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const code = tokenResponse.code;

      try {
        const user = await authService.authenticateWithGoogle({ code });

        if (user) {
          dispatch(login(user));

          notify.api.success({
            title: `Welcome, ${user.fullName}`,
            description: "Your are now logged in",
            placement: "top",
          });

          navigate("/");
        }
      } catch (error) {
        notify.api.error({
          title: error.message,
          placement: "top",
        });
      }
    },
    flow: "auth-code",
    onError: () =>
      notify.api.error({ title: "Failed to Sign in", placement: "top" }),
  });

  return (
    <Button
      className="google-btn"
      type="default"
      size="middle"
      block
      onClick={handleGoogleAuth}
      style={buttonStyle}
    >
      <span style={contentStyle}>
        <GoogleIcon />
        <span style={labelStyle}>Continue with Google</span>
      </span>
    </Button>
  );
};

// Helper component for the Google logo
const GoogleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    aria-hidden="true"
    focusable="false"
    style={iconStyle}
  >
    <path
      fill="#4285F4"
      d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91c1.71-1.58 2.69-3.91 2.69-6.62z"
    />
    <path
      fill="#34A853"
      d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.8.54-1.83.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.95v2.33C2.43 15.99 5.48 18 9 18z"
    />
    <path
      fill="#FBBC05"
      d="M3.96 10.71a5.4 5.4 0 0 1 0-3.42V4.96H.95a9 9 0 0 0 0 8.08l3.01-2.33z"
    />
    <path
      fill="#EA4335"
      d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.47C13.47.97 11.43 0 9 0 5.48 0 2.43 2.01.95 4.96L3.96 7.29C4.67 5.16 6.66 3.58 9 3.58z"
    />
  </svg>
);

export default GoogleBtn;
