import { useState } from "react";
import {
  Avatar,
  Flex,
  Typography,
  Button,
  Input,
  Space,
  Row,
  Col,
  Grid,
  theme,
  Upload,
} from "antd";
import { useSelector } from "react-redux";
import {
  EditOutlined,
  SaveOutlined,
  UploadOutlined,
  DeleteOutlined,
  UserOutlined,
  XOutlined,
  GithubOutlined,
  LinkedinOutlined,
  InstagramOutlined,
} from "@ant-design/icons";
import userService from "../../services/userService";
import { update } from "../../store/authSlice.js";
import { useDispatch } from "react-redux";
import { useNotify } from "../../context/NotificationProvider.jsx";

import { Controller, useForm } from "react-hook-form";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

function UserProfile() {
  const user = useSelector((state) => state.auth.user);

  const screens = useBreakpoint();
  const { token } = theme.useToken();

  const dispatch = useDispatch();
  const notify = useNotify();

  const { handleSubmit, control } = useForm({
    defaultValues: {
      bio: user?.bio || "",
      about: user?.about || "",
      fullName: user?.fullName || "",
      x: user?.x || "",
      github: user?.github || "",
      linkedin: user?.linkedin || "",
      instagram: user?.instagram || "",
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  const containerPadding = screens.xs ? "12px" : screens.sm ? "16px" : "24px";
  const sectionPadding = screens.xs ? "12px" : screens.sm ? "20px" : "32px";
  const avatarSize = screens.xs
    ? 80
    : screens.sm
      ? 100
      : screens.md
        ? 120
        : 140;
  const titleLevel = screens.xs ? 3 : screens.sm ? 2 : 1;
  const subtextSize = screens.xs ? "12px" : screens.sm ? "14px" : "16px";
  const textSize = screens.xs ? "14px" : screens.sm ? "15px" : "16px";

  const socialLinks = [
    {
      key: "x",
      label: "X",
      icon: <XOutlined style={{ color: token.colorTextBase }} />,
      value: user?.x || "",
    },
    {
      key: "github",
      label: "GitHub",
      icon: <GithubOutlined style={{ color: token.colorTextBase }} />,
      value: user?.github || "",
    },
    {
      key: "linkedIn",
      label: "LinkedIn",
      icon: <LinkedinOutlined style={{ color: "#0077b5" }} />,
      value: user?.linkedIn || "",
    },
    {
      key: "instagram",
      label: "Instagram",
      icon: <InstagramOutlined style={{ color: "#c13584" }} />,
      value: user?.instagram || "",
    },
  ];

  const handleAvatarUpdate = async ({ file }) => {
    try {
      notify.api.info({
        title: "Updating Avatar",
        description: "Please wait while updation is in process...",
        placement: "top",
      });

      const formData = new FormData();

      if (file) formData.append("avatar", file);

      const user = await userService.updateUserAvatar(formData);

      if (user) {
        dispatch(update(user));

        notify.api.success({
          title: "Avatar Updated Successfully",
          placement: "top",
        });
      }
    } catch (error) {
      notify.api.error({
        message: "Failed to Update Avatar",
        description: error.message,
        placement: "top",
      });
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const res = await userService.removeUserAvatar();

      if (res.status === 200) {
        notify.api.success({
          title: "Avatar removed successfully",
          placement: "top",
        });

        const user = res.data?.data;

        dispatch(update(user));
      }
    } catch (error) {
      notify.api.error({
        message: error.message,
        placement: "top",
      });
    }
  };

  const handleUserDataUpdate = async (userData) => {
    try {
      const user = await userService.updateUserDetails(userData);

      if (user) {
        dispatch(update(user));

        notify.api.success({
          title: "Details updated successfully",
          placement: "top",
        });

        setIsEditing(false);
      }
    } catch (error) {
      notify.api.error({
        title: error.message,
        placement: "top",
      });
    }
  };

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        width: "100%",
        padding: containerPadding,
      }}
    >
      {/* Top Profile Section */}
      <Row
        gutter={[
          screens.xs ? 12 : screens.sm ? 16 : 24,
          screens.xs ? 12 : screens.sm ? 16 : 24,
        ]}
        align="middle"
        justify={screens.xs ? "center" : "start"}
      >
        {/* Avatar Column */}
        <Col
          xs={24}
          sm={6}
          md={5}
          lg={4}
          style={{ textAlign: "center", flexShrink: 0 }}
        >
          <Avatar
            src={user?.avatar?.url}
            icon={<UserOutlined />}
            size={avatarSize}
            style={{
              border: `3px solid ${token.colorPrimary}`,
              display: "flex",
              margin: "auto",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </Col>

        {/* Buttons, Name & Username Column */}
        <Col
          xs={24}
          sm={18}
          md={19}
          lg={20}
          style={{ textAlign: screens.xs ? "center" : "left" }}
        >
          {/* Update & Remove Buttons */}
          <Flex
            gap={8}
            justify={screens.xs ? "center" : "flex-start"}
            wrap="wrap"
            style={{ marginBottom: 16 }}
          >
            <Upload
              accept="jpeg, jpg, image/jpeg, image/jpg"
              customRequest={handleAvatarUpdate}
              maxCount={1}
              showUploadList={false}
            >
              <Button
                size="small"
                icon={<UploadOutlined />}
                style={{ width: 90 }}
              >
                Update
              </Button>
            </Upload>
            <Button
              onClick={handleRemoveAvatar}
              size="small"
              danger
              icon={<DeleteOutlined />}
              style={{ width: 90 }}
            >
              Remove
            </Button>
          </Flex>

          {/* Name & Username */}
          <Title
            level={titleLevel}
            style={{
              margin: "0 0 4px 0",
              color: token.colorTextBase,
            }}
          >
            {user?.fullName}
          </Title>
          <Text
            type="secondary"
            style={{
              fontSize: subtextSize,
              color: token.colorTextSecondary,
              display: "block",
            }}
          >
            @{user?.username}
          </Text>
        </Col>
      </Row>

      <Flex
        justify="flex-end"
        style={{ marginBottom: screens.xs ? "12px" : "16px" }}
      >
        <Button
          type={isEditing ? "primary" : "default"}
          icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
          onClick={
            isEditing
              ? handleSubmit(handleUserDataUpdate)
              : () => setIsEditing(true)
          }
          size="small"
          style={{
            padding: "10px 14px",
            fontSize: screens.xs ? "12px" : "14px",
            borderRadius: "6px",
          }}
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
      </Flex>

      {/* Content Box */}
      <div
        style={{
          padding: sectionPadding,
          borderRadius: token.borderRadiusLG,
          background: token.colorBgCard,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <Space vertical size="large" style={{ width: "100%" }}>
          <section>
            <Title
              level={5}
              style={{
                display: "block",
                marginBottom: 8,
                color: token.colorTextSecondary,
                letterSpacing: "0.5px",
              }}
            >
              Full Name
            </Title>
            {isEditing ? (
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size={screens.xs ? "middle" : "large"}
                    style={{
                      fontSize: textSize,
                      borderRadius: token.borderRadiusLG,
                    }}
                  />
                )}
              />
            ) : (
              <Text
                style={{
                  marginTop: 0,
                  marginBottom: 0,
                  color: token.colorTextBase,
                  fontSize: textSize,
                }}
                value={user?.fullName}
              >
                {user?.fullName}
              </Text>
            )}
          </section>

          {/* Bio Section */}
          <section>
            <Title
              level={5}
              style={{
                display: "block",
                marginBottom: 8,
                color: token.colorTextSecondary,
                letterSpacing: "0.5px",
              }}
            >
              Bio
            </Title>
            {isEditing ? (
              <Controller
                name="bio"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size={screens.xs ? "middle" : "large"}
                    placeholder="Write a catchy bio..."
                    style={{
                      fontSize: textSize,
                      borderRadius: token.borderRadiusLG,
                    }}
                  />
                )}
              />
            ) : (
              <Text
                style={{
                  marginTop: 0,
                  marginBottom: 0,
                  color: token.colorTextBase,
                  fontSize: textSize,
                }}
              >
                {user?.bio}
              </Text>
            )}
          </section>

          {/* About Section */}
          <section>
            <Title
              level={5}
              style={{
                display: "block",
                marginBottom: 8,
                color: token.colorTextSecondary,
                letterSpacing: "0.5px",
              }}
            >
              About
            </Title>
            {isEditing ? (
              <Controller
                name="about"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    rows={screens.xs ? 3 : screens.sm ? 3 : 4}
                    placeholder="Tell us about yourself..."
                    style={{
                      fontSize: textSize,
                      borderRadius: token.borderRadiusLG,
                      lineHeight: "1.6",
                    }}
                  />
                )}
              />
            ) : (
              <Text
                style={{
                  marginTop: 0,
                  marginBottom: 0,
                  color: token.colorTextBase,
                  fontSize: textSize,
                }}
              >
                {user?.about}
              </Text>
            )}
          </section>

          {/* Social Links Section */}
          <section>
            <Title
              level={5}
              style={{
                display: "block",
                marginBottom: 8,
                color: token.colorTextSecondary,
                letterSpacing: "0.5px",
              }}
            >
              Social Links
            </Title>

            {isEditing ? (
              <Row gutter={[12, 12]}>
                {socialLinks.map((item) => (
                  <Col xs={24} sm={12} key={item.key}>
                    <Controller
                      name={item.key}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          prefix={item.icon}
                          size={screens.xs ? "middle" : "large"}
                          placeholder={item.placeholder}
                          style={{
                            fontSize: textSize,
                            borderRadius: token.borderRadiusLG,
                          }}
                        />
                      )}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <Space
                size={screens.xs ? "middle" : "large"}
                wrap
                style={{ fontSize: screens.xs ? "22px" : "24px" }}
              >
                {socialLinks.map((item) => {
                  if (!item.value) return null;

                  return (
                    <a
                      key={item.key}
                      href={item.value}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={item.label}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "inherit",
                      }}
                    >
                      {item.icon}
                    </a>
                  );
                })}
                {!socialLinks.some((item) => item.value) ? (
                  <Text type="secondary">No social links added</Text>
                ) : null}
              </Space>
            )}
          </section>
        </Space>
      </div>
    </div>
  );
}

export default UserProfile;
