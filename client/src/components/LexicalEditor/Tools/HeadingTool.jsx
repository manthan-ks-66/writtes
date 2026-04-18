// antd imports
import { Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";

// react
import { useEffect, useState } from "react";

// lexical imports
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection } from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";

const textTypeOptions = [
  {
    label: "Heading 1",
    key: "h1",
  },
  {
    label: "Heading 2",
    key: "h2",
  },
  {
    label: "Heading 3",
    key: "h3",
  },
];

function HeadingTool({ editor }) {
  const formatting = (size) => {
    editor.update(() => {
      const selection = $getSelection();

      $setBlocksType(selection, () => $createHeadingNode(size));
    });
  };

  const textTypeItems = textTypeOptions.map((item) => ({
    ...item,
    onClick: () => formatting(item.key),
  }));

  return (
    <div className="tool">
      <Dropdown menu={{ items: textTypeItems }}>
        <div style={{ display: "flex", gap: 10 }}>
          Heading 1
          <DownOutlined />
        </div>
      </Dropdown>
    </div>
  );
}

export default HeadingTool;
