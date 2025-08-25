import * as React from "react";
import {
  MDXEditor,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  Separator,
  CodeToggle,
  CreateLink,
  InsertImage,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkDialogPlugin,
  imagePlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

type Props = {
  value: string;
  onChange: (markdown: string) => void;
  disabled?: boolean;
  className?: string;
};

export default function RichMarkdownEditor({
  value,
  onChange,
  disabled,
  className,
}: Props) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  // Upload img
  const imageUploadHandler = React.useCallback(
    async (file: File): Promise<string> => {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", uploadPreset);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: fd,
        },
      );
      const json = await res.json();
      if (!res.ok)
        throw new Error(json?.error?.message || "Cloudinary upload failed");
      return json.secure_url as string;
    },
    [cloudName, uploadPreset],
  );

  return (
    <div className={className}>
      <MDXEditor
        markdown={value}
        onChange={onChange}
        plugins={[
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <Separator />
                <BlockTypeSelect />
                <Separator />
                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <Separator />
                <ListsToggle />
                <Separator />
                <CreateLink />
                <InsertImage />
              </>
            ),
          }),
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkDialogPlugin(),
          imagePlugin({ imageUploadHandler }),
        ]}
        readOnly={disabled}
        contentEditableClassName="prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none"
      />
    </div>
  );
}
