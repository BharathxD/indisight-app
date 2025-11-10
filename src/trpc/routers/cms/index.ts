import { router } from "@/trpc/server";
import { articleRouter } from "./article";
import { authorRouter } from "./author";
import { categoryRouter } from "./category";
import { tagRouter } from "./tag";

export const cmsRouter = router({
  author: authorRouter,
  article: articleRouter,
  category: categoryRouter,
  tag: tagRouter,
});

export type CmsRouter = typeof cmsRouter;
