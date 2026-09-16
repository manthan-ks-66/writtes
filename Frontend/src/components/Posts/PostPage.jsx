import {
  Layout,
  Typography,
  Button,
  Space,
  Avatar,
  Image,
  theme,
  Input,
  Modal,
  Flex,
  Spin,
} from "antd";
import {
  LikeOutlined,
  MessageOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  LikeTwoTone,
} from "@ant-design/icons";
import "./PostPage.css";

import postService from "../../utilities/services/postService.js";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNotify } from "../../context/NotificationProvider.jsx";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

function PostPage() {
  const user = useSelector((state) => state.auth.user);

  const { token } = theme.useToken();
  const notify = useNotify();

  const [open, setOpen] = useState(false);
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [likeAnimationType, setLikeAnimationType] = useState("");
  const [likeAnimationKey, setLikeAnimationKey] = useState(0);

  const { _id, slug } = useParams();

  const data = {
    comments: [
      {
        id: 1,
        body: "Demo Comment",
      },
      {
        id: 2,
        body: "Demo Comment",
      },
    ],
  };

  const showNotification = () => {
    notify.api.info({
      title: "Under Development",
      placement: "top",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);

    notify.api.success({
      title: "Link Copied to Clipboard",
      placement: "top",
    });
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const resPost = await postService.fetchPost(_id);

        setPost(resPost);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoader(false);
      }
    };

    fetchPost();
  }, [_id, slug]);

  const togglePostLike = async () => {
    if (!user) {
      notify.api.info({ title: "Login to like post", placement: "top" });
      return;
    }

    if (isLiking || !post?._id) {
      return;
    }

    try {
      setIsLiking(true);
      const res = await postService.togglePostLike(post._id);

      if (res.statusCode === 200) {
        const nextLiked = Boolean(res.data?.isLiked);

        setPost((prev) => ({
          ...prev,
          isLiked: nextLiked,
          likesCount: res.data?.likesCount,
        }));

        // Re-mount icon wrapper to replay animation on every toggle.
        setLikeAnimationType(nextLiked ? "liked" : "unliked");
        setLikeAnimationKey((prev) => prev + 1);
      }
    } finally {
      setIsLiking(false);
    }
  };

  const isAuthor = post && user ? user._id === post.userId : false;

  return (
    <Layout style={{ minHeight: "100vh", background: token.colorBgLayout }}>
      {!loader ? (
        <Content className="post-content-container">
          {/* Post Actions */}
          {isAuthor && (
            <Flex justify="flex-end" className="post-actions">
              <Space wrap>
                <Link to={`/post/${post?._id}/${post?.slug}/edit`}>
                  <Button icon={<EditOutlined />} size="small">
                    Edit
                  </Button>
                </Link>
                <Button icon={<DeleteOutlined />} danger size="small">
                  Delete
                </Button>
              </Space>
            </Flex>
          )}
          {error && <Text type="danger">{error}</Text>}
          {/* Featured Image */}
          <div className="featured-image-wrapper">
            <Image
              className="featured-image"
              width="100%"
              src={post?.featuredImage}
            />
          </div>
          {/* Post Header */}
          <Title level={2} className="post-title">
            {post?.title}
          </Title>
          {/* Metadata Bar */}
          <Flex
            wrap="wrap"
            align="center"
            gap="12px"
            className="post-meta-container"
          >
            <Space>
              <Avatar
                size={40}
                src={post?.author?.avatar?.url}
                icon={<UserOutlined />}
              />
              <Text type="secondary">
                by{" "}
                <Link to={`/author/@${post?.author?.username}`}>
                  <Text className="authorName" type="secondary" strong>
                    {post?.author?.fullName}
                  </Text>
                </Link>
              </Text>
            </Space>

            <div
              className="divider"
              style={{
                width: "100%",
                height: 1,
                background: token.colorBorderSecondary,
              }}
            />

            <Flex wrap="wrap" align="center" gap="8px">
              <div
                className="meta-divider meta-divider-left"
                style={{
                  width: 1,
                  height: 14,
                  background: token.colorBorderSecondary,
                }}
              />

              <Text type="secondary" style={{ fontSize: "13px" }}>
                {post?.createdAt}
              </Text>

              {post?.editedAt && (
                <Flex align="center" gap="8px">
                  <div
                    className="meta-divider"
                    style={{
                      width: 1,
                      height: 14,
                      background: token.colorBorderSecondary,
                    }}
                  />
                  <Text type="secondary" italic style={{ fontSize: "13px" }}>
                    Edited: {post?.editedAt}
                  </Text>
                </Flex>
              )}
            </Flex>
          </Flex>
          {/* Interaction Bar */}
          <Flex
            gap="14px"
            wrap="wrap"
            className="post-interactions"
            style={{
              borderTop: `1px solid ${token.colorBorderSecondary}`,
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            <Button
              icon={
                <span
                  key={likeAnimationKey}
                  className={`like-icon-wrap ${
                    likeAnimationType
                      ? `like-icon-wrap-${likeAnimationType}`
                      : ""
                  }`}
                >
                  {post?.isLiked ? (
                    <LikeTwoTone twoToneColor="#1677ff" className="like-icon" />
                  ) : (
                    <LikeOutlined className="like-icon" />
                  )}
                  <span className="like-icon-ring" />
                </span>
              }
              onClick={togglePostLike}
              disabled={isLiking}
            >
              {post?.likesCount}
            </Button>

            <Button icon={<MessageOutlined />}>{post?.commentsCount}</Button>

            <Button onClick={() => setOpen(true)} icon={<UploadOutlined />}>
              Share
            </Button>

            <Modal
              title="Share Post"
              okText="Copy"
              onOk={copyToClipboard}
              open={open}
              onCancel={() => setOpen(false)}
              cancelText="Close"
              centered
            >
              <Input
                value={window.location.href}
                readOnly
                style={{ marginTop: 16 }}
              />
            </Modal>
          </Flex>
          {/* Main Content */}
          <Paragraph
            className="post-body"
            style={{
              color: token.colorText,
            }}
          >
            {post?.content}
          </Paragraph>

          <div className="comments-section">
            <h2
              style={{
                margin: "10px 0",
              }}
              className="comment"
            >
              Comments
            </h2>
            <Flex
              style={{ alignItems: "center" }}
              align="flex-start"
              gap="12px"
              className="comment-composer"
            >
              <Avatar
                size="large"
                src={user?.avatar?.url}
                icon={<UserOutlined />}
              />
              <Input
                size="middle"
                className="comment-input"
                placeholder="Write a comment..."
              />
              <Button onClick={showNotification} type="primary">
                Add
              </Button>
            </Flex>
            <Space vertical size="middle" className="comments-list">
              {data.comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <Avatar size="middle" icon={<UserOutlined />} />
                  <div className="comment-bubble">
                    <Text
                      strong
                      style={{ fontSize: "13px", display: "block" }}
                    ></Text>
                    <Text
                      style={{
                        fontSize: "13px",
                        color: token.colorTextSecondary,
                      }}
                    >
                      {comment.body}
                    </Text>
                  </div>
                </div>
              ))}
            </Space>
          </div>
        </Content>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            minHeight: "100vh",
            alignItems: "center",
          }}
        >
          <Spin className="icon-spin" />
        </div>
      )}
    </Layout>
  );
}

export default PostPage;
