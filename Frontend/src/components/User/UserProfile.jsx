import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";

import {
  Avatar,
  Flex,
  Typography,
  Button,
  Input,
  Space,
  Row,
  Col,
  theme,
  Upload,
  Modal,
} from "antd";

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

import { useNotify } from "../../context/NotificationProvider.jsx";
import userService from "../../utilities/services/userService.js";
import { update } from "../../store/authSlice.js";

const { Title, Text } = Typography;
const { TextArea } = Input;

const socialConfig = [
  {
    key: "x",
    label: "X",
    icon: <XOutlined style={{ color: "currentColor", fontSize: 16 }} />,
    color: "inherit",
  },
  {
    key: "github",
    label: "GitHub",
    icon: <GithubOutlined style={{ color: "currentColor", fontSize: 16 }} />,
    color: "inherit",
  },
  {
    key: "linkedIn",
    label: "LinkedIn",
    icon: <LinkedinOutlined style={{ color: "#0077b5", fontSize: 16 }} />,
    color: "#0077b5",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: <InstagramOutlined style={{ color: "#c13584", fontSize: 16 }} />,
    color: "#c13584",
  },
];

function UserProfile() {
  const user = useSelector((state) => state.auth.user);
  const { token } = theme.useToken();
  const dispatch = useDispatch();
  const notify = useNotify();

  const { handleSubmit, control } = useForm({
    defaultValues: {
      fullName: user?.fullName || "",
      bio: user?.profile?.bio || "",
      about: user?.profile?.about || "",
      x: user?.socialLinks?.x || "",
      github: user?.socialLinks?.github || "",
      linkedIn: user?.socialLinks?.linkedIn || "",
      instagram: user?.socialLinks?.instagram || "",
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  const sectionTitleStyle = {
    display: "block",
    marginBottom: 8,
    color: token.colorTextSecondary,
    letterSpacing: "0.4px",
  };

  const textStyle = {
    marginTop: 0,
    marginBottom: 0,
    color: token.colorTextBase,
    fontSize: 14,
  };

  const inputStyle = {
    fontSize: 14,
    borderRadius: token.borderRadiusLG,
  };

  const renderTextField = (name, placeholder) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          size="middle"
          placeholder={placeholder}
          style={inputStyle}
        />
      )}
    />
  );

  const handleAvatarUpdate = async ({ file }) => {
    try {
      notify.api.info({
        title: "Updating Avatar",
        description: "Please wait while update is in process...",
        placement: "top",
      });

      const formData = new FormData();
      if (file) formData.append("avatar", file);

      const updatedUser = await userService.updateUserAvatar(formData);
      if (updatedUser) {
        dispatch(update(updatedUser));
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

  const handleNotifyRemove = () => {
    if (!user?.avatar) {
      notify.api.error({
        title: "You have not added your avatar",
        placement: "top",
      });
      return;
    }

    setIsRemoveModalOpen(true);
  };

  const handleRemoveAvatar = async () => {
    try {
      setIsRemoveModalOpen(false);
      const res = await userService.removeUserAvatar();

      if (res.status === 200) {
        dispatch(update(res.data?.data));
        notify.api.success({
          title: "Avatar removed successfully",
          placement: "top",
        });
      }
    } catch (error) {
      notify.api.error({
        message: error.message,
        placement: "top",
      });
    }
  };

  const handleUserDataUpdate = async (userData) => {
    if (!userData.fullName) {
      notify.api.error({
        title: "Name cannot be emtpy",
        placement: "top",
      });

      return;
    }

    try {
      const updatedUser = await userService.updateUserDetails(userData);
      if (updatedUser) {
        dispatch(update(updatedUser));
        notify.api.success({
          title: "Details updated",
          placement: "top",
        });
      }
    } catch (error) {
      notify.api.error({
        title: error.message,
        placement: "top",
      });
    } finally {
      setIsEditing(false);
    }
  };

  const socialLinks = socialConfig.map((item) => ({
    ...item,
    value: user?.socialLinks?.[item.key] || "",
  }));

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        width: "100%",
        padding: "8px 4px 18px",
      }}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={6} md={5} lg={4} style={{ textAlign: "center" }}>
          <Avatar
            src={user?.avatar?.url}
            icon={<UserOutlined />}
            size={110}
            style={{
              border: `3px solid ${token.colorPrimary}`,
              display: "flex",
              margin: "auto",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </Col>

        <Col xs={24} sm={18} md={19} lg={20}>
          <Flex gap={8} wrap="wrap" style={{ marginBottom: 12 }}>
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
              onClick={handleNotifyRemove}
              size="small"
              danger
              icon={<DeleteOutlined />}
              style={{ width: 90 }}
            >
              Remove
            </Button>

            <Modal
              title="Confirm Remove"
              okText="Yes"
              open={isRemoveModalOpen}
              onOk={handleRemoveAvatar}
              onCancel={() => setIsRemoveModalOpen(false)}
            >
              <Text type="primary">
                Are you sure you want to delete the avatar ?
              </Text>
            </Modal>
          </Flex>

          <Title
            level={3}
            style={{ margin: "0 0 4px 0", color: token.colorTextBase }}
          >
            {user?.fullName}
          </Title>
          <Text
            type="secondary"
            style={{
              fontSize: 13,
              color: token.colorTextSecondary,
              display: "block",
            }}
          >
            @{user?.username}
          </Text>
        </Col>
      </Row>

      <Flex justify="flex-end" style={{ marginBottom: 12, marginTop: 14 }}>
        <Button
          type={isEditing ? "primary" : "default"}
          icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
          onClick={
            isEditing
              ? handleSubmit(handleUserDataUpdate)
              : () => setIsEditing(true)
          }
          size="small"
          style={{ padding: "10px 14px", fontSize: 13, borderRadius: "6px" }}
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
      </Flex>

      <div
        style={{
          padding: 20,
          background: token.colorBgBlur,
        }}
      >
        <Space vertical size="middle" style={{ width: "100%" }}>
          <section>
            <Title level={5} style={sectionTitleStyle}>
              Full Name
            </Title>
            {isEditing ? (
              renderTextField("fullName")
            ) : (
              <Text style={textStyle}>{user?.fullName}</Text>
            )}
          </section>

          <section>
            <Title level={5} style={sectionTitleStyle}>
              Bio
            </Title>
            {isEditing ? (
              renderTextField("bio", "Write a catchy bio...")
            ) : (
              <Text style={textStyle}>{user?.profile?.bio}</Text>
            )}
          </section>

          <section>
            <Title level={5} style={sectionTitleStyle}>
              About
            </Title>
            {isEditing ? (
              <Controller
                name="about"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    rows={3}
                    placeholder="Tell us about yourself..."
                    style={{ ...inputStyle, lineHeight: "1.6" }}
                  />
                )}
              />
            ) : (
              <Text style={textStyle}>{user?.profile?.about}</Text>
            )}
          </section>

          <section>
            <Title level={5} style={sectionTitleStyle}>
              Social Links
            </Title>

            {isEditing ? (
              <Row gutter={[12, 12]}>
                {socialConfig.map((item) => (
                  <Col xs={24} sm={12} key={item.key}>
                    <Controller
                      name={item.key}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          prefix={item.icon}
                          size="middle"
                          placeholder={`Add ${item.label} URL`}
                          style={inputStyle}
                        />
                      )}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <Space size="middle" wrap style={{ fontSize: 18 }}>
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
                        color: item.color,
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
