import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { FORMAT_TEXT_COMMAND } from "lexical";

function TextTools({ editor }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", gap: 10 }}>
      <Button
        className="tool"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        icon={<BoldOutlined />}
      />

      <Button
        className="tool"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        icon={<ItalicOutlined />}
      />

      <Button
        className="tool"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        icon={<UnderlineOutlined />}
      />
    </div>
  );
}

export default TextTools;
