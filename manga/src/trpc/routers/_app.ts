
import {  createTRPCRouter } from '../init';
import { categoryRouter } from '@/modules/category/server/procedure';
import { bannerRouter } from '@/modules/brand/server/procedure';
import { authRouter } from '@/modules/auth/server/procedures';
import { mangasRouter } from '@/modules/manga/server/procedure';
import { commentRouter } from '@/modules/comments/server/procedure';
import { ChapterRouter } from '@/modules/chapter/server/procedure';
import { historyRouter } from '@/modules/history/server/produreces';


export const appRouter = createTRPCRouter({
    category: categoryRouter,
    brand: bannerRouter,
    auth: authRouter,
    magas: mangasRouter,
    comments: commentRouter,
    chapter: ChapterRouter,
    history: historyRouter

});
// export type definition of API
export type AppRouter = typeof appRouter;