import { Button, Card, Tag, theme, Layout, Typography, Image } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

function PostCard2({ userLikedPost }) {
  const { token } = theme.useToken();

  const navigate = useNavigate();
  return (
    <Layout
      style={{
        margin: "3% auto",
        borderRadius: 12,
        width: "60vw",
        justifySelf: "center",
      }}
    >
      <Card
        hoverable
        cover={
          userLikedPost?.featuredImage && (
            <Image
              alt="post cover"
              src={userLikedPost?.featuredImage}
              style={{
                borderRadius: "12px 12px 0 0",
                objectFit: "cover",
                height: 180,
              }}
              preview={false}
            />
          )
        }
        style={{
          width: "100%",
          height: "100%",
          background: "#041c541e",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 12,
        }}
        styles={{ padding: "20px" }}
      >
        <Tag
          color="black"
          style={{
            marginBottom: 12,
            borderRadius: 4,
            fontSize: "10px",
          }}
        >
          {userLikedPost?.category}
        </Tag>
        <Title level={5} style={{ margin: "0 0 10px 0", fontSize: "16px" }}>
          {userLikedPost?.title}
        </Title>
        <Paragraph
          ellipsis={{ rows: 2 }}
          style={{ fontSize: "13px", color: token.colorTextSecondary }}
        >
          {userLikedPost?.content}
        </Paragraph>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "end",
            marginTop: 16,
          }}
        >
          <Button
            onClick={() =>
              navigate(`/post/${userLikedPost?._id}/${userLikedPost?.slug}`)
            }
            type="link"
            size="small"
            style={{ padding: 0, color: token.colorPrimary }}
          >
            Read More
          </Button>
        </div>
      </Card>
    </Layout>
  );
}

export default PostCard2;
