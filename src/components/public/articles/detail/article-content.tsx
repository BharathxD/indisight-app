type ArticleContentProps = {
  htmlContent: string;
};

export const ArticleContent = ({ htmlContent }: ArticleContentProps) => {
  return (
    <div className="minimal-tiptap-editor mb-16">
      <div
        className="ProseMirror"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: content is trusted
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
};
