"use client";
import React, { useRef, useEffect } from "react";
import {
  LuBold,
  LuItalic,
  LuUnderline,
  LuList,
  LuListOrdered,
  LuLink,
  LuImage,
  LuCode,
  LuPalette,
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight,
  LuAlignJustify
} from "react-icons/lu";

export default function RichTextEditor({ value, onChange, placeholder = "Mulai menulis di sini..." }) {
  const editorRef = useRef(null);

  // Set initial content and keep it in sync only if it's different and not focused
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command, val = null) => {
    // Keep focus in the editor before executing
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, val);
    handleInput();
  };

  const handleLink = () => {
    const url = prompt("Masukkan URL Link (contoh: https://google.com):");
    if (url) {
      // Ensure protocol is present
      const formattedUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
      executeCommand("createLink", formattedUrl);
    }
  };

  const handleImage = () => {
    const url = prompt("Masukkan URL Gambar (contoh: /uploads/image.png atau https://...):");
    if (url) {
      executeCommand("insertImage", url);
    }
  };

  const handleCode = () => {
    const selection = window.getSelection().toString();
    if (selection) {
      const codeHtml = `<pre class="bg-slate-950 p-3 rounded-lg border border-slate-800 text-accent font-ibm-plex-mono text-xs my-2 overflow-x-auto"><code>${selection}</code></pre>`;
      executeCommand("insertHTML", codeHtml);
    } else {
      const codeHtml = `<pre class="bg-slate-950 p-3 rounded-lg border border-slate-800 text-accent font-ibm-plex-mono text-xs my-2 overflow-x-auto"><code>Masukkan kode kodingan di sini</code></pre>`;
      executeCommand("insertHTML", codeHtml);
    }
  };

  return (
    <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900 focus-within:border-accent transition-colors font-poppins text-slate-200">
      
      {/* Toolbar controls */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-950 border-b border-slate-800 text-slate-400">
        
        {/* Basic Text Formats */}
        <button
          type="button"
          onClick={() => executeCommand("bold")}
          className="p-1.5 rounded hover:bg-slate-850 hover:text-white transition-colors"
          title="Tebal (Bold)"
        >
          <LuBold size={15} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("italic")}
          className="p-1.5 rounded hover:bg-slate-850 hover:text-white transition-colors"
          title="Miring (Italic)"
        >
          <LuItalic size={15} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("underline")}
          className="p-1.5 rounded hover:bg-slate-850 hover:text-white transition-colors"
          title="Garis Bawah (Underline)"
        >
          <LuUnderline size={15} />
        </button>
        
        <span className="w-px h-5 bg-slate-800 mx-1"></span>

        {/* Font Size Selector */}
        <select
          onChange={(e) => {
            const size = e.target.value;
            executeCommand("fontSize", size);
            e.target.value = ""; // Reset value for future changes
          }}
          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-300 focus:outline-none focus:border-accent cursor-pointer"
          defaultValue=""
        >
          <option value="" disabled>Ukuran Font</option>
          <option value="2">Kecil</option>
          <option value="3">Normal</option>
          <option value="4">Sedang</option>
          <option value="5">Besar</option>
          <option value="6">Sangat Besar</option>
        </select>

        {/* Font Color Selector */}
        <select
          onChange={(e) => {
            const color = e.target.value;
            executeCommand("foreColor", color);
            e.target.value = ""; // Reset
          }}
          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-300 focus:outline-none focus:border-accent cursor-pointer"
          defaultValue=""
        >
          <option value="" disabled>Warna Font</option>
          <option value="#ffffff" style={{ color: "#ffffff", backgroundColor: "#0f172a" }}>Putih</option>
          <option value="#00ff99" style={{ color: "#00ff99", backgroundColor: "#0f172a" }}>Hijau Neon</option>
          <option value="#38bdf8" style={{ color: "#38bdf8", backgroundColor: "#0f172a" }}>Biru Muda</option>
          <option value="#fbbf24" style={{ color: "#fbbf24", backgroundColor: "#0f172a" }}>Kuning</option>
          <option value="#f87171" style={{ color: "#f87171", backgroundColor: "#0f172a" }}>Merah</option>
          <option value="#a78bfa" style={{ color: "#a78bfa", backgroundColor: "#0f172a" }}>Ungu</option>
          <option value="#94a3b8" style={{ color: "#94a3b8", backgroundColor: "#0f172a" }}>Abu-abu</option>
        </select>

        <span className="w-px h-5 bg-slate-800 mx-1"></span>

        {/* Lists */}
        <button
          type="button"
          onClick={() => executeCommand("insertUnorderedList")}
          className="p-1.5 rounded hover:bg-slate-850 hover:text-white transition-colors"
          title="Bullet List"
        >
          <LuList size={15} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("insertOrderedList")}
          className="p-1.5 rounded hover:bg-slate-850 hover:text-white transition-colors"
          title="Numbered List"
        >
          <LuListOrdered size={15} />
        </button>

        <span className="w-px h-5 bg-slate-800 mx-1"></span>

        {/* Text Alignment */}
        <button
          type="button"
          onClick={() => executeCommand("justifyLeft")}
          className="p-1.5 rounded hover:bg-slate-850 hover:text-white transition-colors"
          title="Rata Kiri (Align Left)"
        >
          <LuAlignLeft size={15} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("justifyCenter")}
          className="p-1.5 rounded hover:bg-slate-850 hover:text-white transition-colors"
          title="Rata Tengah (Align Center)"
        >
          <LuAlignCenter size={15} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("justifyRight")}
          className="p-1.5 rounded hover:bg-slate-850 hover:text-white transition-colors"
          title="Rata Kanan (Align Right)"
        >
          <LuAlignRight size={15} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("justifyFull")}
          className="p-1.5 rounded hover:bg-slate-850 hover:text-white transition-colors"
          title="Rata Kiri-Kanan (Justify)"
        >
          <LuAlignJustify size={15} />
        </button>

        <span className="w-px h-5 bg-slate-800 mx-1"></span>

        {/* Links, Images, and Code blocks */}
        <button
          type="button"
          onClick={handleLink}
          className="p-1.5 rounded hover:bg-slate-850 hover:text-white transition-colors"
          title="Sisipkan Link"
        >
          <LuLink size={15} />
        </button>
        <button
          type="button"
          onClick={handleImage}
          className="p-1.5 rounded hover:bg-slate-850 hover:text-white transition-colors"
          title="Sisipkan URL Gambar"
        >
          <LuImage size={15} />
        </button>
        <button
          type="button"
          onClick={handleCode}
          className="p-1.5 rounded hover:bg-slate-850 hover:text-white transition-colors"
          title="Sisipkan Blok Kode / Kodingan"
        >
          <LuCode size={15} />
        </button>
      </div>

      {/* Editor Content editable field */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-[220px] text-sm text-slate-100 placeholder-slate-500 focus:outline-none overflow-y-auto bg-slate-900/60 rich-text-content leading-relaxed"
        style={{ outline: "none" }}
        data-placeholder={placeholder}
      />
    </div>
  );
}
