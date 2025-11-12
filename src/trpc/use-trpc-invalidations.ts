import { trpc } from "@/trpc/client";

export const useTrpcInvalidations = () => {
  const utils = trpc.useUtils();

  const invalidateArticleGraph = async () => {
    await Promise.all([
      utils.cms.article.invalidate(),
      utils.cms.category.invalidate(),
      utils.cms.tag.invalidate(),
      utils.cms.author.invalidate(),
    ]);
  };

  const invalidateCategoryGraph = async () => {
    await Promise.all([
      utils.cms.category.invalidate(),
      utils.cms.article.invalidate(),
    ]);
  };

  const invalidateAuthorGraph = async () => {
    await Promise.all([
      utils.cms.author.invalidate(),
      utils.cms.article.invalidate(),
    ]);
  };

  const invalidateTagGraph = async () => {
    await utils.cms.tag.invalidate();
  };

  return {
    invalidateArticleGraph,
    invalidateCategoryGraph,
    invalidateAuthorGraph,
    invalidateTagGraph,
    utils,
  };
};
