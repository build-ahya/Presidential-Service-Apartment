'use client';

import { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { MediaPickerDialog } from './media/media-picker';

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write something…',
  className,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [picker, setPicker] = useState(false);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: { openOnClick: false, autolink: true } }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-48 px-4 py-3 outline-none dark:prose-invert',
      },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? '' : editor.getHTML()),
  });

  // Pick up external changes (loading a record) without clobbering typing.
  useEffect(() => {
    if (editor && value !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return <div className={cn('min-h-64 rounded-lg border bg-muted/30', className)} />;

  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL', previous ?? 'https://');
    if (url === null) return;
    if (url === '') editor.chain().focus().extendMarkRange('link').unsetLink().run();
    else editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const btn = (pressed: boolean, onClick: () => void, label: string, icon: React.ReactNode) => (
    <Toggle size='sm' pressed={pressed} onPressedChange={onClick} aria-label={label} title={label}>
      {icon}
    </Toggle>
  );

  return (
    <div className={cn('overflow-hidden rounded-lg border bg-background focus-within:ring-2 focus-within:ring-ring/40', className)}>
      <div className='flex flex-wrap items-center gap-0.5 border-b bg-muted/40 p-1'>
        {btn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), 'Bold', <Bold />)}
        {btn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), 'Italic', <Italic />)}
        <Separator orientation='vertical' className='mx-1 h-5' />
        {btn(editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'Heading', <Heading2 />)}
        {btn(editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), 'Subheading', <Heading3 />)}
        <Separator orientation='vertical' className='mx-1 h-5' />
        {btn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), 'Bulleted list', <List />)}
        {btn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), 'Numbered list', <ListOrdered />)}
        {btn(editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run(), 'Quote', <Quote />)}
        <Separator orientation='vertical' className='mx-1 h-5' />
        {btn(editor.isActive('link'), setLink, 'Link', <Link2 />)}
        {btn(false, () => setPicker(true), 'Insert image', <ImagePlus />)}
        <div className='ml-auto flex'>
          {btn(false, () => editor.chain().focus().undo().run(), 'Undo', <Undo2 />)}
          {btn(false, () => editor.chain().focus().redo().run(), 'Redo', <Redo2 />)}
        </div>
      </div>
      <EditorContent editor={editor} />
      <MediaPickerDialog
        open={picker}
        onOpenChange={setPicker}
        onPick={([a]) => a && editor.chain().focus().setImage({ src: a.url, alt: a.alt }).run()}
      />
    </div>
  );
}
