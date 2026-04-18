// lexical imports
import { $getNearestNodeOfType } from "@lexical/utils";
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  ParagraphNode,
} from "lexical";

// antd imports
import { Dropdown } from "antd";
import {
  AlignLeftOutlined,
  AlignCenterOutlined,
  DownOutlined,
  MenuOutlined,
  AlignRightOutlined,
} from "@ant-design/icons";

// react
import { useEffect, useState, useMemo } from "react";

// css
import "../Editor.css";

const alignmentOptions = [
  {
    label: "Left",
    key: "left",
    icon: <AlignLeftOutlined />,
  },
  {
    label: "Center",
    key: "center",
    icon: <AlignCenterOutlined />,
  },
  {
    label: "Right",
    key: "right",
    icon: <AlignRightOutlined />,
  },
  {
    label: "Justify",
    key: "justify",
    icon: <MenuOutlined />,
  },
];

function AlignTool({ editor }) {
  const [currentAlign, setCurrentAlign] = useState("left");

  const updateToolBar = () => {
    const selection = $getSelection();

    const node = selection.anchor.getNode();

    // TODO: fix paragraph node issue
    const element =
      node.getKey() === "root"
        ? node
        : $getNearestNodeOfType(node, ParagraphNode);

    const format = element.getFormatType() || "left";

    setCurrentAlign(format);
  };

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => updateToolBar());
    });
  }, [updateToolBar, editor]);

  const alignmentItems = alignmentOptions.map((item) => ({
    ...item,
    onClick: () => {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, item.key);
    },
  }));

  const currentIcon = alignmentOptions.find(
    (option) => option.key === currentAlign,
  )?.icon || <AlignLeftOutlined />;

  return (
    <div style={{ width: "100px" }} className="tool">
      <Dropdown trigger="click" menu={{ items: alignmentItems }}>
        <div style={{ display: "flex", gap: 10 }}>
          {currentIcon}
          <span style={{ textTransform: "capitalize" }}>{currentAlign}</span>
          <DownOutlined />
        </div>
      </Dropdown>
    </div>
  );
}

export default AlignTool;
