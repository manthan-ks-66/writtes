// all the tools of the editor are assembled here

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import AlignTool from "./AlignTool.jsx";
import TextTools from "./TextTools.jsx";
import { Divider } from "antd";
import HeadingTool from "./HeadingTool.jsx";

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      className="toolbar"
    >
      <HeadingTool editor={editor} />

      <Divider
        vertical
        style={{ height: "100%", backgroundColor: "#3c465f" }}
      />

      <AlignTool editor={editor} />

      <Divider
        vertical
        style={{ height: "100%", backgroundColor: "#3c465f" }}
      />

      <TextTools editor={editor} />
    </div>
  );
}

export default ToolbarPlugin;
