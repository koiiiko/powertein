import React, { useRef, useEffect } from "react";
import { Bold, Italic, Underline } from "lucide-react";

export default function SimpleRichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const formatText = (command) => {
    document.execCommand(command, false, null);
    onChange(editorRef.current.innerHTML);
  };

  const handleInput = () => {
    onChange(editorRef.current.innerHTML);
  };

  const countWords = (html) => {
    if (!html) return 0;
    const text = html
      .replace(/<[^>]*>?/gm, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text ? text.split(" ").length : 0;
  };

  const wordCount = countWords(value);

  return (
    <div>
      {/* Toolbar */}
      <div className="inline-flex items-center space-x-2 bg-white p-2 rounded-md shadow-sm border border-gray-300 mb-4">
        <button
          type="button"
          onClick={() => formatText("bold")}
          className="p-2 rounded-md hover:bg-blue-100 hover:text-blue-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => formatText("italic")}
          className="p-2 rounded-md hover:bg-blue-100 hover:text-blue-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => formatText("underline")}
          className="p-2 rounded-md hover:bg-blue-100 hover:text-blue-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          title="Underline"
        >
          <Underline size={18} />
        </button>
      </div>

      <div className="relative">
        {/* isi artikelnya */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="w-full px-4 py-3 border-0 bg-[#F1F4F9] rounded-lg transition-colors placeholder-gray-500 min-h-[200px]"
          style={{ outline: "none" }}
          spellCheck={false}
        />

        <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded
                        hover:bg-white/90 transition-colors duration-200">
          {wordCount} kata
        </div>
      </div>
    </div>
  );
}