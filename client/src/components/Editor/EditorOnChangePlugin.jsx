import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

// the onChange prop is the react-hook-form onChange
function EditorOnChangePlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // when this plugin un-mounts the lexical automatically calls unsubscribe fn and cleans up the useEffect memory
    // so no need to manually call the unsubscribe() here

    return editor.registerUpdateListener(({ editorState }) => {
      // Purpose of the editor.registerListener() callback:
      // Lexical calls this function every time the editor updates (type, format, move-cursor etc.)

      onChange(editorState.toJSON());
    });
  }, [editor, onChange]);

  return;
}

export default EditorOnChangePlugin;

// NOTE:
/**
 * The registerUpdateListener callback runs outside React’s render cycle

 * Lexical updates its internal state and then calls your listener

 * This does not cause your React components 
  - (like in this case EditorOnChangePlugin or the Editor wrapper in Editor.jsx) to re-render on every keystroke

 * The plugin itself is stable — it only sets up the listener once via useEffect

 * What changes is Lexical’s internal state, which you can observe with => console.log(editorState)
 */
