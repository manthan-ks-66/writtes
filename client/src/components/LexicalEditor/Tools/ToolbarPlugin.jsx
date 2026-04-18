// all the tools of the editor are assembled here
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

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
    </div>
  );
}

export default ToolbarPlugin;
