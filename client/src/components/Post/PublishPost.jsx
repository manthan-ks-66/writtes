import {
  Layout,
  Form,
  Input,
  Button,
  Select,
  Typography,
  theme,
  Upload,
  Row,
  Col,
  Popover,
  Space,
} from "antd";
import {
  UploadOutlined,
  RocketOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import Editor from "../Editor/Editor.jsx";

import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";

import postService from "../../services/postService.js";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

function PublishPost() {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const [error, setError] = useState("");

  const { handleSubmit, control, setValue, watch } = useForm();

  const options = [
    "Tech",
    "Travel",
    "Story",
    "Food",
    "Health",
    "Lifestyle",
    "Business",
    "Education",
    "Programming",
    "Mental Health",
  ];

  const slugTransform = (value) => {
    if (typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return "";
  };

  useEffect(() => {
    let subscription = watch((values, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(values.title));
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const submitPost = async (data) => {
    console.log(data);
    let postFormData = new FormData();

    for (let val in data) {
      if (typeof val !== "object") {
        postFormData.append(val, data[val]);
      }
    }

    if (data.featuredImage && data.featuredImage[0]) {
      postFormData.append("featuredImage", data.featuredImage[0].originFileObj);
    }

    try {
      // const post = await postService.publishPost(postFormData);
      // console.log(post);
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePostForm = () => {
    handleSubmit(submitPost)();
  };

  // Custom styling for the form container
  const containerStyle = {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 30px",
  };

  return (
    <Layout
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: token.colorBgLayout,
        padding: "40px 0",
      }}
    >
      <Content>
        <div style={containerStyle}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Title level={3} style={{ margin: 0, fontSize: "22px" }}>
              Create Your New{" "}
              <span style={{ color: token.colorPrimary }}>Post</span>
            </Title>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handlePostForm}
            requiredMark={false}
          >
            <Row gutter={20}>
              <Col xs={24} md={12}>
                <Form.Item label="Title" name="title">
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => <Input {...field} size="middle" />}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Slug" name="slug">
                  <Controller
                    name="slug"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} size="middle" readOnly />
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={20}>
              <Col xs={24} md={12}>
                <Form.Item label="Category" name="category">
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <Select
                        {...field}
                        style={{ width: "100%" }}
                        onChange={(value) => field.onChange(value)}
                        value={field.value}
                        placeholder="Select a category"
                        size="middle"
                      >
                        {options?.map((option) => (
                          <Option style={{ maxHeight: 20 }} value={option}>
                            {option}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space size="small">
                      Add a title image
                      <Popover content="This field is optional" trigger="hover">
                        <InfoCircleOutlined
                          style={{
                            color: token.colorPrimary,
                            cursor: "pointer",
                          }}
                        />
                      </Popover>
                    </Space>
                  }
                  name="featuredImage"
                >
                  <Controller
                    name="featuredImage"
                    control={control}
                    render={({ field }) => (
                      <Upload
                        {...field}
                        style={{ width: "100%" }}
                        fileList={field.value || []}
                        onChange={({ fileList }) => field.onChange(fileList)}
                        beforeUpload={() => false}
                        maxCount={1}
                      >
                        <Button
                          style={{ width: "100%" }}
                          icon={<UploadOutlined />}
                          size="middle"
                        >
                          Upload
                        </Button>
                      </Upload>
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Content Editor Section */}
            <Editor control={control} name="content" />

            {/* Submit Button */}
            <Form.Item style={{ textAlign: "center", marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="middle"
                icon={<RocketOutlined />}
                block
                style={{
                  width: "200px",
                  height: "45px",
                  fontSize: "15px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Publish
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
}

export default PublishPost;
