// react hook form
import { Controller } from "react-hook-form";

// lexical imports
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import ToolbarPlugin from "./EditorTools/ToolbarPlugin.jsx";
import EditorOnChangePlugin from "./EditorOnChangePlugin.jsx";

// css
import "./Editor.css";

const theme = {
  paragraph: "editor-paragraph",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
    h6: "editor-heading-h6",
  },
};

function onError(error) {
  console.error("lexical editor error", error);
}

function Editor({ control, name = "content" }) {
  const initialConfig = {
    namespace: "PostEditor",
    theme,
    onError,
    nodes: [HeadingNode, QuoteNode],
  };

  return (
    <div className="editor-shell">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <LexicalComposer initialConfig={initialConfig}>
            <div className="editor-toolbar-wrapper">
              <ToolbarPlugin />
            </div>

            <EditorOnChangePlugin onChange={field.onChange} />

            <div className="editor-inner">
              <RichTextPlugin
                contentEditable={<ContentEditable className="editor-input" />}
                ErrorBoundary={LexicalErrorBoundary}
                placeholder={
                  <div className="editor-placeholder">Write What You Think</div>
                }
              />

              <HistoryPlugin />
              <AutoFocusPlugin />
            </div>
          </LexicalComposer>
        )}
      />
    </div>
  );
}

export default Editor;
