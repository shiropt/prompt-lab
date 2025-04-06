"use client"

import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Button } from "@/components/ui/button"
import { Bold, Italic, List, ListOrdered, Code, Heading1, Heading2, Undo, Redo, Quote } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "内容を入力してください...",
  className = "",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class: "prose prose-invert prose-sm focus:outline-none max-w-none min-h-[100px] px-3 py-2 text-slate-200",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className={`border rounded-md overflow-hidden ${className}`}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="min-h-[100px]" />
      {!value && !editor?.isFocused && (
        <div className="absolute top-[70px] left-3 text-slate-500 pointer-events-none">{placeholder}</div>
      )}
    </div>
  )
}

interface MenuBarProps {
  editor: Editor | null
}

function MenuBar({ editor }: MenuBarProps) {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-1 p-1 border-b border-slate-700 bg-slate-800">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`h-8 px-2 ${editor.isActive("bold") ? "bg-slate-700" : ""} hover:bg-slate-700 text-slate-300 hover:text-slate-200 transition-colors`}
        title="太字"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`h-8 px-2 ${editor.isActive("italic") ? "bg-slate-700" : ""} hover:bg-slate-700 text-slate-300 hover:text-slate-200 transition-colors`}
        title="斜体"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`h-8 px-2 ${editor.isActive("heading", { level: 1 }) ? "bg-slate-700" : ""} hover:bg-slate-700 text-slate-300 hover:text-slate-200 transition-colors`}
        title="見出し1"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`h-8 px-2 ${editor.isActive("heading", { level: 2 }) ? "bg-slate-700" : ""} hover:bg-slate-700 text-slate-300 hover:text-slate-200 transition-colors`}
        title="見出し2"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`h-8 px-2 ${editor.isActive("bulletList") ? "bg-slate-700" : ""} hover:bg-slate-700 text-slate-300 hover:text-slate-200 transition-colors`}
        title="箇条書き"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`h-8 px-2 ${editor.isActive("orderedList") ? "bg-slate-700" : ""} hover:bg-slate-700 text-slate-300 hover:text-slate-200 transition-colors`}
        title="番号付きリスト"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`h-8 px-2 ${editor.isActive("codeBlock") ? "bg-slate-700" : ""} hover:bg-slate-700 text-slate-300 hover:text-slate-200 transition-colors`}
        title="コードブロック"
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`h-8 px-2 ${editor.isActive("blockquote") ? "bg-slate-700" : ""} hover:bg-slate-700 text-slate-300 hover:text-slate-200 transition-colors`}
        title="引用"
      >
        <Quote className="h-4 w-4" />
      </Button>
      <div className="ml-auto flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 px-2 hover:bg-slate-700 text-slate-300 hover:text-slate-200 disabled:text-slate-600 transition-colors"
          title="元に戻す"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 px-2 hover:bg-slate-700 text-slate-300 hover:text-slate-200 disabled:text-slate-600 transition-colors"
          title="やり直し"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

