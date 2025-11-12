import { TextStyle } from "@tiptap/extension-text-style";
import { Typography } from "@tiptap/extension-typography";
import { Placeholder, Selection } from "@tiptap/extensions";
import type { Content, Editor, UseEditorOptions } from "@tiptap/react";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import * as React from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import {
  CodeBlockLowlight,
  Color,
  FileHandler,
  HorizontalRule,
  Image,
  ResetMarksOnEnter,
  UnsetAllMarks,
} from "../extensions";
import { fileToBase64, getOutput, randomId } from "../utils";
import { useThrottle } from "./use-throttle";

export interface UseMinimalTiptapEditorProps extends UseEditorOptions {
  value?: Content;
  output?: "html" | "json" | "text";
  placeholder?: string;
  editorClassName?: string;
  throttleDelay?: number;
  onUpdate?: (content: Content) => void;
  onBlur?: (content: Content) => void;
  uploader?: (file: File) => Promise<string>;
}

const createR2Uploader =
  (uploadMutation: ReturnType<typeof trpc.file.uploadFile.useMutation>) =>
  async (file: File): Promise<string> => {
    const base64 = await fileToBase64(file);
    const { publicUrl } = await uploadMutation.mutateAsync({
      filename: file.name,
      contentType: file.type,
      content: base64.split(",")[1],
      folder: "articles",
    });
    return publicUrl;
  };

const createExtensions = ({
  placeholder,
  uploader,
}: {
  placeholder: string;
  uploader?: (file: File) => Promise<string>;
}) => [
  StarterKit.configure({
    blockquote: { HTMLAttributes: { class: "block-node" } },
    // bold
    bulletList: { HTMLAttributes: { class: "list-node" } },
    code: { HTMLAttributes: { class: "inline", spellcheck: "false" } },
    codeBlock: false,
    // document
    dropcursor: { width: 2, class: "ProseMirror-dropcursor border" },
    // gapcursor
    // hardBreak
    heading: { HTMLAttributes: { class: "heading-node" } },
    // undoRedo
    horizontalRule: false,
    // italic
    // listItem
    // listKeymap
    link: {
      enableClickSelection: true,
      openOnClick: false,
      HTMLAttributes: {
        class: "link",
      },
    },
    orderedList: { HTMLAttributes: { class: "list-node" } },
    paragraph: { HTMLAttributes: { class: "text-node" } },
    // strike
    // text
    // underline
    // trailingNode
  }),
  Image.configure({
    allowedMimeTypes: ["image/*"],
    maxFileSize: 5 * 1024 * 1024,
    allowBase64: true,
    uploadFn: uploader,
    onToggle(editor, files, pos) {
      editor.commands.insertContentAt(
        pos,
        files.map((image) => {
          const blobUrl = URL.createObjectURL(image);
          const id = randomId();

          return {
            type: "image",
            attrs: {
              id,
              src: blobUrl,
              alt: image.name,
              title: image.name,
              fileName: image.name,
            },
          };
        })
      );
    },
    onImageRemoved({ id, src }) {
      console.log("Image removed", { id, src });
    },
    onValidationError(errors) {
      for (const error of errors) {
        toast.error("Image validation error", {
          position: "bottom-right",
          description: error.reason,
        });
      }
    },
    onActionSuccess({ action }) {
      const mapping = {
        copyImage: "Copy Image",
        copyLink: "Copy Link",
        download: "Download",
      };
      toast.success(mapping[action], {
        position: "bottom-right",
        description: "Image action success",
      });
    },
    onActionError(error, { action }) {
      const mapping = {
        copyImage: "Copy Image",
        copyLink: "Copy Link",
        download: "Download",
      };
      toast.error(`Failed to ${mapping[action]}`, {
        position: "bottom-right",
        description: error.message,
      });
    },
  }),
  FileHandler.configure({
    allowBase64: true,
    allowedMimeTypes: ["image/*"],
    maxFileSize: 5 * 1024 * 1024,
    onDrop: async (editor, files, pos) => {
      for (const file of files) {
        const blobUrl = URL.createObjectURL(file);
        const id = randomId();

        editor.commands.insertContentAt(pos, {
          type: "image",
          attrs: {
            id,
            src: blobUrl,
            alt: file.name,
            title: file.name,
            fileName: file.name,
          },
        });

        if (uploader) {
          try {
            const uploadedUrl = await uploader(file);
            editor.commands.updateAttributes("image", {
              src: uploadedUrl,
            });
            URL.revokeObjectURL(blobUrl);
          } catch (error) {
            toast.error("Upload failed", {
              position: "bottom-right",
              description:
                error instanceof Error ? error.message : "Unknown error",
            });
          }
        }
      }
    },
    onPaste: async (editor, files) => {
      for (const file of files) {
        const blobUrl = URL.createObjectURL(file);
        const id = randomId();

        editor.commands.insertContent({
          type: "image",
          attrs: {
            id,
            src: blobUrl,
            alt: file.name,
            title: file.name,
            fileName: file.name,
          },
        });

        if (uploader) {
          try {
            const uploadedUrl = await uploader(file);
            editor.commands.updateAttributes("image", {
              src: uploadedUrl,
            });
            URL.revokeObjectURL(blobUrl);
          } catch (error) {
            toast.error("Upload failed", {
              position: "bottom-right",
              description:
                error instanceof Error ? error.message : "Unknown error",
            });
          }
        }
      }
    },
    onValidationError: (errors) => {
      for (const error of errors) {
        toast.error("Image validation error", {
          position: "bottom-right",
          description: error.reason,
        });
      }
    },
  }),
  Color,
  TextStyle,
  Selection,
  Typography,
  UnsetAllMarks,
  HorizontalRule,
  ResetMarksOnEnter,
  CodeBlockLowlight,
  Placeholder.configure({ placeholder: () => placeholder }),
];

export const useMinimalTiptapEditor = ({
  value,
  output = "html",
  placeholder = "",
  editorClassName,
  throttleDelay = 0,
  onUpdate,
  onBlur,
  uploader,
  ...props
}: UseMinimalTiptapEditorProps) => {
  const uploadMutation = trpc.file.uploadFile.useMutation();

  const r2Uploader = React.useMemo(
    () => createR2Uploader(uploadMutation),
    [uploadMutation]
  );

  const throttledSetValue = useThrottle(
    (value: Content) => onUpdate?.(value),
    throttleDelay
  );

  const handleUpdate = React.useCallback(
    (editor: Editor) => throttledSetValue(getOutput(editor, output)),
    [output, throttledSetValue]
  );

  const handleCreate = React.useCallback(
    (editor: Editor) => {
      if (value && editor.isEmpty) {
        editor.commands.setContent(value);
      }
    },
    [value]
  );

  const handleBlur = React.useCallback(
    (editor: Editor) => onBlur?.(getOutput(editor, output)),
    [output, onBlur]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: createExtensions({
      placeholder,
      uploader: uploader || r2Uploader,
    }),
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        class: cn("focus:outline-hidden", editorClassName),
      },
    },
    onUpdate: ({ editor }) => handleUpdate(editor),
    onCreate: ({ editor }) => handleCreate(editor),
    onBlur: ({ editor }) => handleBlur(editor),
    ...props,
  });

  return editor;
};

export default useMinimalTiptapEditor;
