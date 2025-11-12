import { router } from "@/trpc/server";
import { articleRouter } from "./article";
import { authorRouter } from "./author";
import { categoryRouter } from "./category";
import { tagRouter } from "./tag";
import { userRouter } from "./user";

export const cmsRouter = router({
  author: authorRouter,
  article: articleRouter,
  category: categoryRouter,
  tag: tagRouter,
  user: userRouter,
});

export type CmsRouter = typeof cmsRouter;
